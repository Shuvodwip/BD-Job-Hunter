const fs = require('fs');
const http = require('http');

async function testAnalyze() {
    const boundary = '----WebKitFormBoundary' + Math.random().toString(36);
    const pdfPath = './test-resume.pdf';

    if (!fs.existsSync(pdfPath)) {
        console.log('❌ test-resume.pdf not found');
        return;
    }

    const pdfBuffer = fs.readFileSync(pdfPath);

    // Job Description to test against
    const jobDescription = `
    We are looking for a Senior Software Engineer with:
    - Strong experience in Node.js and Express
    - Proficiency in React and Tailwind CSS
    - Experience with AWS and Cloud infrastructure
    - Knowledge of Vector Databases using AI/LLMs
  `;

    // Construct Multipart Body
    let body = Buffer.concat([
        Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="jobDescription"\r\n\r\n${jobDescription}\r\n`),
        Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="resume"; filename="test-resume.pdf"\r\nContent-Type: application/pdf\r\n\r\n`),
        pdfBuffer,
        Buffer.from(`\r\n--${boundary}--`)
    ]);

    const options = {
        hostname: 'localhost',
        port: 5000,
        path: '/analyze',
        method: 'POST',
        headers: {
            'Content-Type': `multipart/form-data; boundary=${boundary}`,
            'Content-Length': body.length
        }
    };

    console.log('🧠 Testing Full RAG Pipeline (/analyze)...\n');
    console.log('Job Description used:', jobDescription.trim().substring(0, 100) + '...');

    const req = http.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            try {
                const response = JSON.parse(data);

                if (res.statusCode === 200) {
                    console.log('\n✅ SUCCESS! Analysis Generated:\n');
                    console.log('--- RAG DEBUG INFO ---');
                    if (response.ragDebug) {
                        console.log('Criteria Extracted:', response.ragDebug.criteriaUsed);
                        console.log('Relevant Chunks Found:', response.ragDebug.relevantChunksCount);
                    }

                    console.log('\n--- FIT ANALYSIS ---');
                    console.log(JSON.stringify(response.analysis, null, 2));

                } else {
                    console.log('❌ Error:', response.error);
                    console.log('Details:', response.details);
                }
            } catch (e) {
                console.log('❌ Failed to parse response:', data.substring(0, 200));
            }
        });
    });

    req.on('error', (e) => {
        console.error('❌ Request failed:', e.message);
    });

    req.write(body);
    req.end();
}

testAnalyze();
