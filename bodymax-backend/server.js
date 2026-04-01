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

    // 3. THE MASTER PROMPT: High-Intelligence Biometric Engine
    const systemPrompt = `
      You are BodyMax AI, an advanced Biometric Scientist and Elite Performance Coach. 
      Your goal is to provide a surgical-grade physical analysis and protocol.

      === RAW USER DATA ===
      ${completeUserProfile}
      ===========================

      SCIENTIFIC INSTRUCTIONS:
      1. BIOMETRICS: Calculate BMR using the Mifflin-St Jeor Equation and TDEE based on the user's reported activity level. 
      2. BODY COMPOSITION: Estimate Body Fat % based on the provided height, weight, and "self-perception" data.
      3. ATHLETIC SCORING: Generate a "Body Score" (1-100). This is NOT a fixed number. Calculate it by weighing their current metrics against their "Dream Physique" difficulty.
      4. VECTORS: Assign values (1-100) for Upper, Lower, Core, and Symmetry based on their specific "mainStruggle" and "painPoints".
      5. PSYCHOLOGY: In the "executive_summary", address their "motivationLevel" and "self-perception" (e.g., if they feel "disappointed", be firm but encouraging).

      MANDATORY JSON FORMAT (Strictly dynamic values only - NO PLACEHOLDERS):
      {
        "body_analysis": {
          "score": [Calculate 1-100 based on profile],
          "classification": "[e.g., Sedentary Endomorph, Athletic Skinny-Fat, etc.]",
          "estimated_bf": "[Estimated % range]",
          "bmr": [Calculated Integer],
          "tdee": [Calculated Integer],
          "strengths": ["[Specific strength 1]", "[Specific strength 2]"],
          "weaknesses": ["[Specific weakness 1]", "[Specific weakness 2]"],
          "vectors": { 
            "upper_body": [1-100], 
            "lower_body": [1-100], 
            "core": [1-100], 
            "symmetry": [1-100] 
          },
          "executive_summary": "[A 4-sentence brutal and scientific analysis of their current state and the exact path to their specific goal.]"
        },
        "macros": { 
          "calories": [Target based on goal], 
          "protein": [Target based on lean mass], 
          "carbs": [Balance], 
          "fats": [Balance] 
        },
        "nutrition": {
          "strategy": "[Explain the 'Why' behind these macros based on their current 'diet' and 'sleep' habits.]",
          "meals": [
            { "name": "Meal Name", "food": "Specific items", "cals": 0, "p": 0, "c": 0, "f": 0 }
          ]
        },
        "roadmap": [
          { "phase": "Phase 1: Priming", "description": "[How their body will react in weeks 1-4]" },
          { "phase": "Phase 2: Recomposition", "description": "[Specific changes expected in weeks 5-8]" },
          { "phase": "Phase 3: Integration", "description": "[Final outcome for weeks 9-12]" }
        ],
        "workouts": [
          { 
            "title": "[Dynamic Title]", 
            "targets": ["[Target 1]", "[Target 2]"], 
            "intensity": "[1-10]", 
            "exercises": [ 
              { "name": "[Exercise]", "sets": 0, "reps": "[Range]", "rest": "[Seconds]", "notes": "[Form cue]" } 
            ] 
          }
        ]
      }

      CRITICAL CONSTRAINTS:
      - Return EXACTLY ${workoutDays} workout objects.
      - If "sleep" is "Less than 5 hours", your nutrition strategy MUST prioritize recovery.
      - Use the user's specific "age" to determine recovery time in exercise notes.
      - Do NOT use the numbers 65, 1850, or 2450 unless they happen to be the actual calculated result.
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