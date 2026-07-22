const SYSTEM_PROMPT = require("./prompts/dinosaurPrompt");
const dinosaurTemplate = require("./prompts/dinosaurTemplate");

const buildPrompt = (topic) => {
    const userPrompt = `
Generate a complete dinosaur profile for "${topic}" using the provided JSON template.

This JSON will directly power a premium educational dinosaur website.

Every field has a specific UI purpose.

Follow the template exactly.

Do not add fields.

Do not remove fields.

Fill every field you can using scientifically accurate information.

Leave genuinely unknown values as null.

Do not repeat information across sections.

Each section should introduce new knowledge instead of rephrasing previous content.

Generate concise content that fits naturally into a modern website layout.

The Hero title must contain ONLY the genus.

The highlightedTitle must contain ONLY the species.

Generate image prompts but leave all image URL fields as null.

JSON Template:

${JSON.stringify(dinosaurTemplate, null, 2)}
`;

    return {
        systemPrompt: SYSTEM_PROMPT,
        userPrompt,
    };
};

module.exports = {
    buildPrompt,
};
