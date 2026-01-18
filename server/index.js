const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const pdf = require('pdf-parse');
const { chunkText } = require('./utils/textSplitter');

dotenv.config();

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

        // Return chunks for frontend visualization (temporary)
        res.json({
            message: 'PDF processed successfully',
            textPreview: text.substring(0, 200),
            chunkCount: chunks.length,
            chunks: chunks
        });
    } catch (error) {
        console.error('PDF parsing error:', error);
        res.status(500).json({ error: 'Failed to process PDF' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
