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
app.post('/api/analyze-progress', async (req, res) => {
  try {
    const { userId, progressImageBase64, weekNumber, originalScores } = req.body;

    if (!userId || !progressImageBase64 || !originalScores) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    console.log(`[PROGRESS AI] Analyzing week ${weekNumber} for user ${userId}`);

    // Max realistic improvement per muscle group based on weeks elapsed
    // Human bodies cannot change faster than this naturally
    const maxDeltaPerWeek = 0.6; // ~0.6 points per week is aggressive but realistic
    const maxAllowedDelta = Math.min(weekNumber * maxDeltaPerWeek, 12); // Hard cap at 12 points total

    const prompt = `
You are a BRUTALLY HONEST, professional physique assessment judge with 20 years of experience in competitive bodybuilding, sports science, and body composition analysis.

Your job is to give UNBIASED, ACCURATE scores based ONLY on what you can visually observe in this photo. You must NOT give inflated scores to make the user feel good.

=== SCORING SYSTEM (MANDATORY - READ CAREFULLY) ===

SCORE ANCHORS (use these as your calibration):
- 30-40: Severely untrained, very high body fat (>30%), no visible muscle definition, soft appearance
- 41-50: Average/sedentary person, some muscle mass but hidden under fat, little to no definition
- 51-60: Beginner gym-goer (6-12 months training), slightly above average, muscles present but not defined
- 61-70: Intermediate (1-3 years training), decent muscle mass, some definition in good lighting, 15-20% body fat range
- 71-80: Advanced (3-5 years), clear muscle definition, visible separation, 12-15% body fat, looks noticeably athletic
- 81-90: Elite/competitive level, sharp definition, visible striations, vascularity present, 8-12% body fat
- 91-100: ONLY for world-class physiques (pro athletes, IFBB competitors, Olympic sprinters)

CRITICAL ANTI-INFLATION RULES:
1. If you CANNOT see clear muscle separation/definition → score CANNOT exceed 62
2. If the person has visible excess body fat → subtract 10-15 points from where they'd otherwise land
3. If lighting/pose is poor, give benefit of doubt of maximum +3 points only
4. A "normal" person off the street scores 40-50. Do NOT give 70+ unless they genuinely look like a serious athlete
5. Most gym beginners (under 2 years) score between 50-65. NOT higher.
6. Reserve scores of 80+ for people who would turn heads at a beach or gym

=== MUSCLE GROUP SPECIFIC SCORING CRITERIA ===

CHEST (look for):
- Pectoral muscle fullness and roundness
- Upper/lower pec separation
- Inner chest definition (cleavage line)
- Low score if: flat chest, no pec-delt separation, man-boobs from fat

SHOULDERS (look for):
- Capped/round deltoid appearance (3D look)
- Front/side/rear delt separation
- Width relative to waist (V-taper contribution)
- Low score if: narrow, flat, no roundness, sloping shoulders

BACK (look for):
- V-taper (wide lats, narrow waist)
- Visible lat spread
- Spinal erector definition (for back poses)
- Low score if: straight lines, no taper, no lat flare

ABS (look for):
- Visible rectus abdominis (6-pack lines)
- External oblique separation
- Serratus anterior visibility
- Low score if: belly fat covering abs, no lines visible, soft midsection

LEGS (look for):
- Quadricep sweep and separation
- Hamstring/glute tie-in
- Overall leg mass relative to upper body
- Low score if: skinny legs, no definition, stick legs vs big upper body

ARMS (look for):
- Bicep peak and separation (long/short head)
- Tricep horseshoe definition
- Forearm vascularity/definition
- Low score if: no peak, smooth arms, no tricep definition

=== ORIGINAL SCORES (WEEK 1 BASELINE) ===
Overall: ${originalScores.overall}
Chest: ${originalScores.chest}
Shoulders: ${originalScores.shoulders}
Back: ${originalScores.back}
Abs: ${originalScores.abs}
Legs: ${originalScores.legs}
Arms: ${originalScores.arms}

=== CURRENT ASSESSMENT: WEEK ${weekNumber} ===

REALISTIC CHANGE LIMITS:
- This is Week ${weekNumber} of training
- Maximum realistic total improvement since Week 1: ${maxAllowedDelta.toFixed(1)} points per muscle group
- If someone's original score was already accurate, improvements should be: ${(weekNumber * 0.3).toFixed(1)} to ${maxAllowedDelta.toFixed(1)} points per muscle
- Scores CAN go DOWN if the person looks worse (gained fat, lost muscle, bad lighting reveals more issues)
- Do NOT automatically increase all scores just because time has passed. Only increase if you VISUALLY see improvement.

=== YOUR TASK ===

1. Carefully examine the provided progress photo
2. Score each muscle group independently based on what you SEE
3. Cross-reference with original scores — if the original score seems too generous compared to what you see now, you may ALSO correct downward
4. Write a 2-sentence summary that is honest (mention both positives and areas to improve)

RETURN ONLY THIS JSON (no markdown, no explanation outside JSON):

{
  "overall": <integer 0-100 based on whole-body assessment>,
  "chest": <integer 0-100>,
  "shoulders": <integer 0-100>,
  "back": <integer 0-100>,
  "abs": <integer 0-100>,
  "legs": <integer 0-100>,
  "arms": <integer 0-100>,
  "body_fat_estimate": "<e.g., '~18-20%'>",
  "visible_improvements": "<specific visual change you can see vs baseline, or 'None visible yet'>",
  "primary_concern": "<the single biggest area still needing work>",
  "summary": "<Sentence 1: honest assessment of current state>. <Sentence 2: specific actionable advice for the weakest area.>"
}
`;

    let completion;
    
    try {
      completion = await openai.chat.completions.create({
        model: "gpt-4o",
        response_format: { type: "json_object" },
        max_tokens: 500,
        temperature: 0.3, // Low temperature = more consistent, less random inflation
        messages: [
          {
            role: "system",
            content: `You are an unbiased physique judge. Your reputation depends on accuracy, not kindness. 
You will lose credibility if you give inflated scores. 
Score what you SEE, not what the person wants to hear.
A score of 70 means "genuinely impressive" — it should NOT be a default "decent" score.
Most photos you receive will score between 45-68. Scores above 75 are rare and earned.`
          },
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${progressImageBase64}`,
                  detail: "high" // Use high detail for accurate body assessment
                }
              }
            ]
          }
        ]
      });

      // Check for content filter
      if (!completion.choices?.[0]?.message?.content || completion.choices?.[0]?.finish_reason === "content_filter") {
        throw new Error("content_filter_triggered");
      }

    } catch (aiError) {
      console.log("⚠️ Vision failed, falling back to score estimation:", aiError.message);
      
      // Fallback: Use original scores with minimal change
      const fallbackScores = {
        overall: originalScores.overall,
        chest: originalScores.chest,
        shoulders: originalScores.shoulders,
        back: originalScores.back,
        abs: originalScores.abs,
        legs: originalScores.legs,
        arms: originalScores.arms,
        body_fat_estimate: "Unable to assess",
        visible_improvements: "Photo could not be analyzed",
        primary_concern: "Please upload a clearer photo for accurate assessment",
        summary: "We couldn't analyze your photo properly this week. Please ensure good lighting and a clear full-body shot for accurate scoring."
      };

      return res.status(200).json({ success: true, updated_scores: fallbackScores, fallback: true });
    }

    const rawContent = completion?.choices?.[0]?.message?.content;

    if (!rawContent) {
      throw new Error("AI returned empty response");
    }

    let cleanContent = rawContent.trim();
    if (cleanContent.startsWith("```json")) {
      cleanContent = cleanContent.replace(/^```json/, "").replace(/```$/, "").trim();
    }

    const updated_scores = JSON.parse(cleanContent);

    // ✅ SERVER-SIDE DELTA VALIDATION
    // Prevents AI from giving impossible improvements even if it ignores instructions
    const muscleKeys = ['chest', 'shoulders', 'back', 'abs', 'legs', 'arms'];
    
    muscleKeys.forEach(muscle => {
      if (updated_scores[muscle] && originalScores[muscle]) {
        const delta = updated_scores[muscle] - originalScores[muscle];
        
        // Cap maximum improvement based on weeks
        if (delta > maxAllowedDelta) {
          console.log(`[DELTA CAP] ${muscle}: AI gave +${delta.toFixed(1)}, capping at +${maxAllowedDelta.toFixed(1)}`);
          updated_scores[muscle] = Math.round(originalScores[muscle] + maxAllowedDelta);
        }
        
        // Allow realistic decline (no cap on negative)
        // But don't let scores go below 20 or above 95
        updated_scores[muscle] = Math.max(20, Math.min(95, updated_scores[muscle]));
      }
    });

    // Recalculate overall as weighted average after capping
    if (updated_scores.chest && updated_scores.shoulders && updated_scores.back) {
      const avg = Math.round(
        (updated_scores.chest * 0.18 +
         updated_scores.shoulders * 0.18 +
         updated_scores.back * 0.18 +
         updated_scores.abs * 0.16 +
         updated_scores.legs * 0.15 +
         updated_scores.arms * 0.15) 
      );
      
      // Overall should be close to weighted average (AI overall can be ±3 of calculated)
      const overallDelta = Math.abs(updated_scores.overall - avg);
      if (overallDelta > 5) {
        console.log(`[OVERALL CAP] AI overall: ${updated_scores.overall}, Calculated avg: ${avg}. Correcting.`);
        updated_scores.overall = avg;
      }
    }

    // Save to Supabase
    const { error: dbError } = await supabase
      .from('progress_scans')
      .insert({
        user_id: userId,
        week_number: weekNumber,
        scores: updated_scores,
        created_at: new Date().toISOString()
      });

    if (dbError) {
      console.error("Supabase Save Error:", dbError);
      // Don't throw — still return scores to user even if DB save fails
    }

    res.status(200).json({
      success: true,
      updated_scores,
      delta_cap_applied: maxAllowedDelta
    });

  } catch (error) {
    console.error("[PROGRESS ANALYSIS ERROR]:", error);
    res.status(500).json({
      error: "Progress analysis failed",
      details: error.message
    });
  }
});
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`🚀 BodyMax Smart Server running on port ${PORT}`));

// Safari "Load failed" fix
server.keepAliveTimeout = 120000; 
server.headersTimeout = 120000;