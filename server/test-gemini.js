require('dotenv').config();
const { generateEmbedding } = require('./services/geminiService');

async function quickTest() {
    console.log('🔍 Testing Gemini API directly...\n');

    try {
        console.log('Testing embedding generation...');
        const embedding = await generateEmbedding('Hello, this is a test.');
        console.log('✅ SUCCESS! Embedding generated:', embedding.length, 'dimensions');
        console.log('Sample values:', embedding.slice(0, 5));
    } catch (error) {
        console.log('❌ FAILED:', error.message);
        console.log('Full error:', error);
    }
}

quickTest();
