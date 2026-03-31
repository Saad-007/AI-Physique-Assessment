import dotenv from "dotenv";
dotenv.config();

console.log("ENV TEST:", process.env.OPENAI_API_KEY ? "Key is loaded!" : "Key missing!");

import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

const app = express(); 

app.use(cors({
  origin: [
    'http://localhost:5173', 
    'https://ai-physique-assessment-saad-3892s-projects.vercel.app' // <-- Aapka Vercel URL
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
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

    // 🔴 DYNAMIC VARIABLES: Extracting strict user parameters
    const userPlanDuration = assessmentData.planDuration || "12-weeks"; // 1-week, 4-weeks, 12-weeks
    const userLocation = assessmentData.location || "Commercial Gym";
    const userExperience = assessmentData.experience || "Beginner";
    const workoutDays = assessmentData.days ? parseInt(assessmentData.days) : 4;
    const userGoal = assessmentData.goal || "Muscle Gain";

    // 🔴 THE MASTER PROMPT: Adaptive Intelligence
    const systemPrompt = `
      You are an elite AI fitness coach and biometric analyst.
      
      USER CONTEXT:
      - Purchased Plan: **${userPlanDuration} Program**
      - Commitment: **${workoutDays} Days per Week**
      - Location/Equipment: **${userLocation}**
      - Experience Level: **${userExperience}**
      - Primary Goal: **${userGoal}**

      YOUR TASK:
      1. Gap Analysis: Compare their current body to their goal.
      2. Nutrition Strategy: Tailor the diet specifically for a ${userPlanDuration} timeline (e.g., aggressive if 1-week, periodized if 12-weeks).
      3. Workout Generation: You MUST generate exactly ${workoutDays} distinct workouts representing their weekly training microcycle. 
      4. Equipment Rules: If the location is "Home", strictly use bodyweight, dumbbells, or basic bands. Do NOT suggest barbells or machines. If "Commercial Gym", utilize full equipment.
      5. Experience Rules: Tailor exercise selection, volume, and notes to a ${userExperience} level.

      You MUST respond ONLY in valid JSON format matching this exact structure:
      {
        "body_analysis": {
          "score": 65,
          "classification": "String (e.g., Novice Recomp)",
          "estimated_bf": "String (e.g., 22-25%)",
          "bmr": 1850,
          "tdee": 2450,
          "strengths": ["Array of 2 specific strengths"],
          "weaknesses": ["Array of 2 weaknesses preventing them from looking like the goal image"],
          "vectors": { "upper_body": 60, "lower_body": 55, "core": 40, "symmetry": 70 },
          "executive_summary": "A brutally honest 2-sentence truth about their current state vs their goal."
        },
        "macros": { "calories": 2500, "protein": 180, "carbs": 250, "fats": 70 },
        "nutrition": {
          "strategy": "Explain the diet strategy explicitly tailored for a ${userPlanDuration} commitment and their ${userExperience} level.",
          "meals": [
            { "name": "Breakfast", "food": "Specific meal description", "cals": 450, "p": 30, "c": 35, "f": 20 },
            { "name": "Lunch", "food": "Specific meal description", "cals": 600, "p": 50, "c": 65, "f": 10 },
            { "name": "Pre-Workout", "food": "Specific meal description", "cals": 220, "p": 25, "c": 27, "f": 2 },
            { "name": "Dinner", "food": "Specific meal description", "cals": 550, "p": 45, "c": 40, "f": 20 }
          ]
        },
        "workouts": [
          { 
            "title": "Workout Day 1 (e.g., Push / Upper)", 
            "targets": ["Target 1", "Target 2"], 
            "intensity": "High", 
            "exercises": [ 
              { "name": "Exercise Name", "sets": 4, "reps": "8-10", "rest": "90s", "notes": "Specific cue for a ${userExperience} training at ${userLocation}." } 
            ] 
          }
        ]
      }
      CRITICAL: The "workouts" array MUST contain EXACTLY ${workoutDays} objects. Not more, not less.
    `;

    // 1. Format text data
    let userDetails = `User Assessment Data:\n`;
    for (const [key, value] of Object.entries(assessmentData)) {
      if (key !== 'photos' && key !== 'photoFiles' && key !== 'customGoalPhoto' && key !== 'dreamPhysiqueImage' && value) {
        const formattedValue = Array.isArray(value) ? value.join(', ') : value;
        userDetails += `- ${key.toUpperCase()}: ${formattedValue}\n`;
      }
    }

    let contentArray = [{ type: "text", text: userDetails }];

    // 2. Attach CURRENT Body Image URLs
    if (assessmentData.photos) {
      contentArray.push({ type: "text", text: "CURRENT BODY PHOTOS:" });
      Object.values(assessmentData.photos).forEach(photoUrl => {
        if (photoUrl && photoUrl.startsWith('http')) {
          contentArray.push({ type: "image_url", image_url: { url: photoUrl } });
        }
      });
    }

    // 3. Attach DREAM Body Image URL
    if (assessmentData.dreamPhysiqueImage) {
      contentArray.push({ type: "text", text: "DREAM / GOAL BODY PHOTO:" });
      contentArray.push({ type: "image_url", image_url: { url: assessmentData.dreamPhysiqueImage } });
    } else if (assessmentData.goalImageUrl) {
      contentArray.push({ type: "text", text: "DREAM / GOAL BODY PHOTO:" });
      contentArray.push({ type: "image_url", image_url: { url: assessmentData.goalImageUrl } });
    }

    // 4. Request completion from OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: contentArray }
      ],
      temperature: 0.7, // 0.7 gives a good balance of creativity and structure
    });

    const generatedJSON = JSON.parse(completion.choices[0].message.content);

    // 5. Save directly to Supabase
    const { error: dbError } = await supabase
      .from('profiles')
      .update({ ai_protocol: generatedJSON })
      .eq('id', userId);

    if (dbError) throw new Error("Failed to save to Supabase");

    console.log(`[AI ENGINE] Smart Protocol generated and saved for user: ${userId}`);
    res.status(200).json({ success: true, protocol: generatedJSON });

  } catch (error) {
    console.error("[SERVER ERROR]:", error);
    res.status(500).json({ error: "Failed to generate AI protocol" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 BodyMax Smart Server running on port ${PORT}`));