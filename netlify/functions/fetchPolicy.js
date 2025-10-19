
export const handler = async (event) => {
  // Get the URL from the query string parameters
  const url = event.queryStringParameters.url;

  // Handle cases where the URL is missing
  if (!url) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing URL parameter" }),
    };
  }

  try {
    // Use the native fetch to get the content from the provided URL
    const response = await fetch(url);
    const text = await response.text();

    // Return the fetched text successfully
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // Allows any website to call this function
        "Content-Type": "text/plain",
      },
      body: text,
    };
  } catch (error) {
    // Log the error for debugging and return a server error response
    console.error("Fetch error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch the provided URL" }),
    };
  }
};
