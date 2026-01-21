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
        <div className="min-h-screen bg-white text-slate-800 selection:bg-yellow-200">
            {/* Background Gradients - Vibrant Yellows */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-yellow-300/20 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-amber-200/20 rounded-full blur-[100px]"></div>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-12 relative z-10">
                {/* Header */}
                <header className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center space-x-2 bg-yellow-50 px-4 py-2 rounded-full border border-yellow-200 shadow-sm mb-4">
                        <Sparkles className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm font-bold text-yellow-700 uppercase tracking-wide">AI Career Booster</span>
                    </div>
                    <h1 className="text-6xl md:text-7xl font-extrabold text-slate-900 tracking-tight">
                        BD Job <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-amber-600">Hunter</span>
                    </h1>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">
                        Supercharge your resume with bright ideas and precise AI analysis.
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
                                <div className="bg-yellow-50/50 border border-yellow-100 rounded-2xl p-6">
                                    <h3 className="text-slate-800 font-bold mb-4">Easy Steps</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-3 font-medium text-slate-600">
                                            <div className="w-8 h-8 rounded-full bg-white border-2 border-yellow-400 flex items-center justify-center text-sm font-bold text-slate-800 shadow-sm">1</div>
                                            <span>Upload your PDF resume</span>
                                        </div>
                                        <div className="flex items-center space-x-3 font-medium text-slate-600">
                                            <div className="w-8 h-8 rounded-full bg-white border-2 border-yellow-400 flex items-center justify-center text-sm font-bold text-slate-800 shadow-sm">2</div>
                                            <span>Paste the job description</span>
                                        </div>
                                        <div className="flex items-center space-x-3 font-bold text-slate-900">
                                            <div className="w-8 h-8 rounded-full bg-yellow-400 border-2 border-yellow-400 flex items-center justify-center text-sm font-bold text-slate-900 shadow-sm">3</div>
                                            <span>Get your Fit Score!</span>
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
                                <div className="mb-4 text-red-600 bg-red-50 px-4 py-2 rounded-lg border border-red-100 font-medium">
                                    {error}
                                </div>
                            )}

                            <button
                                onClick={handleAnalyze}
                                disabled={!file || !jobDescription || isAnalyzing}
                                className={`
                  group relative px-10 py-5 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-2xl font-bold text-xl text-slate-900
                  shadow-xl shadow-yellow-500/20 transition-all duration-300 border-2 border-transparent
                  ${(!file || !jobDescription || isAnalyzing)
                                        ? 'opacity-50 cursor-not-allowed grayscale'
                                        : 'hover:scale-105 hover:shadow-yellow-500/40 hover:border-white/50'
                                    }
                `}
                            >
                                <div className="flex items-center space-x-3">
                                    {isAnalyzing ? (
                                        <>
                                            <Loader className="w-6 h-6 animate-spin" />
                                            <span>Analyzing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Check My Fit</span>
                                            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
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
                            className="mb-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 font-bold flex items-center space-x-2 transition-colors"
                        >
                            <span>← Start New Analysis</span>
                        </button>

                        <AnalysisResultView result={result.analysis} />

                        {/* Rag Debug */}
                        <div className="mt-12 pt-8 border-t-2 border-slate-100">
                            <h4 className="text-slate-400 text-sm mb-4 uppercase tracking-wider font-bold">Behind the Scenes (RAG)</h4>
                            <div className="grid md:grid-cols-2 gap-4 text-xs text-slate-500">
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                    <span className="font-bold block mb-2 text-slate-800">Job Criteria Found:</span>
                                    <div className="flex flex-wrap gap-2">
                                        {result.ragDebug.criteriaUsed.map((c, i) => (
                                            <span key={i} className="bg-white border border-slate-200 px-2 py-1 rounded text-slate-700 shadow-sm">{c}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                    <span className="font-bold block mb-2 text-slate-800">Resume Context:</span>
                                    <p className="font-medium">Using top {result.ragDebug.relevantChunksCount} most relevant sections for analysis.</p>
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
