export async function POST(request) {
  try {
    const { cvText } = await request.json();

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "OPENROUTER_API_KEY environment variable is not set" },
        { status: 500 }
      );
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a brutally honest CV reviewer with a sharp, witty tone. Roast the user's CV in a fun but constructive way — point out weaknesses, cringe-worthy parts, and give actionable suggestions to improve. Respond in English."
          },
          {
            role: "user",
            content: `Here is my CV, please roast it: ${cvText}`
          }
        ]
      })
    });

    const data = await response.json();
    console.log("Response dari OpenRouter:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      return Response.json(
        { error: data.error?.message || "API request failed" },
        { status: response.status }
      );
    }

    if (!data.choices || !data.choices[0]) {
      return Response.json(
        { error: "Invalid response from API" },
        { status: 500 }
      );
    }

    return Response.json({ result: data.choices[0].message.content });
  } catch (error) {
    console.error("Error:", error);
    return Response.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}