import { useState } from 'react';
import { Sparkles, ArrowRight, Loader } from 'lucide-react';
import FileUpload from './components/FileUpload';
import JobDescriptionInput from './components/JobDescriptionInput';
import AnalysisResultView from './components/AnalysisResult';
import { analyzeFit, AnalysisResponse } from './api';

function App() {
    const [file, setFile] = useState<File | null>(null);
    const [jobDescription, setJobDescription] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<AnalysisResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = async () => {
        if (!file || !jobDescription) return;

        setIsAnalyzing(true);
        setError(null);
        try {
            const data = await analyzeFit(file, jobDescription);
            setResult(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-white selection:bg-purple-500/30">
            {/* Background Gradients */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px]"></div>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-12 relative z-10">
                {/* Header */}
                <header className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center space-x-2 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700/50 backdrop-blur-sm mb-4">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <span className="text-sm font-medium text-slate-300">AI-Powered Career Assistant</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                        BD Job Hunter
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        Optimize your resume for any job description using advanced AI analysis.
                        Get instant feedback, fit scores, and actionable recommendations.
                    </p>
                </header>

                {/* Main Content */}
                {!result ? (
                    <div className="space-y-8 animate-fadeIn">
                        {/* Input Section */}
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <FileUpload
                                    onFileSelect={setFile}
                                    selectedFile={file}
                                />

                                {/* Steps Indicator */}
                                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                                    <h3 className="text-slate-200 font-semibold mb-4">How it works</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-3 text-slate-400">
                                            <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold ring-1 ring-slate-700">1</div>
                                            <span>Upload your PDF resume</span>
                                        </div>
                                        <div className="flex items-center space-x-3 text-slate-400">
                                            <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold ring-1 ring-slate-700">2</div>
                                            <span>Paste the job description</span>
                                        </div>
                                        <div className="flex items-center space-x-3 text-purple-400">
                                            <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-xs font-bold ring-1 ring-purple-500/50">3</div>
                                            <span>Get AI analysis & scoring</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="h-full">
                                <JobDescriptionInput
                                    value={jobDescription}
                                    onChange={setJobDescription}
                                />
                            </div>
                        </div>

                        {/* Action Button */}
                        <div className="flex flex-col items-center justify-center pt-8">
                            {error && (
                                <div className="mb-4 text-red-400 bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20">
                                    {error}
                                </div>
                            )}

                            <button
                                onClick={handleAnalyze}
                                disabled={!file || !jobDescription || isAnalyzing}
                                className={`
                  group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold text-lg
                  shadow-lg shadow-purple-500/25 transition-all duration-300
                  ${(!file || !jobDescription || isAnalyzing)
                                        ? 'opacity-50 cursor-not-allowed grayscale'
                                        : 'hover:scale-105 hover:shadow-purple-500/40'
                                    }
                `}
                            >
                                <div className="flex items-center space-x-2">
                                    {isAnalyzing ? (
                                        <>
                                            <Loader className="w-5 h-5 animate-spin" />
                                            <span>Analyzing Resume...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Analyze Fit</span>
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </div>
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Results View */
                    <div className="space-y-8">
                        <button
                            onClick={() => setResult(null)}
                            className="mb-4 text-slate-400 hover:text-white flex items-center space-x-2 transition-colors"
                        >
                            <span>← Analyze another job</span>
                        </button>

                        <AnalysisResultView result={result.analysis} />

                        {/* Rag Debug (Optional / Collapsible could be added) */}
                        <div className="mt-12 pt-8 border-t border-slate-800">
                            <h4 className="text-slate-500 text-sm mb-4 uppercase tracking-wider">Analysis Context (RAG)</h4>
                            <div className="grid md:grid-cols-2 gap-4 text-xs text-slate-400">
                                <div className="bg-slate-900/50 p-4 rounded-lg">
                                    <span className="font-semibold block mb-2 text-slate-300">Extracted Criteria:</span>
                                    <div className="flex flex-wrap gap-2">
                                        {result.ragDebug.criteriaUsed.map((c, i) => (
                                            <span key={i} className="bg-slate-800 px-2 py-1 rounded text-slate-400">{c}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-slate-900/50 p-4 rounded-lg">
                                    <span className="font-semibold block mb-2 text-slate-300">Relevant Resume Sections Used:</span>
                                    <p>{result.ragDebug.relevantChunksCount} chunks retrieved based on vector similarity.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
