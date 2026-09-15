import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  // Allow requests from your GitHub Pages website
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://avengers14673-bit.github.io"
  );
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Only POST requests are allowed."
    });
  }

  try {
    const { message } = req.body || {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "Please provide a message."
      });
    }

    if (message.length > 4000) {
      return res.status(400).json({
        error: "Message is too long."
      });
    }

    const response = await client.responses.create({
      model: "gpt-5",
      instructions:
        "You are JARVIS, Siddarth's personal AI assistant. " +
        "Be helpful, clear, concise, and friendly. " +
        "Never claim to have performed an action unless it actually happened. " +
        "For phone actions, explain when Android permissions or user confirmation are required.",
      input: message,
      max_output_tokens: 500
    });

    return res.status(200).json({
      reply: response.output_text
    });

  } catch (error) {
    console.error("JARVIS API error:", error);

    return res.status(500).json({
      error: "JARVIS is temporarily unavailable."
    });
  }
}
