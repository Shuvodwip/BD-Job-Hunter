import React from 'react';
import { CheckCircle, XCircle, Lightbulb, Target } from 'lucide-react';
import { AnalysisResult } from '../api';

interface AnalysisResultViewProps {
    result: AnalysisResult;
}

const AnalysisResultView: React.FC<AnalysisResultViewProps> = ({ result }) => {

    // Using catchy catchy feedback colors but keeping them readable
    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-amber-500';
        if (score >= 60) return 'text-yellow-500';
        return 'text-orange-500';
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Score Header */}
            <div className="relative overflow-hidden bg-white border-2 border-slate-100 rounded-3xl p-10 text-center shadow-xl shadow-yellow-100">
                <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400"></div>

                <div className="relative z-10">
                    <h2 className="text-slate-500 text-lg font-bold uppercase tracking-wider mb-6">Match Probability</h2>
                    <div className="inline-flex items-center justify-center relative">
                        {/* Catchy Ring */}
                        <div className="absolute inset-0 rounded-full border-[12px] border-slate-100"></div>
                        <div className={`absolute inset-0 rounded-full border-[12px] border-l-transparent border-t-transparent animate-spin-slow opacity-0`}></div> {/* Removed spin for better UX static score */}

                        {/* Score Display */}
                        <div className={`text-8xl font-black ${getScoreColor(result.fitScore)} drop-shadow-sm`}>
                            {result.fitScore}<span className="text-4xl text-slate-300">%</span>
                        </div>
                    </div>
                    <div className="mt-4">
                        {result.fitScore >= 80 && <span className="bg-green-100 text-green-700 font-bold px-4 py-1 rounded-full text-sm">Excellent Match! 🚀</span>}
                        {result.fitScore >= 60 && result.fitScore < 80 && <span className="bg-yellow-100 text-yellow-800 font-bold px-4 py-1 rounded-full text-sm">Good Potential 🌟</span>}
                        {result.fitScore < 60 && <span className="bg-orange-100 text-orange-700 font-bold px-4 py-1 rounded-full text-sm">Needs Optimization 🔧</span>}
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Strengths */}
                <div className="bg-white border-2 border-slate-100 rounded-2xl p-6 shadow-sm hover:border-green-400 transition-colors group">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-500 group-hover:text-white transition-colors">
                            <CheckCircle className="w-6 h-6 text-green-600 group-hover:text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">Your Strengths</h3>
                    </div>
                    <ul className="space-y-4">
                        {result.strengths.map((item, i) => (
                            <li key={i} className="flex items-start space-x-3 text-slate-700 font-medium">
                                <div className="mt-1.5 w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></div>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Gaps */}
                <div className="bg-white border-2 border-slate-100 rounded-2xl p-6 shadow-sm hover:border-red-400 transition-colors group">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-500 group-hover:text-white transition-colors">
                            <XCircle className="w-6 h-6 text-red-600 group-hover:text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">Missing Skills</h3>
                    </div>
                    <ul className="space-y-4">
                        {result.gaps.map((item, i) => (
                            <li key={i} className="flex items-start space-x-3 text-slate-600 font-medium">
                                <div className="mt-1.5 w-2 h-2 rounded-full bg-red-400 flex-shrink-0"></div>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Recommendations */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Lightbulb className="w-32 h-32 text-yellow-600" />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center space-x-3 mb-6 text-amber-800">
                        <Lightbulb className="w-8 h-8 fill-current" />
                        <h3 className="text-2xl font-bold">Smart Recommendations</h3>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        {result.recommendations.map((rec, i) => (
                            <div key={i} className="bg-white p-5 rounded-xl text-slate-700 font-medium shadow-sm border border-yellow-100 flex items-start space-x-3 hover:shadow-md transition-shadow">
                                <Target className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                                <p>{rec}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalysisResultView;
