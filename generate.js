export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
 res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end(); // Handle preflight
  }

  // Proxy logic
  const openaiResponse = await fetch("https://api.openai.com/v1/assistants/...", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(req.body)
  });

  const data = await openaiResponse.json();
  res.status(openaiResponse.status).json(data);
}
