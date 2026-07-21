const Groq = require("groq-sdk");

const groq = new Groq({
    apiKey: process.env.Professor_Ross_Key,
});

const generate = async ({ systemPrompt, userPrompt }) => {
    const response = await groq.chat.completions.create({
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
    });

    return response.choices[0].message.content;
};

module.exports = {
    generate,
};
