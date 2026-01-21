const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generate embeddings for text using Gemini's text-embedding-004 model
 * @param {string} text - Text to embed
 * @returns {Promise<number[]>} - Vector embedding (768 dimensions)
 */
async function generateEmbedding(text) {
    try {
        const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
        const result = await model.embedContent(text);
        return result.embedding.values;
    } catch (error) {
        console.error('Embedding generation error:', error);
        throw new Error('Failed to generate embedding');
    }
}

/**
 * Generate embeddings for multiple text chunks
 * @param {string[]} texts - Array of texts to embed
 * @returns {Promise<number[][]>} - Array of vector embeddings
 */
async function generateEmbeddings(texts) {
    try {
        const embeddings = await Promise.all(
            texts.map(text => generateEmbedding(text))
        );
        return embeddings;
    } catch (error) {
        console.error('Batch embedding error:', error);
        throw error;
    }
}

/**
 * Analyze fit between resume and job description using Gemini 1.5 Flash
 * @param {string} jobDescription - The job description
 * @param {string[]} relevantChunks - Relevant resume sections
 * @returns {Promise<Object>} - Analysis result with score and feedback
 */
async function analyzeFit(jobDescription, relevantChunks) {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const prompt = `You are an expert recruiter analyzing resume-job fit.

Job Description:
${jobDescription}

Relevant Resume Sections:
${relevantChunks.map((chunk, i) => `${i + 1}. ${chunk}`).join('\n\n')}

Analyze the fit between this resume and job requirements. Provide:
1. A fit score (0-100)
2. Key strengths (skills/experience that match)
3. Gaps (missing requirements)
4. Recommendations for the candidate

Respond in JSON format:
{
  "fitScore": <number>,
  "strengths": ["strength1", "strength2", ...],
  "gaps": ["gap1", "gap2", ...],
  "recommendations": ["rec1", "rec2", ...]
}`;

        const result = await model.generateContent(prompt);
        const response = result.response.text();

        // Extract JSON from response (handle markdown code blocks)
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('Failed to parse AI response');
        }

        return JSON.parse(jsonMatch[0]);
    } catch (error) {
        console.error('Fit analysis error:', error);
        throw new Error('Failed to analyze fit');
    }
}

/**
 * Extracts key technical usage criteria from a Job Description to use as search queries
 * @param {string} jobDescription 
 * @returns {Promise<string[]>} Array of short criteria strings
 */
async function extractJobCriteria(jobDescription) {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const prompt = `Extract 3-5 distinct, search-friendly technical requirements/skills from this job description. 
    Return ONLY a JSON array of strings.
    Example: ["React.js experience", "Node.js backend development", "AWS cloud infrastructure"]
    
    Job Description:
    ${jobDescription.substring(0, 5000)}`; // Truncate to avoid limits

        const result = await model.generateContent(prompt);
        const response = result.response.text();
        const jsonMatch = response.match(/\[[\s\S]*\]/);

        if (!jsonMatch) return [jobDescription]; // Fallback to whole text
        return JSON.parse(jsonMatch[0]);
    } catch (error) {
        console.warn('Criteria extraction failed, using raw text:', error);
        return [jobDescription.substring(0, 200)];
    }
}

module.exports = {
    generateEmbedding,
    generateEmbeddings,
    analyzeFit,
    extractJobCriteria
};
