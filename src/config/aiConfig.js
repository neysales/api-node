const aiConfig = {
    provider: process.env.AI_PROVIDER || 'openai', // openai, anthropic, google, meta
    apiKey: process.env.AI_API_KEY || '',
    model: process.env.AI_MODEL || 'gpt-3.5-turbo', // ou claude-3, gemini-pro, llama-2, etc
    temperature: 0.7,
    maxTokens: 2000
};

module.exports = aiConfig;
