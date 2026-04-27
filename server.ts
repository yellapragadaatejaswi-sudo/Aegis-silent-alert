import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

// Standardizing for Twilio - You will need to add these to your Secrets/Env
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Endpoint to send real SMS
  app.post("/api/send-sms", async (req, res) => {
    const { to, message } = req.body;

    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
      const missing = [];
      if (!TWILIO_ACCOUNT_SID) missing.push('TWILIO_ACCOUNT_SID');
      if (!TWILIO_AUTH_TOKEN) missing.push('TWILIO_AUTH_TOKEN');
      if (!TWILIO_PHONE_NUMBER) missing.push('TWILIO_PHONE_NUMBER');
      
      console.warn(`SMS Simulation: Missing credentials [${missing.join(', ')}].`);
      console.log(`[SIMULATED SMS to ${to}]: ${message}`);
      return res.status(200).json({ 
        success: true, 
        simulated: true, 
        warning: `Missing credentials: ${missing.join(', ')}` 
      });
    }

    try {
      // Lazy-load twilio to avoid crash if not installed yet
      const twilio = (await import("twilio")).default;
      const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

      await client.messages.create({
        body: message,
        from: TWILIO_PHONE_NUMBER,
        to: to,
      });

      res.json({ success: true });
    } catch (error) {
      console.error("SMS Delivery Failed:", error);
      res.status(500).json({ error: "Failed to send SMS" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
