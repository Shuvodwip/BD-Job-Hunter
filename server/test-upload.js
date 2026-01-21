const fs = require('fs');
const FormData = require('form-data');
const fetch = require('node-fetch');

async function testUpload() {
    try {
        // Check if test PDF exists
        const pdfPath = './test-resume.pdf';
        if (!fs.existsSync(pdfPath)) {
            console.log('❌ test-resume.pdf not found. Please add a sample PDF to test.');
            console.log('You can create one or download a sample resume PDF.');
            return;
        }

        const form = new FormData();
        form.append('resume', fs.createReadStream(pdfPath));

        console.log('📤 Uploading test PDF...');

        const response = await fetch('http://localhost:5000/upload', {
            method: 'POST',
            body: form
        });

        const data = await response.json();

        if (response.ok) {
            console.log('✅ Upload successful!');
            console.log('📊 Results:');
            console.log(`   - Text preview: ${data.textPreview.substring(0, 100)}...`);
            console.log(`   - Chunks: ${data.chunkCount}`);
            console.log(`   - Embedding dimension: ${data.embeddingDimension}`);
            console.log(`   - Message: ${data.message}`);
        } else {
            console.log('❌ Upload failed:', data.error);
        }
    } catch (error) {
        console.error('❌ Test error:', error.message);
    }
}

testUpload();
