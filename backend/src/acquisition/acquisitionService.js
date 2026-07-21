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
        max_completion_tokens: 8192,
    });

    const content = response.choices[0].message.content;

    const dinosaur = JSON.parse(content);

    return dinosaur;
};

module.exports = {
    startAcquisition,
};
