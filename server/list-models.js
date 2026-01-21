
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testModel(modelName) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        console.log(`Testing ${modelName}...`);
        const result = await model.generateContent("Hello");
        console.log(`✅ Success with ${modelName}!`);
        return true;
    } catch (error) {
        console.log(`❌ Failed ${modelName}: ${error.message.split('\n')[0]}`);
        return false;
    }
}

async function run() {
    await testModel("gemini-1.5-flash");
    await testModel("gemini-1.5-flash-001");
    await testModel("gemini-1.5-flash-002");
    await testModel("gemini-1.5-pro");
    await testModel("gemini-pro");
}

run();
