import { supabase } from './supabaseClient';
const { GoogleGenerativeAI } = require('@google/generative-ai');

// NOTE: Using gemini-1.5-flash as it is the current standard. 
// If you have specific access to a newer beta, change this back.
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

export const analyzePrivacyPolicy = async (policyText) => {
  try {
    const { data: session } = await supabase.auth.getSession();
    const token = session?.session?.access_token;

    if (!token) {
      throw new Error('Authentication required');
    }

    // UPDATED PROMPT: Uses additive/subtractive logic to break the "70" bias
    const prompt = `
      Act as a Data Privacy Auditor and Security Expert. Analyze the following privacy policy text critically.

      Privacy Policy Text:
      "${policyText}"
      
      --------------------------
      
      ### Scoring Rubric (Start with 50 points - Neutral):
      1. **Deduct points (down to 0)** for: 
         - Selling data to third parties.
         - Vague language (e.g., "we may share").
         - Forced arbitration clauses.
         - Lack of contact details.
         - Collecting unrelated data (e.g., location for a calculator).
      2. **Add points (up to 100)** for: 
         - Explicit mention of Encryption (AES, SSL/TLS).
         - Clear "Right to Delete" instructions.
         - Explicit statement that data is NOT sold.
         - Short, defined data retention periods.
      
      ### Instructions:
      1. Summarize key points (under 100 words).
      2. Explain the specific impact on user data privacy.
      3. Explain what this means for the user in practical terms.
      4. Calculate the Safety Score based strictly on the Rubric above.

      ### Required Output Format:
      **Summary:** [Your summary here]
      **Safety Score:** [Just the number, e.g., 45]
      **Impact on User Data Privacy and Security:** [Your analysis here]
      **What this policy means for users:** [Your practical explanation here]
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    console.log("AI Response:", responseText);

    // Parsing logic matches the new Prompt Output Format
    const summaryMatch = responseText.match(/\*\*Summary:\*\*\s*([\s\S]+?)(?=\*\*Safety Score:)/);
    const scoreMatch = responseText.match(/\*\*Safety Score:\*\*\s*(\d+)/);
    const impactMatch = responseText.match(/\*\*Impact on User Data Privacy and Security:\*\*\s*([\s\S]+?)(?=\*\*What this policy means)/);
    const userImpactMatch = responseText.match(/\*\*What this policy means for users:\*\*\s*([\s\S]+)/);

    const summary = summaryMatch ? summaryMatch[1].trim() : "Summary not found.";
    const safetyScore = scoreMatch ? parseInt(scoreMatch[1], 10) : 0;
    const impact = impactMatch ? impactMatch[1].trim() : "Impact details not found.";
    const userImpact = userImpactMatch ? userImpactMatch[1].trim() : "User implications not found.";

    return { summary, safetyScore, impact, userImpact };
  } catch (error) {
    console.error('Error analyzing privacy policy:', error);
    throw error;
  }
};


