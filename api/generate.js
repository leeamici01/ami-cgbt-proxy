const fetch = require("node-fetch");

module.exports = async (req, res) => {
  const { prompt } = req.body;

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  const ASSISTANT_ID = process.env.ASSISTANT_ID;

  try {
    const thread = await fetch("https://api.openai.com/v1/threads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({})
    });
    const threadData = await thread.json();
    const threadId = threadData.id;

    await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        role: "user",
        content: prompt
      })
    });

    const run = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        assistant_id: ASSISTANT_ID
      })
    });

    const runData = await run.json();
    const runId = runData.id;

    let status = "queued";
    while (status !== "completed" && status !== "failed") {
      const poll = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${runId}`, {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`
        }
      });
      const pollData = await poll.json();
      status = pollData.status;
      if (status !== "completed") await new Promise(r => setTimeout(r, 1000));
    }

    const msg = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`
      }
    });

    const msgData = await msg.json();
    const value = msgData.data[0].content[0].text.value;
    res.status(200).json({ result: value });

  } catch (e) {
    console.error("Proxy error:", e);
    res.status(500).json({ error: "Assistant proxy error." });
  }
};
