const fs = require('fs');
const http = require('http');

async function testUpload() {
    const boundary = '----WebKitFormBoundary' + Math.random().toString(36);
    const pdfPath = './test-resume.pdf';

    if (!fs.existsSync(pdfPath)) {
        console.log('❌ test-resume.pdf not found');
        return;
    }

    const pdfBuffer = fs.readFileSync(pdfPath);

    const header = `------${boundary}\r\nContent-Disposition: form-data; name="resume"; filename="test-resume.pdf"\r\nContent-Type: application/pdf\r\n\r\n`;
    const footer = `\r\n------${boundary}--`;

    const body = Buffer.concat([
        Buffer.from(header),
        pdfBuffer,
        Buffer.from(footer)
    ]);

    const options = {
        hostname: 'localhost',
        port: 5000,
        path: '/upload',
        method: 'POST',
        headers: {
            'Content-Type': `multipart/form-data; boundary=----${boundary}`,
            'Content-Length': body.length
        }
    };

    console.log('📤 Testing PDF Upload + Embedding Generation...\n');

    const req = http.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            try {
                const response = JSON.parse(data);

                if (res.statusCode === 200) {
                    console.log('✅ SUCCESS!\n');
                    console.log('📊 Results:');
                    console.log(`   Message: ${response.message}`);
                    console.log(`   Text Preview: ${response.textPreview.substring(0, 80)}...`);
                    console.log(`   Chunks Created: ${response.chunkCount}`);
                    console.log(`   Embedding Dimension: ${response.embeddingDimension}D`);
                    console.log('\n✨ All systems working:');
                    console.log('   ✓ PDF Upload');
                    console.log('   ✓ Text Extraction');
                    console.log('   ✓ Text Chunking');
                    console.log('   ✓ Gemini Embeddings (text-embedding-004)');
                } else {
                    console.log('❌ Error:', response.error);
                }
            } catch (e) {
                console.log('❌ Response:', data);
            }
        });
    });

    req.on('error', (e) => {
        console.error('❌ Request failed:', e.message);
    });

    req.write(body);
    req.end();
}

testUpload();
