import { supabase } from './supabaseClient';
const { GoogleGenerativeAI } = require('@google/generative-ai');

// FIX: 'gemini-2.5-flash-lite' is likely a typo. 
// Using 'gemini-1.5-flash' which is the current stable fast model.
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

export const analyzePrivacyPolicy = async (policyText) => {
  try {
    const { data: session } = await supabase.auth.getSession();
    const token = session?.session?.access_token;

    if (!token) {
      throw new Error('Authentication required');
    }

    const prompt = `
      Act as a Data Privacy Auditor and Security Expert. Analyze the following privacy policy text critically.

      Privacy Policy Text:
      "${policyText}"
      
      --------------------------
      
      ### Scoring Rubric (Start with 50 points - Neutral):
      1. **Deduct points (down to 20)** for: 
         - Selling data to third parties.
         - Vague language (e.g., "we may share", "affiliates").
         - Forced arbitration clauses.
         - Lack of contact details.
         - Collecting unrelated data (e.g., location for a calculator).
      2. **Add points (up to 95)** for: 
         - Explicit mention of Encryption (AES, SSL/TLS).
         - Clear "Right to Delete" instructions.
         - Explicit statement that data is NOT sold.
         - Short, defined data retention periods.
     
      ### Instructions:
      1. Summarize key points (under 100 words).
      2. Explain the specific impact on user data privacy.
      3. Explain what this means for the user in practical terms.
      4. Calculate the Safety Score based strictly on the Rubric above.
      5. Identify specific Red Flags (Negative findings) and Green Flags (Positive findings).

      ### Required Output Format:
      (Strictly follow this layout so my system can parse it)

      **Summary:** [Your summary here]
      **Safety Score:** [Just the number, e.g., 45]
      **Impact on User Data Privacy and Security:** [Your analysis here]
      **What this policy means for users:** [Your practical explanation here]
      **Red Flags:** - [Flag 1]
      - [Flag 2]
      **Green Flags:** - [Flag 1]
      - [Flag 2]
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    console.log("AI Response:", responseText);

    // --- Regex Parsing ---

    const summaryMatch = responseText.match(/\*\*Summary:\*\*\s*([\s\S]+?)(?=\*\*Safety Score:)/i);
    const scoreMatch = responseText.match(/\*\*Safety Score:\*\*\s*(\d+)/i);
    const impactMatch = responseText.match(/\*\*Impact on User Data Privacy and Security:\*\*\s*([\s\S]+?)(?=\*\*What this policy means)/i);
    
    // Updated to stop at "Red Flags"
    const userImpactMatch = responseText.match(/\*\*What this policy means for users:\*\*\s*([\s\S]+?)(?=\*\*Red Flags:)/i);
    
    // Updated to capture list content between headers
    const redFlagsMatch = responseText.match(/\*\*Red Flags:\*\*\s*([\s\S]+?)(?=\*\*Green Flags:)/i);
    const greenFlagsMatch = responseText.match(/\*\*Green Flags:\*\*\s*([\s\S]+)/i);

    // Helper to clean up bullet points
    const extractFlags = (text) =>
      text
        ? text
            .split('\n')
            .map(l => l.replace(/^[-•*]\s*/, '').trim()) // Removes bullets (-, •, *)
            .filter(line => line.length > 0) // Removes empty lines
        : [];

    const summary = summaryMatch ? summaryMatch[1].trim() : "Summary not found.";
    const safetyScore = scoreMatch ? parseInt(scoreMatch[1], 10) : 0;
    const impact = impactMatch ? impactMatch[1].trim() : "Impact details not found.";
    const userImpact = userImpactMatch ? userImpactMatch[1].trim() : "User implications not found.";

    const redFlags = extractFlags(redFlagsMatch?.[1]);
    const greenFlags = extractFlags(greenFlagsMatch?.[1]);

    return {
      summary,
      safetyScore,
      impact,
      userImpact,
      redFlags,
      greenFlags
    };

  } catch (error) {
    console.error('Error analyzing privacy policy:', error);
    throw error;
  }
};



