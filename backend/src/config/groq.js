const Groq = require("groq-sdk");

if (!process.env.Professor_Ross_Key) {
    throw new Error(
        "Professor_Ross_Key is missing. Please add it to your .env file.",
    );
}

const ross = new Groq({
    apiKey: process.env.Professor_Ross_Key,
});

module.exports = ross;
