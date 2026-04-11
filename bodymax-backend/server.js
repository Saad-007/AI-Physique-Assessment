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

    // Extract dynamic variables
    const workoutDays = assessmentData.days ? parseInt(assessmentData.days) : 4;
    const planDuration = assessmentData.planDuration || "12-Week"; 
    
    let completeUserProfile = "";
    for (const [key, value] of Object.entries(assessmentData)) {
      if (key !== 'photos' && key !== 'photoFiles' && key !== 'customGoalPhoto' && key !== 'dreamPhysiqueImage' && value) {
        const formattedValue = Array.isArray(value) ? value.join(', ') : 
                               typeof value === 'object' ? JSON.stringify(value) : value;
        completeUserProfile += `- ${key.toUpperCase()}: ${formattedValue}\n`;
      }
    }

    // 🔴 THE MASTER PROMPT
    const systemPrompt = `
      You are BodyMax AI, an expert, highly encouraging, and easy-to-understand Fitness Coach. 
      Your objective is to generate a highly effective, personalized physical analysis and training protocol.
      CRITICAL TONE RULE: Use SIMPLE, everyday language that any beginner or intermediate gym-goer can easily understand. AVOID overly scientific jargon, complex medical terms, or robotic language. Talk like a friendly human expert.

      === RAW USER DATA ===
      ${completeUserProfile}
      ===========================

      INSTRUCTIONS:
      1. BIOMETRICS & SCORING (DYNAMIC): 
         - Calculate BMR and TDEE based on profile. 
         - Generate a dynamic "Body Score" (1-100) representing their current state.
         - POTENTIAL: Calculate the user's genetic limit or goal potential (usually 90-98) based on their height and overall goal.
         - DELTAS: Since this is the initial scan, simulate a realistic 'Progression Shift' (e.g., small positive or negative changes like +2.4, -1.2) representing the immediate metabolic or postural adjustments they will experience when starting.
         - STRENGTHS & LIMITERS: Carefully analyze the provided images to identify exactly 4 physical genetic advantages and 4 specific physique bottlenecks holding them back from their dream physique.
         - WORST FEATURE: Name the single muscle group holding them back the most (e.g., "chest development").
      
      2. EQUIPMENT: Strictly match exercises to the user's available equipment (Home vs Commercial Gym).

      3. WORKOUT STRUCTURE RULES (STRICT STRICT STRICT):
         - Each workout day MUST target exactly 2 muscle groups (except standalone Leg days).
         - Each muscle group MUST include EXACTLY 4 exercises. (e.g., 4 Chest + 4 Triceps = 8 total exercises per day).
         - Do NOT repeat the same exercises every day. Ensure maximum variety across the week.
         - The format MUST be clean. In the JSON "name" field, prefix the muscle group like this: "Chest: Bench Press".

      4. WORKOUT SPLIT LOGIC (Based on ${workoutDays} days/week):
         If 4 Days Per Week:
         - Day 1: Chest & Triceps
         - Day 2: Back & Biceps
         - Day 3: Shoulders & Forearms
         - Day 4: Legs & Abs
         
         If 5 Days Per Week:
         - Day 1: Chest & Triceps
         - Day 2: Back & Biceps
         - Day 3: Shoulders & Forearms
         - Day 4: Arms & Abs
         - Day 5: Legs
         
         If 6 Days Per Week:
         - Day 1: Chest & Triceps
         - Day 2: Back & Biceps
         - Day 3: Shoulders & Forearms
         - Day 4: Arms & Abs
         - Day 5: Legs
         - Day 6: Upper Body Aesthetic Focus (weak points)

      5. PROGRESSIVE OVERLOAD RULES (${planDuration}):
         - You MUST include an easy-to-read progressive overload strategy in the "notes" for EVERY exercise.
         - Framework: 
           * Week 1-4 (Focus on form and feeling the muscle)
           * Week 5-8 (Push harder - add a little weight or extra reps)
           * Week 9-12 (Maximum effort - try drop sets or slower movements)

      6. NUTRITION (EXACT & SIMPLE):
         - DO NOT provide generic food lists. Provide EXACT quantities (grams, scoops, cups, etc.) for every single item.

      MANDATORY JSON FORMAT (Strictly dynamic values only - NO PLACEHOLDERS):
      {
        "body_analysis": {
          "overall_rating": [Integer 1-100],
          "potential_rating": [Integer 90-98],
          "dream_body_chances": "[e.g., '92%']",
          "body_fat_percentage": "[Estimated %]",
          "best_feature": "[e.g., 'Broad Shoulders' or 'Strong Core']",
          "worst_feature": "[e.g., 'chest development' or 'shoulder width' (Lowercase)]",
          "strengths": ["[Advantage 1]", "[Advantage 2]", "[Advantage 3]", "[Advantage 4]"],
          "weaknesses": ["[Limiter 1]", "[Limiter 2]", "[Limiter 3]", "[Limiter 4]"],
          "chest_score": [Integer 1-100], "chest_delta": "[e.g., +2.1 or -1.5]",
          "shoulders_score": [Integer 1-100], "shoulders_delta": "[e.g., +3.0]",
          "abs_score": [Integer 1-100], "abs_delta": "[e.g., +1.8]",
          "back_score": [Integer 1-100], "back_delta": "[e.g., +2.5]",
          "legs_score": [Integer 1-100], "legs_delta": "[e.g., +1.5]",
          "arms_score": [Integer 1-100], "arms_delta": "[e.g., +2.2]",
          "executive_summary": "[A 4-sentence friendly, encouraging summary...]"
        },
        "macros": { "calories": [Target], "protein": [Target], "carbs": [Balance], "fats": [Balance] },
        "nutrition": {
          "strategy": "[Explain the 'Why' behind these macros in simple terms]",
          "meals": [ { "name": "Meal 1", "food": "Exact grams/scoops\\nExact grams", "cals": 0, "p": 0, "c": 0, "f": 0 } ]
        },
        "roadmap": [
          { "phase": "Week 1-4: Foundation", "description": "..." },
          { "phase": "Week 5-8: Pushing Limits", "description": "..." },
          { "phase": "Week 9-12: Final Push & Definition", "description": "..." }
        ],
        "workouts": [
          { 
            "title": "[e.g., Day 1 - Chest & Triceps]", 
            "targets": ["[Muscle 1]", "[Muscle 2]"], 
            "intensity": "[Low, Med, High]", 
            "exercises": [ 
              { "name": "[Muscle]: [Exercise]", "sets": "[e.g., 3-4]", "reps": "[e.g., 8-12]", "rest": "[e.g., 60-90s]", "notes": "[Cue + Progression]" } 
            ] 
          }
        ]
      }

      CRITICAL CONSTRAINTS:
      - Return EXACTLY ${workoutDays} workout objects.
      - Ensure exactly 8 exercises per workout object.
    `;

    let contentArray = [{ type: "text", text: "Please analyze my profile and generate the exact JSON response following the strict 4-exercise rule and split logic." }];

    // Safe URL Filter (Prevents OpenAI from crashing on local Blob URLs)
    const isValidUrl = (url) => typeof url === 'string' && (url.startsWith('https://') || url.startsWith('http://') || url.startsWith('data:image/')) && !url.startsWith('blob:');

    if (assessmentData.photos) {
      Object.values(assessmentData.photos).forEach(photoUrl => {
        if (isValidUrl(photoUrl)) {
          contentArray.push({ type: "image_url", image_url: { url: photoUrl } });
        }
      });
    }

    if (assessmentData.dreamPhysiqueImage || assessmentData.goalImageUrl) {
      const goalImg = assessmentData.dreamPhysiqueImage || assessmentData.goalImageUrl;
      if (isValidUrl(goalImg)) {
        contentArray.push({ type: "image_url", image_url: { url: goalImg } });
      }
    }

    let completion;
    try {
      completion = await openai.chat.completions.create({
        model: "gpt-4o",
        response_format: { type: "json_object" },
        max_tokens: 4000, // 🔴 FIX: Increased Tokens
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: contentArray }
        ],
      });

      // 🔴 FIX: Detect if OpenAI Safety Filter blocked the image
      if (!completion.choices?.[0]?.message?.content || completion.choices?.[0]?.finish_reason === "content_filter") {
        console.log("⚠️ OpenAI blocked the image (NSFW/Safety). Forcing text-only fallback...");
        throw new Error("content_filter_triggered");
      }

    } catch (aiError) {
      console.log("🔄 Retrying without images. Reason:", aiError.message);
      
      // Fallback to text-only analysis
      completion = await openai.chat.completions.create({
        model: "gpt-4o",
        response_format: { type: "json_object" },
        max_tokens: 4000,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: "Analyze based on text assessment only. Ignore visual data and generate the JSON." }
        ],
      });
    }

    // --- SAFE CONTENT EXTRACTION ---
    const rawContent = completion.choices?.[0]?.message?.content;
    
    if (!rawContent) {
      throw new Error("AI returned an empty response even after retry. Please try again.");
    }

    let aiContent = rawContent.trim();
    if (aiContent.startsWith("```json")) {
      aiContent = aiContent.replace(/^```json/, "").replace(/```$/, "").trim();
    }

    const generatedJSON = JSON.parse(aiContent);

// --- DATABASE UPDATE ---
    // 🔴 THE FIX: Hum yahan se 'ai_analysis_results' hata rahe hain taake Data 100% save ho jaye!
    const { error: dbError } = await supabase
      .from('profiles')
      .update({ 
        ai_protocol: generatedJSON 
      })
      .eq('id', userId);

    if (dbError) {
      console.error("Supabase Error:", dbError);
      throw new Error("Failed to save protocol to database");
    }

    res.status(200).json({ success: true, protocol: generatedJSON });

  } catch (error) {
    console.error("[SERVER ERROR]:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`🚀 BodyMax Smart Server running on port ${PORT}`));

// Safari "Load failed" fix
server.keepAliveTimeout = 120000; 
server.headersTimeout = 120000;