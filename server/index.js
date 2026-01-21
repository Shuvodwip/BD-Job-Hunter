const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdf = require('pdf-parse');
const { chunkText } = require('./utils/textSplitter');
const { findNearestNeighbors } = require('./utils/vectorUtils');
const {
    generateEmbeddings,
    extractJobCriteria,
    analyzeFit
} = require('./services/geminiService');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Configure Multer (Memory Storage)
const upload = multer({ storage: multer.memoryStorage() });

app.get('/', (req, res) => {
    res.send('BD-Job-Hunter API is running');
});

// PDF Upload & Extraction Endpoint
app.post('/upload', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Extract text from PDF buffer
        const data = await pdf(req.file.buffer);
        const text = data.text;

        // Chunk the text
        const chunks = chunkText(text);

        console.log(`PDF Extracted, length: ${text.length}, Chunks: ${chunks.length}`);

        // Generate embeddings for each chunk
        console.log('Generating embeddings...');
        const embeddings = await generateEmbeddings(chunks);
        console.log(`Generated ${embeddings.length} embeddings`);

        // Store chunks with embeddings (in-memory for now, Phase 3 will add vector store)
        const resumeData = chunks.map((chunk, i) => ({
            id: `chunk_${i}`,
            text: chunk,
            embedding: embeddings[i]
        }));

        // Return chunks for frontend visualization (temporary)
        res.json({
            message: 'PDF processed and embedded successfully',
            textPreview: text.substring(0, 200),
            chunkCount: chunks.length,
            embeddingDimension: embeddings[0]?.length || 0,
            chunks: chunks
        });
    } catch (error) {
        console.error('PDF parsing error:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ error: 'Failed to process PDF', details: error.message });
    }
});

// Full RAG Analysis Endpoint
app.post('/analyze', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file || !req.body.jobDescription) {
            return res.status(400).json({ error: 'Resume (PDF) and Job Description are required' });
        }

        const jobDescription = req.body.jobDescription;

        // 1. Process Resume (PDF -> Text -> Chunks -> Embeddings)
        console.log('📄 Processing Resume...');
        const pdfData = await pdf(req.file.buffer);
        const resumeChunks = chunkText(pdfData.text);

        if (resumeChunks.length === 0) {
            return res.status(400).json({ error: 'Could not extract text from resume' });
        }

        console.log(`🔹 Generated ${resumeChunks.length} chunks from resume.`);
        const resumeEmbeddings = await generateEmbeddings(resumeChunks);

        // Create simplified Vector Store (In-Memory for this request)
        const vectorStore = resumeChunks.map((chunk, i) => ({
            id: `chunk_${i}`,
            text: chunk,
            embedding: resumeEmbeddings[i]
        }));

        // 2. Process Job Description (Extract Criteria -> Embed Criteria)
        console.log('🔍 Extracting JD Criteria...');
        const criteria = await extractJobCriteria(jobDescription);
        console.log('🔹 Criteria found:', criteria);

        console.log('🧠 Embedding Criteria...');
        const criteriaEmbeddings = await generateEmbeddings(criteria);

        // 3. Retrieval (Match Criteria vs Resume Chunks)
        console.log('🤝 Matching Criteria to Resume...');
        const relevantChunksSet = new Set();

        // For each criterion, find top 3 matches
        criteriaEmbeddings.forEach((criterionVec, i) => {
            const matches = findNearestNeighbors(criterionVec, vectorStore, 3);
            matches.forEach(match => relevantChunksSet.add(match.item.text));
        });

        const relevantChunks = Array.from(relevantChunksSet);
        console.log(`🔹 Retrieved ${relevantChunks.length} unique relevant chunks.`);

        // 4. Generation (Analyze Fit with Context)
        console.log('🤖 Generating Analysis...');
        const analysis = await analyzeFit(jobDescription, relevantChunks);

        res.json({
            analysis,
            ragDebug: {
                criteriaUsed: criteria,
                relevantChunksCount: relevantChunks.length,
                relevantChunksPreview: relevantChunks.slice(0, 3)
            }
        });

    } catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({ error: 'Analysis failed', details: error.message });
    }
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
