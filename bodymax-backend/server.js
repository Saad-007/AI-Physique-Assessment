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

    // 🔴 THE MASTER PROMPT: Simple, Expert, & Friendly Fitness Coach
    const systemPrompt = `
      You are BodyMax AI, an expert, highly encouraging, and easy-to-understand Fitness Coach. 
      Your objective is to generate a highly effective, personalized physical analysis and training protocol.
      CRITICAL TONE RULE: Use SIMPLE, everyday language that any beginner or intermediate gym-goer can easily understand. AVOID overly scientific jargon, complex medical terms, or robotic language. Talk like a friendly human expert.

      === RAW USER DATA ===
      ${completeUserProfile}
      ===========================

      INSTRUCTIONS:
      1. BIOMETRICS: Calculate BMR and TDEE based on profile. Generate a dynamic "Body Score" (1-100).
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
         - Example Note: "Keep your chest up. Wk 1-4: Focus on form. Wk 5-8: Add light weight. Wk 9-12: Try a drop set on the last set."

      6. NUTRITION (EXACT & SIMPLE):
         - DO NOT provide generic food lists. Provide EXACT quantities (grams, scoops, cups, etc.) for every single item using simple terms.
         - Example: "150g grilled chicken breast, 1 cup cooked white rice, 15 raw almonds".

      MANDATORY JSON FORMAT (Strictly dynamic values only - NO PLACEHOLDERS):
      {
        "body_analysis": {
          "score": [1-100],
          "classification": "[e.g., Athletic Beginner, Endomorph aiming for Fat Loss, etc.]",
          "estimated_bf": "[Estimated % range]",
          "bmr": [Integer],
          "tdee": [Integer],
          "strengths": ["[Simple strength 1]", "[Simple strength 2]"],
          "weaknesses": ["[Simple area to improve 1]", "[Simple area to improve 2]"],
          "vectors": { "upper_body": [1-100], "lower_body": [1-100], "core": [1-100], "symmetry": [1-100] },
          "executive_summary": "[A 4-sentence friendly, encouraging, and very easy-to-understand summary explaining where their body is right now and how this exact plan will help them reach their goal.]"
        },
        "macros": { "calories": [Target], "protein": [Target], "carbs": [Balance], "fats": [Balance] },
        "nutrition": {
          "strategy": "[Explain the 'Why' behind these macros in simple terms (e.g., 'We need this much protein to repair your muscles and enough carbs to give you energy for your workouts').]",
          "meals": [ { "name": "Meal 1", "food": "Exact grams/scoops\\nExact grams", "cals": 0, "p": 0, "c": 0, "f": 0 } ]
        },
        "roadmap": [
          { "phase": "Week 1-4: Foundation", "description": "[Explain simply what changes they will feel in their body during this time]" },
          { "phase": "Week 5-8: Pushing Limits", "description": "[Explain simply how their strength and visual look will start improving]" },
          { "phase": "Week 9-12: Final Push & Definition", "description": "[Explain simply the final results they can expect to see]" }
        ],
        "workouts": [
          { 
            "title": "[e.g., Day 1 - Chest & Triceps]", 
            "targets": ["[Muscle 1]", "[Muscle 2]"], 
            "intensity": "[Low, Med, High]", 
            "exercises": [ 
              { 
                "name": "[Muscle Group Prefix]: [Exercise Name]", 
                "sets": "[e.g., 3-4]", 
                "reps": "[e.g., 8-12]", 
                "rest": "[e.g., 60-90s]", 
                "notes": "[Simple form cue + Specific Wk1-12 Progression]" 
              } 
            ] 
          }
        ]
      }

      CRITICAL CONSTRAINTS:
      - Return EXACTLY ${workoutDays} workout objects.
      - Ensure there are exactly 8 exercises per workout object (4 for Muscle 1, then 4 for Muscle 2).
      - KEEP THE LANGUAGE SIMPLE, FRIENDLY, AND HUMAN-LIKE.
    `;

    let contentArray = [{ type: "text", text: "Please analyze my profile and generate the exact JSON response following the strict 4-exercise rule and split logic." }];

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
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`🚀 BodyMax Smart Server running on port ${PORT}`));

// Safari "Load failed" fix: Tell Safari to wait longer and not drop the connection
server.keepAliveTimeout = 120000; // 120 seconds
server.headersTimeout = 120000; // 120 seconds (Should be >= keepAliveTimeout)