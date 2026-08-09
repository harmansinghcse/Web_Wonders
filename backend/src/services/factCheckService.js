const groq = require("../config/groq");
const Post = require("../models/Post");
const Dinosaur = require("../models/Dinosaur");
const FactCheck = require("../models/FactCheck");

/**
 * Fact-checks a community post using Professor Ross / Llama, with dinosaur record grounding.
 * @param {string} postId - The post ID
 * @returns {Promise<object>} - Cached or newly created FactCheck document
 */
const factCheckPost = async (postId) => {
    // 1. Check if cached FactCheck already exists
    let existingFC = await FactCheck.findOne({ post: postId });
    if (existingFC) {
        return existingFC;
    }

    // 2. Fetch post
    const post = await Post.findById(postId).populate("dinosaur");
    if (!post) {
        throw new Error("Post not found.");
    }

    // 3. Ground truth context if dinosaur is attached
    let groundTruth = "";
    if (post.dinosaur) {
        groundTruth = `Dinosaur Name: ${post.dinosaur.name}
Scientific Name: ${post.dinosaur.scientificName}
Stats: ${JSON.stringify(post.dinosaur.stats || {})}
About: ${JSON.stringify(post.dinosaur.about || {})}`;
    }

    // 4. Construct prompt
    const isQuestion = post.postType === "question";
    let prompt = "";
    if (isQuestion) {
        prompt = `
You are Professor Ross, resident paleontologist. Answer the following user question:
Question: "${post.description}"

${groundTruth ? `Context from our database:\n${groundTruth}` : ""}

Provide a wise, scientifically grounded, yet highly accessible answer. Maintain your personality (forty years in the field, curious, dry/gentle humor, natural tone).
Respond ONLY with a JSON object containing:
1. "verdict": Always output "Answered".
2. "explanation": A 2-4 sentence answer to the question.

JSON response format:
{
  "verdict": "Answered",
  "explanation": "Answer text"
}
`;
    } else {
        prompt = `
Fact check the following community post about paleontology/dinosaurs:
Title: "${post.title}"
Content: "${post.description}"

${groundTruth ? `Ground Truth Context from our database:\n${groundTruth}` : ""}

Evaluate the factual claims made in the post. Respond ONLY with a JSON object containing:
1. "verdict": One of: "Correct", "Mostly Correct", "Partially Correct", "Misleading", "Incorrect", "Insufficient Evidence".
2. "explanation": A 2-4 sentence explanation. Keep the tone scientific, encouraging, and characteristic of Professor Ross (wise, mentor-like, forty years in the field).

JSON response format:
{
  "verdict": "VerdictName",
  "explanation": "Explanation text"
}
`;
    }

    const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            {
                role: "system",
                content: isQuestion 
                    ? "You are Professor Ross, a professional paleontologist answering student questions. You must output a valid JSON object."
                    : "You are Professor Ross, a professional paleontologist fact-checking dinosaur claims. You must output a valid JSON object."
            },
            {
                role: "user",
                content: prompt
            }
        ],
        response_format: { type: "json_object" }
    });

    const resultText = completion.choices[0].message.content;
    let parsed;
    try {
        parsed = JSON.parse(resultText);
    } catch (e) {
        console.error("Failed to parse AI response:", resultText);
        parsed = {
            verdict: isQuestion ? "Answered" : "Insufficient Evidence",
            explanation: isQuestion 
                ? "Professor Ross was unable to answer the question at this time." 
                : "Professor Ross was unable to verify the claims at this time."
        };
    }

    // Ensure verdict is valid
    const validVerdicts = ["Correct", "Mostly Correct", "Partially Correct", "Misleading", "Incorrect", "Insufficient Evidence", "Answered"];
    if (!validVerdicts.includes(parsed.verdict)) {
        parsed.verdict = isQuestion ? "Answered" : "Insufficient Evidence";
    }

    // Save and cache result
    const factCheck = await FactCheck.create({
        post: postId,
        verdict: parsed.verdict,
        explanation: parsed.explanation,
        checkedBy: "Professor Ross / Gemini",
        checkedAt: new Date()
    });

    return factCheck;
};

module.exports = {
    factCheckPost,
};
