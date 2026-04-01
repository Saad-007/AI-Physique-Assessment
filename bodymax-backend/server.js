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

    // 3. THE MASTER PROMPT: Ultimate Personalization Engine
    const systemPrompt = `
      You are BodyMax AI, an elite biometric analyst and fitness coach.
      
      === USER ASSESSMENT DATA ===
      ${completeUserProfile}
      ===========================

      TASK:
      1. Calculate BMR and TDEE: Use the Mifflin-St Jeor Equation based on the user's Age, Weight, Height, and Gender from the profile.
      2. Calculate Score: Rate their current physique/readiness from 0-100 based on their metrics and activity level.
      3. Vectors: Generate realistic 0-100 scores for Upper Body, Lower Body, Core, and Symmetry based on their "mainStruggle" and "experience".
      4. Workouts: Design exactly ${workoutDays} high-performance workout sessions.

      MANDATORY JSON STRUCTURE (Do not use placeholder text, calculate real values):
      {
        "body_analysis": {
          "score": (Integer between 1-100),
          "classification": "Specific category (e.g., Athletic Overweight, Sedentary Ectomorph)",
          "estimated_bf": "Specific % range based on height/weight",
          "bmr": (Calculated Integer),
          "tdee": (Calculated Integer based on activity level),
          "strengths": ["Two specific physical or psychological strengths"],
          "weaknesses": ["Two specific areas needing immediate improvement"],
          "vectors": { 
            "upper_body": (0-100), 
            "lower_body": (0-100), 
            "core": (0-100), 
            "symmetry": (0-100) 
          },
          "executive_summary": "A 3-4 sentence high-level analysis of their current state and the psychological shift required."
        },
        "macros": { 
          "calories": (Target daily intake), 
          "protein": (Grams), 
          "carbs": (Grams), 
          "fats": (Grams) 
        },
        "nutrition": {
          "strategy": "A custom nutritional approach based on their specific 'diet' and 'sleep' inputs.",
          "meals": [
            { "name": "Meal Name", "food": "Specific food items", "cals": 0, "p": 0, "c": 0, "f": 0 }
          ]
        },
        "roadmap": [
          { "phase": "Weeks 1-4: Foundation", "description": "Specific adaptation details." },
          { "phase": "Weeks 5-8: Progression", "description": "Specific hypertrophy/strength details." },
          { "phase": "Weeks 9-12: Peak", "description": "Expected visual outcome details." }
        ],
        "workouts": [
          { 
            "title": "Workout Name", 
            "targets": ["Muscle Group 1", "Muscle Group 2"], 
            "intensity": "Scale 1-10", 
            "exercises": [ 
              { "name": "Exercise", "sets": 0, "reps": "Range", "rest": "Seconds", "notes": "Form cues" } 
            ] 
          }
        ]
      }

      CRITICAL:
      - NO "String" or "Example" text.
      - Every number must be a calculated estimate based on the user's specific profile.
      - Return EXACTLY ${workoutDays} workouts.
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
      // Correct implementation of timeout in options object
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

    // --- SAFE CONTENT EXTRACTION ---
    const rawContent = completion.choices?.[0]?.message?.content;
    
    if (!rawContent) {
      throw new Error("AI returned an empty response. Please try again.");
    }

    let aiContent = rawContent.trim();

    // Clean up potential markdown formatting if the AI ignores response_format
    if (aiContent.startsWith("```json")) {
      aiContent = aiContent.replace(/^```json/, "").replace(/```$/, "").trim();
    }

    const generatedJSON = JSON.parse(aiContent);

    // --- DATABASE UPDATE ---
    const { error: dbError } = await supabase
      .from('profiles')
      .update({ ai_protocol: generatedJSON })
      .eq('id', userId);

    if (dbError) {
      console.error("Supabase Error:", dbError);
      throw new Error("Failed to save protocol to database");
    }

    res.status(200).json({ success: true, protocol: generatedJSON });

  } catch (error) {
    console.error("[SERVER ERROR]:", error);
    // Send the specific error message back to the frontend for easier debugging
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 BodyMax Smart Server running on port ${PORT}`));