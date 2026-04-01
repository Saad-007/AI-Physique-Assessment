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
      'https://ai-physique-assessment.vercel.app' // Aapka main production link
    ];
    
    // Allow requests with no origin (like mobile apps or curl) 
    // or if the origin is in our whitelist
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

    // 1. EXTRACT STRICT PARAMETERS (Jo programming ke liye zaroori hain)
    const workoutDays = assessmentData.days ? parseInt(assessmentData.days) : 4;
    const userLocation = assessmentData.location || "Commercial gym";
    
    // 2. DYNAMICALLY FORMAT ALL 18+ ANSWERS FOR THE AI
    // Yeh code automatically aapke 18 questions ka data ek khoobsurat list mein convert kar dega
    let completeUserProfile = "";
    for (const [key, value] of Object.entries(assessmentData)) {
      if (key !== 'photos' && key !== 'photoFiles' && key !== 'customGoalPhoto' && key !== 'dreamPhysiqueImage' && value) {
        // Agar answer array hai (jaise painPoints), toh usay comma se jor do
        const formattedValue = Array.isArray(value) ? value.join(', ') : 
                               typeof value === 'object' ? JSON.stringify(value) : value;
        completeUserProfile += `- ${key.toUpperCase()}: ${formattedValue}\n`;
      }
    }

    // 3. THE MASTER PROMPT: Ultimate Personalization Engine
    const systemPrompt = `
      You are BodyMax AI, an elite, world-class fitness coach and biometric analyst. 
      You speak with extreme confidence, brutal honesty, empathy, and scientific precision.

      Here is the COMPLETE, 18-point psychological and physical assessment of the user:
      
      === USER'S DEEP PROFILE ===
      ${completeUserProfile}
      ===========================

      YOUR TASK:
      Analyze EVERY single data point from the profile above (Age, Metrics like Height/Weight, Diet, Sleep, Self-Perception, Avoidance, Motivation, etc.) to generate a hyper-personalized plan.

      RULES FOR GENERATION:
      1. Gap Analysis (Psychological & Physical): 
         - In the "executive_summary", directly reference how they feel (e.g., if they selected "Avoid taking photos" or feel "Disappointed" in the mirror). 
         - Address their specific "painPoints" and "mainStruggle". Tell them exactly how their current metrics (Height/Weight) relate to their Dream Goal.
      2. Nutrition Strategy: 
         - Tailor the diet specifically to their "diet" answer and "metrics". If they eat "Random/Junk", give them a transition strategy. If they have "Less than 5 hours" of sleep, emphasize macros for recovery.
      3. Workout Generation: 
         - You MUST generate exactly ${workoutDays} distinct workouts. 
         - Equipment Rules: If "location" is "Home gym", strictly use bodyweight or basic dumbbells. If "Commercial gym", use full equipment.
      4. Coach Tone: Adjust your workout notes based on their "motivationLevel" and "experience". Speak directly to their specific demographic (Age).

      You MUST respond ONLY in valid JSON format matching this exact structure:
      {
        "body_analysis": {
          "score": 65,
          "classification": "String (e.g., Skinny-Fat Recomp, Obese Fat Loss, Underweight Gainer)",
          "estimated_bf": "String (e.g., 22-25%)",
          "bmr": 1850,
          "tdee": 2450,
          "strengths": ["Array of 2 strengths based on their profile/photos"],
          "weaknesses": ["Array of 2 exact weaknesses causing their specific pain points"],
          "vectors": { "upper_body": 60, "lower_body": 55, "core": 40, "symmetry": 70 },
          "executive_summary": "A brutally honest, highly personalized 3-4 sentence summary addressing their exact self-perception, age, weight, and mapping the road to their goal."
        },
        "macros": { "calories": 2500, "protein": 180, "carbs": 250, "fats": 70 },
        "nutrition": {
          "strategy": "A strict strategy explaining how to fix their exact current diet habits while managing their specific sleep schedule.",
          "meals": [
            { "name": "Breakfast", "food": "Specific meal", "cals": 450, "p": 30, "c": 35, "f": 20 },
            { "name": "Lunch", "food": "Specific meal", "cals": 600, "p": 50, "c": 65, "f": 10 },
            { "name": "Pre-Workout", "food": "Specific meal", "cals": 220, "p": 25, "c": 27, "f": 2 },
            { "name": "Dinner", "food": "Specific meal", "cals": 550, "p": 45, "c": 40, "f": 20 }
          ]
        },
        "roadmap": [
          { "phase": "Weeks 1-4: Foundation", "description": "Write 2 sentences specific to how their body will initially adapt based on their pain points." },
          { "phase": "Weeks 5-8: Transformation", "description": "Write 2 sentences about specific muscle growth or fat loss happening in their target areas." },
          { "phase": "Weeks 9-12: Realization", "description": "Write 2 sentences explaining what their final physique will look like compared to their starting point." }
        ],
        "workouts": [
          { 
            "title": "Workout Day 1 (e.g., Heavy Push)", 
            "targets": ["Target 1", "Target 2"], 
            "intensity": "High", 
            "exercises": [ 
              { "name": "Exercise Name", "sets": 4, "reps": "8-10", "rest": "90s", "notes": "Specific cue matching their experience level and motivation." } 
            ] 
          }
        ]
      }
      CRITICAL: The "workouts" array MUST contain EXACTLY ${workoutDays} objects.
    `;

    let contentArray = [{ type: "text", text: "Please analyze my profile and generate the exact JSON response." }];

    // 4. Attach CURRENT Body Image URLs (If provided)
    if (assessmentData.photos) {
      contentArray.push({ type: "text", text: "CURRENT BODY PHOTOS:" });
      Object.values(assessmentData.photos).forEach(photoUrl => {
        if (photoUrl && photoUrl.startsWith('http')) {
          contentArray.push({ type: "image_url", image_url: { url: photoUrl } });
        }
      });
    }

    // 5. Attach DREAM Body Image URL (If provided)
    if (assessmentData.dreamPhysiqueImage || assessmentData.goalImageUrl) {
      const goalImg = assessmentData.dreamPhysiqueImage || assessmentData.goalImageUrl;
      contentArray.push({ type: "text", text: "DREAM / GOAL BODY PHOTO:" });
      contentArray.push({ type: "image_url", image_url: { url: goalImg } });
    }

