export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/javascript');

  const apiKey = process.env.GEMINI_KEY || process.env.GEMINI_API_KEY || "";

  res.status(200).send(`
    window.env = Object.freeze({
      GEMINI_KEY: "${apiKey}",
      GEMINI_MODELS: [
        "gemini-2.5-flash",
        "gemini-2.5-flash-lite",
        "gemini-2.0-flash"
      ]
    });
  `);
}