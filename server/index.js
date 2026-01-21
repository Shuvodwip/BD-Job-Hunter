const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdf = require('pdf-parse');
const { chunkText } = require('./utils/textSplitter');
const { generateEmbeddings } = require('./services/geminiService');

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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
