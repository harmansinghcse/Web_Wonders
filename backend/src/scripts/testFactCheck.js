const Groq = require("groq-sdk");
require("dotenv").config();

async function run() {
    try {
        console.log("Professor_Ross_Key loaded:", !!process.env.Professor_Ross_Key);
        const groq = new Groq({
            apiKey: process.env.Professor_Ross_Key,
        });

        console.log("Calling Groq chat completions...");
        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: "You are Professor Ross, a professional paleontologist. You must output a valid JSON object."
                },
                {
                    role: "user",
                    content: "Please fact check: 'T. rex was a small herbivore.' Respond in JSON format: { \"verdict\": \"Incorrect\", \"explanation\": \"T. rex was a large theropod carnivore.\" }"
                }
            ],
            response_format: { type: "json_object" }
        });

        console.log("Success! Response content:", completion.choices[0].message.content);
        process.exit(0);
    } catch (err) {
        console.error("Groq call failed with error:", err);
        process.exit(1);
    }
}

run();
