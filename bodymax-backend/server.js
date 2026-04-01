import dotenv from "dotenv";
dotenv.config();

console.log("ENV TEST:", process.env.OPENAI_API_KEY ? "Key is loaded!" : "Key missing!");

import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

const app = express(); 

app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',
      'https://ai-physique-assessment.vercel.app' 
    ];
    
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' })); 

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// ==========================================
// CORE AI PROTOCOL GENERATION ENDPOINT
// ==========================================
app.post('/api/generate-protocol', async (req, res) => {
  try {
    const { userId, assessmentData } = req.body;

    if (!userId || !assessmentData) {
      return res.status(400).json({ error: "Missing userId or assessmentData" });
    }

    console.log(`[AI ENGINE] Processing Ultra-Smart Protocol for user: ${userId}`);

    const workoutDays = assessmentData.days ? parseInt(assessmentData.days) : 4;
    
    let completeUserProfile = "";
    for (const [key, value] of Object.entries(assessmentData)) {
      if (key !== 'photos' && key !== 'photoFiles' && key !== 'customGoalPhoto' && key !== 'dreamPhysiqueImage' && value) {
        const formattedValue = Array.isArray(value) ? value.join(', ') : 
                               typeof value === 'object' ? JSON.stringify(value) : value;
        completeUserProfile += `- ${key.toUpperCase()}: ${formattedValue}\n`;
      }
    }

    const systemPrompt = `
      You are BodyMax AI, an elite, world-class fitness coach.
      Analyze the profile and generate a hyper-personalized plan.
      
      === USER'S DEEP PROFILE ===
      ${completeUserProfile}
      ===========================

      You MUST respond ONLY in valid JSON format matching this exact structure:
      {
        "body_analysis": {
          "score": 65,
          "classification": "String",
          "estimated_bf": "String",
          "bmr": 1850,
          "tdee": 2450,
          "strengths": ["string"],
          "weaknesses": ["string"],
          "vectors": { "upper_body": 60, "lower_body": 55, "core": 40, "symmetry": 70 },
          "executive_summary": "3-4 sentence summary."
        },
        "macros": { "calories": 2500, "protein": 180, "carbs": 250, "fats": 70 },
        "nutrition": {
          "strategy": "String",
          "meals": [
            { "name": "Breakfast", "food": "String", "cals": 450, "p": 30, "c": 35, "f": 20 }
          ]
        },
        "roadmap": [
          { "phase": "Weeks 1-4", "description": "String" }
        ],
        "workouts": [
          { 
            "title": "String", 
            "targets": ["String"], 
            "intensity": "High", 
            "exercises": [ 
              { "name": "Exercise Name", "sets": 4, "reps": "8-10", "rest": "90s", "notes": "String" } 
            ] 
          }
        ]
      }
      CRITICAL: The "workouts" array MUST contain EXACTLY ${workoutDays} objects.
    `;

    let contentArray = [{ type: "text", text: "Please analyze my profile and generate the exact JSON response." }];

    if (assessmentData.photos) {
      Object.values(assessmentData.photos).forEach(photoUrl => {
        if (photoUrl && photoUrl.startsWith('http')) {
          contentArray.push({ type: "image_url", image_url: { url: photoUrl } });
        }
      });
    }

    if (assessmentData.dreamPhysiqueImage || assessmentData.goalImageUrl) {
      const goalImg = assessmentData.dreamPhysiqueImage || assessmentData.goalImageUrl;
      contentArray.push({ type: "image_url", image_url: { url: goalImg } });
    }

    let completion;
    try {
      // FIXED: Timeout moved to the second argument (options object)
      completion = await openai.chat.completions.create({
        model: "gpt-4o",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: contentArray }
        ],
      }, {
        timeout: 60000, 
      });
    } catch (aiError) {
      console.error("OpenAI Error:", aiError.message);
      if (aiError.message.includes("downloading") || aiError.message.includes("image")) {
        console.log("Retrying without images...");
        // FIXED: Timeout moved here too
        completion = await openai.chat.completions.create({
          model: "gpt-4o",
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: "Analyze based on text assessment only." }
          ],
        }, {
          timeout: 60000,
        });
      } else {
        throw aiError;
      }
    }

    let aiContent = completion.choices[0].message.content.trim();
    const generatedJSON = JSON.parse(aiContent);

    const { error: dbError } = await supabase
      .from('profiles')
      .update({ ai_protocol: generatedJSON })
      .eq('id', userId);

    if (dbError) throw new Error("Failed to save to Supabase");

    res.status(200).json({ success: true, protocol: generatedJSON });

  } catch (error) {
    console.error("[SERVER ERROR]:", error);
    res.status(500).json({ error: error.message || "Failed to generate AI protocol" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 BodyMax Smart Server running on port ${PORT}`));