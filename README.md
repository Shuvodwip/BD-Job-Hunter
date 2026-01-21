# BD Job Hunter 🚀
> **AI-Powered Resume Optimizer & Job Fit Analyzer**

BD Job Hunter is a full-stack web application that uses **Google Gemini AI (2.5 Flash)** and **RAG (Retrieval Augmented Generation)** to analyze your resume against specific job descriptions. It provides a "Fit Score", identifies key strengths/gaps, and offers actionable recommendations.

![Screenshot](https://via.placeholder.com/800x400.png?text=BD+Job+Hunter+UI+Preview)

## ✨ Features
- **📄 PDF Resume Parsing**: Drag & drop support for PDF resumes.
- **🔍 RAG Analysis**: Uses vector embeddings (`text-embedding-004`) to match resume chunks with job criteria.
- **🤖 Advanced AI**: Powered by `gemini-2.5-flash` for high-quality, context-aware analysis.
- **📊 Fit Score**: interactive dashboard with scoring, gap analysis, and keyword matching.
- **🎨 Premium UI**: Glassmorphism design with Dark Mode, built with React & Tailwind CSS.
- **💰 Cost Efficient**: Optimized to run completely on Google's Free Tier (using in-memory vector store).

## 🛠️ Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Lucide React
- **Backend**: Node.js, Express
- **AI/ML**: Google Gemini API (`@google/generative-ai`)
- **Processing**: `multer` (Uploads), `pdf-parse` (Extraction)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- A [Google Gemini API Key](https://aistudio.google.com/apikey) (Free)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd BD-Job-Hunter
   ```

2. **Install Dependencies**
   Run the installation for both server and client:
   ```bash
   # Install root dependencies
   npm install

   # Install application dependencies
   cd server && npm install
   cd ../client && npm install
   ```

3. **Configure Environment**
   Create a `.env` file in the `server/` directory:
   ```env
   # server/.env
   GEMINI_API_KEY=your_actual_api_key_here
   PORT=5000
   ```

### 🏃‍♂️ Running the App

You can run both Frontend and Backend with a single command from the root:
```bash
# In project root
npm run start
```

Or run them individually:
- **Backend**: `cd server && npm run dev` (Runs on `http://localhost:5000`)
- **Frontend**: `cd client && npm run dev` (Runs on `http://localhost:5173`)

## 🧠 How it Works (RAG Pipeline)
1. **Upload**: User uploads PDF. Server extracts text and splits it into chunks.
2. **Embed**: Server generates vector embeddings for each chunk using `text-embedding-004`.
3. **Analyze**:
   - Extracts technical keys from the Job Description using Gemini.
   - Vectors searches the most relevant resume sections.
   - Passes the context to `gemini-2.5-flash` to generate the Fit Score JSON.
4. **Result**: Frontend displays the analysis visually.

## 📄 License
MIT
