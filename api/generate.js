export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const { prompt } = req.body;

  const response = await fetch("https://api.openai.com/v1/assistants/asst_8TgGSF4i8KJqzEUMqMIvCblE/runs", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ input: { prompt } })
  });

  const data = await response.json();
  res.status(200).json(data);
}
