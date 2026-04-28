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

    console.log(`[AI ENGINE] Processing Protocol for user: ${userId}`);

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

    // =============================================
    // STEP 1: SEPARATE UNBIASED VISION ANALYSIS
    // =============================================
    // We first do a dedicated image analysis BEFORE generating the protocol.
    // This prevents the "be encouraging" tone from inflating scores.

    const isValidUrl = (url) =>
      typeof url === 'string' &&
      (url.startsWith('https://') || url.startsWith('http://') || url.startsWith('data:image/')) &&
      !url.startsWith('blob:');

    let imageContentArray = [];

    if (assessmentData.photos) {
      Object.values(assessmentData.photos).forEach(photoUrl => {
        if (isValidUrl(photoUrl)) {
          imageContentArray.push({ type: "image_url", image_url: { url: photoUrl, detail: "high" } });
        }
      });
    }

    // Vision analysis prompt — completely separate from the encouraging protocol tone
    const visionAnalysisPrompt = `
You are a BRUTALLY HONEST, professional physique assessment judge with 20 years of experience 
in competitive bodybuilding, sports science, and body composition analysis.

Your ONLY job right now is to score the physique in these photos ACCURATELY.
You are NOT a coach. You are NOT trying to motivate anyone. You are a judge scoring what you SEE.

=== MANDATORY SCORING RUBRIC ===

SCORE ANCHORS — calibrate every score against these:
- 20-35: Severely untrained, very high body fat (>30%), no visible muscle, soft/round appearance
- 36-45: Sedentary/average person. Some muscle exists but completely hidden under fat. No definition.
- 46-55: Beginner trainee (under 1 year). Slightly above average. Muscles present but undefined. 18-25% BF.
- 56-65: Intermediate (1-3 years). Decent mass, some definition in good lighting. 14-18% BF.
- 66-75: Advanced (3-5 years). Clear muscle definition, visible separation, looks athletic. 11-14% BF.
- 76-85: Elite/competitive. Sharp definition, visible striations, vascularity. 7-11% BF.
- 86-100: ONLY for world-class physiques. Pro athletes, IFBB competitors. Do NOT use this range casually.

=== NON-NEGOTIABLE RULES ===
1. If you CANNOT see clear muscle separation → score CANNOT exceed 63
2. If visible excess body fat is present → score MUST be below 60
3. A "normal" untrained person scores 35-48. Do NOT give 65+ unless they genuinely look athletic.
4. Most people submitting gym selfies score between 48-65. This is the honest reality.
5. Scores of 75+ mean "this person would be considered impressive by fitness professionals."
6. Scores of 80+ mean "this person is near competition-ready." Use sparingly.
7. Lighting and pose give maximum +3 benefit of doubt. No more.
8. If someone has a good upper body but bad legs (or vice versa), score each accurately — do NOT average up.

=== MUSCLE GROUP VISUAL CRITERIA ===

CHEST:
- HIGH score (70+): Visible pec-delt separation, inner chest line (cleavage), upper/lower pec definition, full rounded pecs
- MID score (55-69): Some pec fullness, partial separation visible, decent size but lacking definition
- LOW score (<55): Flat chest, no pec-delt separation, fat covering pecs, no visible muscle belly

SHOULDERS:
- HIGH score (70+): 3D capped delts, all 3 heads visible, creates strong V-taper from front
- MID score (55-69): Decent size, some roundness, side delt present but not fully capped
- LOW score (<55): Narrow, flat, sloping, no 3D appearance, no separation

BACK:
- HIGH score (70+): Clear V-taper, lat flare visible from front, visible muscle thickness
- MID score (55-69): Some width, slight taper, but back looks flat or lacks depth
- LOW score (<55): No taper, straight silhouette, back looks flat or undefined

ABS:
- HIGH score (70+): Visible rectus abdominis lines (at minimum upper abs), oblique separation
- MID score (55-69): Hint of upper abs in good lighting, relatively flat stomach but no clear lines
- LOW score (<55): Belly fat covering abs completely, soft midsection, no ab visibility whatsoever

LEGS:
- HIGH score (70+): Quad sweep visible from front, VMO "teardrop" present, hamstring separation
- MID score (55-69): Decent leg size but lacking definition, some quad mass without clear separation
- LOW score (<55): Skinny legs, no sweep, stick legs vs upper body, or hidden under fat

ARMS:
- HIGH score (70+): Bicep peak visible, bicep/tricep separation, tricep horseshoe present
- MID score (55-69): Decent size, some shape, but no clear peak or horseshoe definition
- LOW score (<55): Flat arms, no visible peak, no tricep definition, arms look smooth

=== USER PROFILE (for context only — DO NOT let this inflate scores) ===
${completeUserProfile}

=== YOUR TASK ===
Analyze the provided photo(s) and score each muscle group independently.
Cross-check your scores against the rubric above before finalizing.
Ask yourself: "Would a competitive coach, looking at this objectively, agree with my score?"

Return ONLY this JSON (no markdown, no text outside JSON):

{
  "overall_rating": <integer, weighted assessment of entire physique>,
  "potential_rating": <integer 88-97, based on height/frame/genetics visible in photo>,
  "dream_body_chances": "<e.g. '87%' — realistic chance of reaching goal with strict adherence>",
  "body_fat_percentage": "<estimated range e.g. '~18-21%'>",
  "chest_score": <integer 0-100>,
  "chest_delta": "<e.g. '+2.1' or '-1.3' — simulated initial metabolic shift>",
  "shoulders_score": <integer 0-100>,
  "shoulders_delta": "<e.g. '+1.8'>",
  "back_score": <integer 0-100>,
  "back_delta": "<e.g. '+2.5'>",
  "abs_score": <integer 0-100>,
  "abs_delta": "<e.g. '+1.2'>",
  "legs_score": <integer 0-100>,
  "legs_delta": "<e.g. '+1.9'>",
  "arms_score": <integer 0-100>,
  "arms_delta": "<e.g. '+2.0'>",
  "best_feature": "<the single most impressive visible feature>",
  "worst_feature": "<the single biggest physique limiter — lowercase, e.g. 'core definition'>",
  "strengths": [
    "<Specific visual advantage 1>",
    "<Specific visual advantage 2>",
    "<Specific visual advantage 3>",
    "<Specific visual advantage 4>"
  ],
  "weaknesses": [
    "<Specific visual limiter 1>",
    "<Specific visual limiter 2>",
    "<Specific visual limiter 3>",
    "<Specific visual limiter 4>"
  ],
  "executive_summary": "<4 sentences: 1) Current honest state, 2) What's working, 3) Primary limiter, 4) What the protocol will fix>",
  "primary_advice": "<1 sentence: the single most impactful thing they can do for their worst feature>",
  "bmr": <calculated integer based on stats>,
  "tdee": <calculated integer based on stats and activity level>
}
`;

    // =============================================
    // STEP 2: RUN VISION ANALYSIS (isolated)
    // =============================================
    let bodyAnalysis = null;
    let visionFailed = false;

    if (imageContentArray.length > 0) {
      try {
        const visionCompletion = await openai.chat.completions.create({
          model: "gpt-4o",
          response_format: { type: "json_object" },
          max_tokens: 1000,
          temperature: 0.2, // Very low — we want consistency, not creativity
          messages: [
            {
              role: "system",
              content: `You are a physique scoring judge. Your credibility depends on accuracy and honesty.
Inflated scores destroy your reputation. Score what you SEE in the photo.
70+ means "genuinely impressive athlete." 80+ means "near competition ready."
Most people you assess will score between 48-67. This is normal and expected.
Do NOT adjust scores upward to be kind. Kind scores are useless scores.`
            },
            {
              role: "user",
              content: [
                { type: "text", text: visionAnalysisPrompt },
                ...imageContentArray
              ]
            }
          ]
        });

        if (visionCompletion.choices?.[0]?.finish_reason === "content_filter") {
          throw new Error("content_filter_triggered");
        }

        const visionRaw = visionCompletion.choices?.[0]?.message?.content;
        if (!visionRaw) throw new Error("Empty vision response");

        let cleanVision = visionRaw.trim();
        if (cleanVision.startsWith("```json")) {
          cleanVision = cleanVision.replace(/^```json/, "").replace(/```$/, "").trim();
        }

        bodyAnalysis = JSON.parse(cleanVision);

        // =============================================
        // SERVER-SIDE SANITY CHECKS ON VISION SCORES
        // =============================================
        const muscleKeys = ['chest_score', 'shoulders_score', 'back_score', 'abs_score', 'legs_score', 'arms_score'];

        // Rule: If overall is 80+, at least 3 individual scores must also be 75+
        if (bodyAnalysis.overall_rating >= 80) {
          const highScoreCount = muscleKeys.filter(k => bodyAnalysis[k] >= 75).length;
          if (highScoreCount < 3) {
            console.log(`[SANITY] Overall ${bodyAnalysis.overall_rating} too high vs individual scores. Correcting.`);
            bodyAnalysis.overall_rating = Math.min(bodyAnalysis.overall_rating, 72);
          }
        }

        // Rule: If overall is 70+, no individual score should be below 50
        // (A 70 overall with a 35 leg score is contradictory)
        if (bodyAnalysis.overall_rating >= 70) {
          const veryLowScores = muscleKeys.filter(k => bodyAnalysis[k] < 50).length;
          if (veryLowScores >= 3) {
            console.log(`[SANITY] Overall ${bodyAnalysis.overall_rating} inconsistent with ${veryLowScores} very low scores. Correcting.`);
            bodyAnalysis.overall_rating = Math.min(bodyAnalysis.overall_rating, 65);
          }
        }

        // Rule: Recalculate overall as weighted average and cap if AI is too generous
        const weightedAvg = Math.round(
          (bodyAnalysis.chest_score * 0.18) +
          (bodyAnalysis.shoulders_score * 0.18) +
          (bodyAnalysis.back_score * 0.18) +
          (bodyAnalysis.abs_score * 0.16) +
          (bodyAnalysis.legs_score * 0.15) +
          (bodyAnalysis.arms_score * 0.15)
        );

        if (bodyAnalysis.overall_rating > weightedAvg + 6) {
          console.log(`[SANITY] AI overall (${bodyAnalysis.overall_rating}) too high vs weighted avg (${weightedAvg}). Correcting.`);
          bodyAnalysis.overall_rating = weightedAvg + 3; // Allow max +3 for "whole body gestalt"
        }

        // Hard bounds on all scores
        muscleKeys.forEach(key => {
          bodyAnalysis[key] = Math.max(20, Math.min(92, bodyAnalysis[key]));
        });
        bodyAnalysis.overall_rating = Math.max(20, Math.min(92, bodyAnalysis.overall_rating));

        console.log(`[VISION] Scores — Overall: ${bodyAnalysis.overall_rating}, Chest: ${bodyAnalysis.chest_score}, Shoulders: ${bodyAnalysis.shoulders_score}`);

      } catch (visionError) {
        console.log(`[VISION FAILED] ${visionError.message}. Will use text-based estimation.`);
        visionFailed = true;
      }
    } else {
      console.log("[VISION] No valid images provided. Using text-based estimation.");
      visionFailed = true;
    }

    // =============================================
    // STEP 3: TEXT-BASED FALLBACK SCORING
    // If vision failed or no images, estimate from profile data
    // =============================================
    if (visionFailed || !bodyAnalysis) {
      const fallbackVisionPrompt = `
You are a physique analyst. No photo was available, so estimate scores from the user's self-reported data.
Apply conservative (slightly lower) estimates since we cannot visually verify.

User Profile:
${completeUserProfile}

Return ONLY this JSON:
{
  "overall_rating": <conservative estimate based on stats>,
  "potential_rating": <88-97>,
  "dream_body_chances": "<e.g. '85%'>",
  "body_fat_percentage": "<estimated from weight/height/activity>",
  "chest_score": <integer>,
  "chest_delta": "<e.g. '+2.0'>",
  "shoulders_score": <integer>,
  "shoulders_delta": "<e.g. '+1.5'>",
  "back_score": <integer>,
  "back_delta": "<e.g. '+2.0'>",
  "abs_score": <integer>,
  "abs_delta": "<e.g. '+1.0'>",
  "legs_score": <integer>,
  "legs_delta": "<e.g. '+1.5'>",
  "arms_score": <integer>,
  "arms_delta": "<e.g. '+1.8'>",
  "best_feature": "<estimated from stats>",
  "worst_feature": "<estimated from stats — lowercase>",
  "strengths": ["<stat-based advantage 1>", "<2>", "<3>", "<4>"],
  "weaknesses": ["<stat-based limiter 1>", "<2>", "<3>", "<4>"],
  "executive_summary": "<4 sentences based on profile data only>",
  "primary_advice": "<most impactful advice based on their goal>",
  "bmr": <calculated>,
  "tdee": <calculated>
}`;

      const fallbackCompletion = await openai.chat.completions.create({
        model: "gpt-4o",
        response_format: { type: "json_object" },
        max_tokens: 800,
        temperature: 0.3,
        messages: [
          { role: "system", content: "Estimate physique scores conservatively from text data only. No photo available." },
          { role: "user", content: fallbackVisionPrompt }
        ]
      });

      const fallbackRaw = fallbackCompletion.choices?.[0]?.message?.content;
      let cleanFallback = fallbackRaw.trim();
      if (cleanFallback.startsWith("```json")) {
        cleanFallback = cleanFallback.replace(/^```json/, "").replace(/```$/, "").trim();
      }
      bodyAnalysis = JSON.parse(cleanFallback);
    }

    // =============================================
    // STEP 4: GENERATE THE FULL PROTOCOL
    // Now we generate workouts/nutrition SEPARATELY
    // Body analysis scores are already locked in from Step 2/3
    // =============================================
    const protocolPrompt = `
You are BodyMax AI, a friendly and expert Fitness Coach.
Use SIMPLE, motivating language. Avoid jargon.

=== USER PROFILE ===
${completeUserProfile}

=== LOCKED BODY ANALYSIS (DO NOT CHANGE THESE SCORES) ===
${JSON.stringify(bodyAnalysis, null, 2)}

=== YOUR TASK ===
Generate ONLY the workouts, nutrition, macros, and roadmap sections.
Do NOT re-score the body. Use the locked analysis above exactly as provided.

WORKOUT RULES:
- Exactly ${workoutDays} workout objects
- Each workout targets exactly 2 muscle groups (except standalone Leg days)
- Each muscle group gets exactly 4 exercises (8 total per workout)
- Exercise name format: "MuscleGroup: ExerciseName" (e.g., "Chest: Incline Dumbbell Press")
- No repeated exercises across days
- Match equipment to: ${assessmentData.equipment || assessmentData.gymAccess || 'Commercial Gym'}

SPLIT LOGIC for ${workoutDays} days:
${workoutDays === 4 ? `
Day 1: Chest & Triceps
Day 2: Back & Biceps  
Day 3: Shoulders & Forearms
Day 4: Legs & Abs` :
workoutDays === 5 ? `
Day 1: Chest & Triceps
Day 2: Back & Biceps
Day 3: Shoulders & Forearms
Day 4: Arms & Abs
Day 5: Legs` : `
Day 1: Chest & Triceps
Day 2: Back & Biceps
Day 3: Shoulders & Forearms
Day 4: Arms & Abs
Day 5: Legs
Day 6: Upper Body Weak Points`}

PROGRESSIVE OVERLOAD (${planDuration}):
- Week 1-4: Form focus, feel the muscle
- Week 5-8: Add weight or reps
- Week 9-12: Drop sets, slow negatives, maximum effort

NUTRITION:
- Exact quantities (grams, scoops, cups) for every food item
- Based on their goal: ${assessmentData.goal || 'body recomposition'}
- Separate meals clearly

Return ONLY this JSON structure:
{
  "macros": { 
    "calories": <integer>, 
    "protein": <integer grams>, 
    "carbs": <integer grams>, 
    "fats": <integer grams> 
  },
  "nutrition": {
    "strategy": "<2-3 sentences explaining WHY these macros suit their goal, in simple terms>",
    "meals": [
      { 
        "name": "Meal 1 — Breakfast", 
        "food": "<item 1 with exact quantity>\\n<item 2 with exact quantity>\\n<item 3>", 
        "cals": <integer>, 
        "p": <protein grams>, 
        "c": <carb grams>, 
        "f": <fat grams> 
      }
    ]
  },
  "roadmap": [
    { "phase": "Week 1-4: Foundation", "description": "<what happens physically + what to focus on>" },
    { "phase": "Week 5-8: Progression", "description": "<intensity increase + expected changes>" },
    { "phase": "Week 9-12: Realization", "description": "<peak phase + visual results expected>" }
  ],
  "workouts": [
    {
      "title": "Day 1 — Chest & Triceps",
      "targets": ["Chest", "Triceps"],
      "intensity": "Medium",
      "exercises": [
        { 
          "name": "Chest: Barbell Bench Press", 
          "sets": "4", 
          "reps": "8-10", 
          "rest": "90s", 
          "notes": "Keep shoulder blades retracted. Week 1-4: master form. Week 5-8: add 2.5kg. Week 9-12: pause at bottom for 2s." 
        }
      ]
    }
  ]
}`;

    const protocolCompletion = await openai.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      max_tokens: 4000,
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: "You are a fitness coach generating workout and nutrition plans. Be specific, practical, and encouraging. Use exact quantities always."
        },
        { role: "user", content: protocolPrompt }
      ]
    });

    const protocolRaw = protocolCompletion.choices?.[0]?.message?.content;
    if (!protocolRaw) throw new Error("Protocol generation returned empty response");

    let cleanProtocol = protocolRaw.trim();
    if (cleanProtocol.startsWith("```json")) {
      cleanProtocol = cleanProtocol.replace(/^```json/, "").replace(/```$/, "").trim();
    }

    const protocolData = JSON.parse(cleanProtocol);

    // =============================================
    // STEP 5: MERGE — locked scores + generated plan
    // =============================================
    const finalProtocol = {
      body_analysis: bodyAnalysis,           // Unbiased scores from Step 2/3
      macros: protocolData.macros,           // Generated in Step 4
      nutrition: protocolData.nutrition,     // Generated in Step 4
      roadmap: protocolData.roadmap,         // Generated in Step 4
      workouts: protocolData.workouts,       // Generated in Step 4
    };

    // Save to Supabase
    const { error: dbError } = await supabase
      .from('profiles')
      .update({ ai_protocol: finalProtocol })
      .eq('id', userId);

    if (dbError) {
      console.error("Supabase Error:", dbError);
      throw new Error("Failed to save protocol to database");
    }

    console.log(`[DONE] Protocol saved for user ${userId}. Overall score: ${bodyAnalysis.overall_rating}`);
    res.status(200).json({ success: true, protocol: finalProtocol });

  } catch (error) {
    console.error("[SERVER ERROR]:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

// ==========================================
// QUICK AD SCAN (FOR VIDEO CREATION ONLY)
// ==========================================
app.post('/api/analyze-ad', async (req, res) => {
  try {
    const { currentImage, dreamImage } = req.body;
    
    if (!currentImage) {
      return res.status(400).json({ error: "Missing image" });
    }

    console.log("[AD SCAN] Processing instant physique analysis...");

    const imageContentArray = [
      { type: "image_url", image_url: { url: currentImage, detail: "high" } }
    ];
    if (dreamImage) {
      imageContentArray.push({ type: "image_url", image_url: { url: dreamImage, detail: "high" } });
    }

    const adPrompt = `
You are a BRUTALLY HONEST, professional physique assessment judge.
Score the provided physique(s) accurately on a 0-100 scale.
Return ONLY valid JSON. No markdown formatting.

{
  "overall_score": <integer>,
  "potential_score": <integer 88-97>,
  "dream_body_chances": "<e.g. '87%'>",
  "chest_score": <integer>,
  "shoulders_score": <integer>,
  "back_score": <integer>,
  "abs_score": <integer>,
  "legs_score": <integer>,
  "arms_score": <integer>
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      max_tokens: 300,
      temperature: 0.2,
      messages: [
        { role: "system", content: "You are a precise physique scoring judge. Return only JSON." },
        { role: "user", content: [ { type: "text", text: adPrompt }, ...imageContentArray ] }
      ]
    });

    let cleanVision = completion.choices[0].message.content.trim();
    if (cleanVision.startsWith("```json")) {
      cleanVision = cleanVision.replace(/^```json/, "").replace(/```$/, "").trim();
    }

    res.status(200).json(JSON.parse(cleanVision));

  } catch (error) {
    console.error("[AD SCAN ERROR]:", error);
    res.status(500).json({ error: "Failed to scan" });
  }
});
app.post('/api/analyze-progress', async (req, res) => {
  try {
    const { userId, progressImageBase64, weekNumber, originalScores } = req.body;

    if (!userId || !progressImageBase64 || !originalScores) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    console.log(`[PROGRESS AI] Analyzing week ${weekNumber} for user ${userId}`);

    // 🔴 FIX 1: Backend ki sakht limit hata di. Ab +50 tak ka jump bhi allow hai!
    const maxAllowedDelta = 50; 

    // 🔴 FIX 2: Naya "Unbiased & Scale-Aware" Prompt
    const prompt = `
You are a BRUTALLY HONEST, professional physique assessment judge.
Your job is to analyze the NEW progress photo and compare it to the Baseline Scores.

=== ORIGINAL SCORES (BASELINE) ===
Overall: ${originalScores.overall}
Chest: ${originalScores.chest}
Shoulders: ${originalScores.shoulders}
Back: ${originalScores.back}
Abs: ${originalScores.abs}
Legs: ${originalScores.legs}
Arms: ${originalScores.arms}

=== THE RULE OF UNBIASED SCALING (CRITICAL) ===
You must calculate the DELTA (difference) purely based on VISUAL EVIDENCE, regardless of the time elapsed.
- If the new photo shows a physique that belongs in the 75-85 range (advanced/elite), but the baseline was 30, you MUST output a massive delta (e.g., +45.0) to correct the score.
- Do NOT restrict your deltas just because it says "Week 1" or "Week 2". Judge the body as it is NOW.
- If the body is small/average, give a small realistic delta (e.g., +0.5 to +1.5).
- If the body is massive, highly defined, and clearly advanced, give whatever large delta is required to bring the baseline score up to its TRUE visual level.

RETURN ONLY THIS JSON (no extra text):
{
  "overall_delta": <float>,
  "chest_delta": <float>,
  "shoulders_delta": <float>,
  "back_delta": <float>,
  "abs_delta": <float>,
  "legs_delta": <float>,
  "arms_delta": <float>,
  "body_fat_estimate": "<e.g., '~12-14%'>",
  "visible_improvements": "<specific visual change seen>",
  "summary": "<honest assessment of progress>"
}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      max_tokens: 500,
      temperature: 0.2, 
      messages: [
        { 
          role: "system", 
          content: "You strictly output precise progress deltas as floats. You scale your deltas unrestrictedly based on the true visual level of the physique provided." 
        },
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: `data:image/jpeg;base64,${progressImageBase64}`, detail: "high" } }
          ]
        }
      ]
    });

    // Handle Content Filter
    if (!completion.choices?.[0]?.message?.content || completion.choices?.[0]?.finish_reason === "content_filter") {
      throw new Error("content_filter_triggered");
    }

    let cleanContent = completion.choices[0].message.content.trim();
    if (cleanContent.startsWith("```json")) {
      cleanContent = cleanContent.replace(/^```json/, "").replace(/```$/, "").trim();
    }

    const aiDeltas = JSON.parse(cleanContent);
    const updated_scores = {};

    // 🔴 FIX 3: Math.round() completely removed. Decimals are kept intact.
    const muscleKeys = ['chest', 'shoulders', 'back', 'abs', 'legs', 'arms'];
    
    muscleKeys.forEach(muscle => {
      if (originalScores[muscle]) {
        let aiDelta = parseFloat(aiDeltas[`${muscle}_delta`]) || 0;
        
        // Capping extreme impossible numbers (e.g., over +50)
        if (aiDelta > maxAllowedDelta) {
          console.log(`[DELTA CAP] ${muscle}: AI gave +${aiDelta}, capping at +${maxAllowedDelta}`);
          aiDelta = maxAllowedDelta;
        }

        // Add delta to original, keeping 1 decimal place (e.g., 29 + 1.2 = 30.2)
        updated_scores[muscle] = Number((originalScores[muscle] + aiDelta).toFixed(1));
        
        // Strict Bounds: Don't let scores go below 20 or above 95
        updated_scores[muscle] = Number(Math.max(20, Math.min(95, updated_scores[muscle])).toFixed(1));
      }
    });

    // Overall Calculation (Weighted Average to keep logic intact)
    if (updated_scores.chest && updated_scores.shoulders && updated_scores.back) {
      const avg = Number((
        updated_scores.chest * 0.18 +
        updated_scores.shoulders * 0.18 +
        updated_scores.back * 0.18 +
        updated_scores.abs * 0.16 +
        updated_scores.legs * 0.15 +
        updated_scores.arms * 0.15
      ).toFixed(1));
      
      // Calculate overall delta directly from the new average
      updated_scores.overall = avg;
    }

    // Extra Details mapping
    updated_scores.body_fat_estimate = aiDeltas.body_fat_estimate || "~18%";
    updated_scores.visible_improvements = aiDeltas.visible_improvements || "Processing improvements...";
    updated_scores.summary = aiDeltas.summary || "Consistent effort applied.";

    // Save to Supabase
    const { error: dbError } = await supabase.from('progress_scans').insert({
      user_id: userId,
      week_number: weekNumber,
      scores: updated_scores,
      created_at: new Date().toISOString()
    });

    if (dbError) {
      console.error("Supabase Save Error:", dbError);
    }

    res.status(200).json({ success: true, updated_scores, delta_cap_applied: maxAllowedDelta });

  } catch (error) {
    console.error("[PROGRESS ANALYSIS ERROR]:", error);
    res.status(500).json({ error: "Progress analysis failed", details: error.message });
  }
});
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`🚀 BodyMax Smart Server running on port ${PORT}`));

// Safari "Load failed" fix
server.keepAliveTimeout = 120000; 
server.headersTimeout = 120000;