// Request completion from OpenAI
let completion;
try {
  completion = await openai.chat.completions.create({
    model: "gpt-4o",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: contentArray }
    ],
    timeout: 60000, // 60 seconds tak wait kare
  });
} catch (aiError) {
  console.error("OpenAI Error:", aiError.message);
  // Agar image ki wajah se error hai, toh image ke baghair dobara koshish karein
  if (aiError.message.includes("downloading")) {
    console.log("Retrying without images...");
    completion = await openai.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: "Analyze based on text assessment only (images failed to load)." }
      ],
    });
  } else {
    throw aiError;
  }
}

    // 7. SAFE JSON PARSING
    let aiContent = completion.choices[0].message.content.trim();
    if (aiContent.startsWith("```json")) {
      aiContent = aiContent.replace(/^```json/, "").replace(/```$/, "").trim();
    }
    
    const generatedJSON = JSON.parse(aiContent);

    // 8. Save directly to Supabase
    const { error: dbError } = await supabase
      .from('profiles')
      .update({ ai_protocol: generatedJSON })
      .eq('id', userId);

    if (dbError) {
      console.error("[SUPABASE ERROR]:", dbError); 
      throw new Error("Failed to save to Supabase");
    }

    console.log(`[AI ENGINE] Smart Protocol generated and saved for user: ${userId}`);
    res.status(200).json({ success: true, protocol: generatedJSON });

  } catch (error) {
    console.error("[SERVER ERROR]:", error);
    res.status(500).json({ error: error.message || "Failed to generate AI protocol" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 BodyMax Smart Server running on port ${PORT}`));