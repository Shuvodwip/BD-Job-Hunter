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

const router = express.Router();

router.get('/', (req, res) => {
    res.send('BD-Job-Hunter API is running');
});

router.post('/upload', upload.single('resume'), async (req, res) => {
    // ... (upload logic same as before) ...
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const data = await pdf(req.file.buffer);
        const text = data.text;
        const chunks = chunkText(text);
        const embeddings = await generateEmbeddings(chunks);
        res.json({
            message: 'PDF processed and embedded successfully',
            textPreview: text.substring(0, 200),
            chunkCount: chunks.length,
            embeddingDimension: embeddings[0]?.length || 0,
            chunks: chunks
        });
    } catch (error) {
        console.error('PDF parsing error:', error);
        res.status(500).json({ error: 'Failed to process PDF', details: error.message });
    }
});

router.post('/analyze', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file || !req.body.jobDescription) {
            return res.status(400).json({ error: 'Resume (PDF) and Job Description are required' });
        }
        const jobDescription = req.body.jobDescription;
        const pdfData = await pdf(req.file.buffer);
        const resumeChunks = chunkText(pdfData.text);

        if (resumeChunks.length === 0) {
            return res.status(400).json({ error: 'Could not extract text from resume' });
        }
        const resumeEmbeddings = await generateEmbeddings(resumeChunks);
        const vectorStore = resumeChunks.map((chunk, i) => ({
            id: `chunk_${i}`,
            text: chunk,
            embedding: resumeEmbeddings[i]
        }));
        const criteria = await extractJobCriteria(jobDescription);
        const criteriaEmbeddings = await generateEmbeddings(criteria);
        const relevantChunksSet = new Set();
        criteriaEmbeddings.forEach((criterionVec, i) => {
            const matches = findNearestNeighbors(criterionVec, vectorStore, 3);
            matches.forEach(match => relevantChunksSet.add(match.item.text));
        });
        const relevantChunks = Array.from(relevantChunksSet);
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

// Mount router on both root and /api to handle Vercel rewrites
app.use('/', router);
app.use('/api', router);

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
