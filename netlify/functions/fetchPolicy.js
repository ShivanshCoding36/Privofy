// netlify/functions/fetchPolicy.js
import fetch from "node-fetch";

export const handler = async (event) => {
  const url = event.queryStringParameters.url;

  if (!url) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing URL parameter" }),
    };
  }

  try {
    const response = await fetch(url);
    const text = await response.text();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // ✅ Important for CORS
        "Content-Type": "text/plain",
      },
      body: text,
    };
  } catch (error) {
    console.error("Fetch error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch URL" }),
    };
  }
};
