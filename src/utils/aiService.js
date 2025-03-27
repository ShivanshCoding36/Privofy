import { supabase } from './supabaseClient';
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

export const analyzePrivacyPolicy = async (policyText) => {
  try {
    const { data: session } = await supabase.auth.getSession();
    const token = session?.session?.access_token;

    if (!token) {
      throw new Error('Authentication required');
    }

    const prompt = `
      Analyze the following privacy policy:
      ${policyText}
      
      1. Summarize its key points in less than 100 words.
      2. Explain its impact on user data privacy and security.
      3. What does this policy mean for the user in terms of data privacy and security?
      4. Assign a safety score from 1 to 100 (higher is safer).

      Return the results in this format:
      **Summary:** [summary]
      **Safety Score:** [score]
      **Impact on User Data Privacy and Security:** [impact]
      **What this policy means for users:** [user impact]
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    console.log("AI Response:", responseText);

    // Improved regex patterns to capture full sections
    const summaryMatch = responseText.match(/\*\*Summary:\*\*\s*(.+?)(?=\*\*Safety Score:|\*\*Impact)/s);
    const scoreMatch = responseText.match(/\*\*Safety Score:\*\*\s*(\d+)/);
    const impactMatch = responseText.match(/\*\*Impact on User Data Privacy and Security:\*\*\s*(.+?)(?=\*\*What this policy means)/s);
    const userImpactMatch = responseText.match(/\*\*What this policy means for users:\*\*\s*(.+)/s);

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
