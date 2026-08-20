import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Body parser for JSON with large payload support for images (up to 20MB)
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// Lazy initialize Gemini client
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY);
  res.json({
    status: "ok",
    aiEngine: hasKey ? "online" : "demo_mode",
    timestamp: new Date().toISOString(),
  });
});

// Diagnostic System Prompt as specified in Section 7
const SYSTEM_PROMPT = `You are AutoSight AI's vehicle damage analysis engine. You are given one or
more photographs of a vehicle. Analyze ONLY what is visibly present in the
image(s) and return a single structured JSON object matching the
VehicleDiagnosis schema. Follow these rules exactly:

1. Analyze only visible evidence in the provided image(s).
2. Never invent or assume hidden damage that is not visible.
3. Clearly distinguish confirmed visible damage from suspected/possible
   damage using the condition field (DAMAGED vs POSSIBLY_DAMAGED vs
   INSPECTION_REQUIRED).
4. Identify vehicle make/model only when reasonably confident; otherwise
   report a low confidence value rather than guessing.
5. Estimate affected parts based on visible damage and typical vehicle
   construction, not assumptions about this specific vehicle's history.
6. Assign a numeric confidence value (0-100) to every identification,
   damage area, and affected part.
7. Recommend technician inspection wherever mechanical, structural, or
   internal verification would be required.
8. Do not claim certainty about internal mechanical components (engine,
   transmission, suspension, electronics) from exterior images alone.
9. Do not provide unsafe repair instructions or advice that bypasses
   manufacturer safety procedures.
10. Return ONLY valid JSON matching the provided schema — no prose, no
    markdown fences, no commentary before or after the JSON.
11. Keep explanations concise and understandable to a garage technician,
    avoiding unnecessary jargon.
12. Use INR for all cost estimates (Indian demo environment).
13. Label every cost figure as an estimate — never state a cost as exact
    or guaranteed.
14. Never represent the result as an official manufacturer diagnosis or
    an official manufacturer price.
15. If the image is too blurry, too dark, not a vehicle, heavily
    obstructed, or otherwise insufficient for a reliable analysis, return
    a result where limitations clearly states
    "Image quality insufficient for reliable analysis" and confidence
    values are low — do not fabricate a confident result.

Return JSON matching exactly the VehicleDiagnosis / DamageArea /
AffectedPart / Recommendation / CostEstimate shapes defined in the
application's data model. Do not add extra top-level fields.`;

// API endpoint for vehicle image diagnosis
app.post("/api/diagnose", async (req, res) => {
  try {
    const { imageBase64, mimeType = "image/jpeg", vehicleContext } = req.body;

    if (!imageBase64) {
      return res.status(400).json({
        error: "Missing image data",
        message: "Please upload an image to analyze.",
      });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        error: "GEMINI_API_KEY_UNAVAILABLE",
        message: "Gemini API key is not configured. Use Demo Analysis Mode.",
      });
    }

    // Clean base64 string if it contains data URI header
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+]+;base64,/, "");

    const promptText = `Analyze this vehicle damage photograph. 
${vehicleContext ? `Vehicle hint / context provided by user: Make: ${vehicleContext.make || 'Unknown'}, Model: ${vehicleContext.model || 'Unknown'}, Year: ${vehicleContext.year || 'Unknown'}.` : ''}

Output a strictly conforming JSON object following the VehicleDiagnosis schema:
{
  "vehicleIdentification": {
    "make": string,
    "model": string,
    "confidence": number (0-100)
  },
  "overallSeverity": "LOW" | "MODERATE" | "HIGH" | "CRITICAL",
  "damageAreas": [
    {
      "area": string (e.g. "Front Bumper Fascia", "Right Headlamp Assembly", "Right Front Fender", "Hood Panel"),
      "damageType": string (e.g. "Cracking & Scuffing", "Lens Fracture & Misalignment", "Deformation & Paint Transfer"),
      "severity": string ("LOW" | "MODERATE" | "HIGH" | "CRITICAL"),
      "confidence": number (0-100),
      "explanation": string
    }
  ],
  "affectedParts": [
    {
      "partName": string,
      "location": string,
      "condition": "DAMAGED" | "POSSIBLY_DAMAGED" | "INSPECTION_REQUIRED",
      "action": "REPAIR" | "REPLACE" | "INSPECT",
      "confidence": number (0-100),
      "estimatedPartCost": number (in INR, e.g. 15000 to 120000 depending on part and car class)
    }
  ],
  "recommendations": [
    {
      "priority": "HIGH" | "MEDIUM" | "LOW",
      "action": string,
      "reason": string
    }
  ],
  "estimatedCost": {
    "partsCost": number,
    "labourCost": number,
    "calibrationCost": number,
    "miscellaneousCost": number,
    "estimatedTotal": number,
    "currency": "INR"
  },
  "safetyWarnings": [string],
  "technicianNotes": [string],
  "limitations": [string],
  "confidence": number (0-100)
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: [
        {
          parts: [
            {
              inlineData: {
                mimeType: mimeType || "image/jpeg",
                data: cleanBase64,
              },
            },
            {
              text: promptText,
            },
          ],
        },
      ],
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const rawText = response.text || "{}";
    res.json({
      success: true,
      rawResponse: rawText,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Gemini diagnosis error:", error);
    res.status(500).json({
      error: "ANALYSIS_FAILED",
      message: "AI analysis encountered an error. You can continue with Demo Analysis Mode.",
      details: error?.message ? error.message.slice(0, 150) : "Unknown error",
    });
  }
});

// Boot Vite or Static Files
async function start() {
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
    console.log(`AutoSight AI server active on port ${PORT}`);
  });
}

start();
