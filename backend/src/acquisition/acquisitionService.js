const ross = require("../config/groq");
const { buildPrompt } = require("./promptBuilder");

const startAcquisition = async (topic) => {
    const { systemPrompt, userPrompt } = buildPrompt(topic);

    const response = await ross.chat.completions.create({
        model: "openai/gpt-oss-120b",
        messages: [
            {
                role: "system",
                content: systemPrompt,
            },
            {
                role: "user",
                content: userPrompt,
            },
        ],
        temperature: 0.2,
        max_tokens: 4000,
    });

    const content = response.choices[0].message.content;
    console.log("RAW CONTENT LENGTH:", content.length);
    console.log("RAW CONTENT FROM AI:\n", content);

    // Extract JSON block in case AI wraps it in markdown or conversational text
    let jsonContent = content.trim();
    const firstBrace = jsonContent.indexOf("{");
    const lastBrace = jsonContent.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1) {
        jsonContent = jsonContent.substring(firstBrace, lastBrace + 1);
    }

    const dinosaur = JSON.parse(jsonContent);

    return dinosaur;
};

module.exports = {
    startAcquisition,
};
