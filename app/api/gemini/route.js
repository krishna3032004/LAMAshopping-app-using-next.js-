export const POST = async (req) => {
    try {
      const { message } = await req.json();
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
     const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: message }] }] }),
      });
      const data = await response.json();
      return Response.json(data, { status: 200 });
    } catch (error) {
      return Response.json({ error: "Failed to fetch response" }, { status: 500 });
    }
  };

