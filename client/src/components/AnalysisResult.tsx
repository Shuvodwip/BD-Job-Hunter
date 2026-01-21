import React from 'react';
import { CheckCircle, XCircle, Lightbulb, Target } from 'lucide-react';
import { AnalysisResult } from '../api';

interface AnalysisResultViewProps {
    result: AnalysisResult;
}

const AnalysisResultView: React.FC<AnalysisResultViewProps> = ({ result }) => {
    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-400 ring-green-400/30';
        if (score >= 60) return 'text-yellow-400 ring-yellow-400/30';
        return 'text-red-400 ring-red-400/30';
    };

    const getScoreGradient = (score: number) => {
        if (score >= 80) return 'from-green-500 to-emerald-600';
        if (score >= 60) return 'from-yellow-500 to-orange-600';
        return 'from-red-500 to-pink-600';
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Score Header */}
            <div className="relative overflow-hidden bg-slate-800/50 border border-slate-700 rounded-2xl p-8 text-center backdrop-blur-sm">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

                <div className="relative z-10">
                    <h2 className="text-slate-400 text-lg font-medium mb-4">Overall Fit Score</h2>
                    <div className="inline-flex items-center justify-center relative">
                        {/* Animated Ring */}
                        <div className={`absolute inset-0 rounded-full ring-8 opacity-20 animate-pulse ${getScoreColor(result.fitScore)}`}></div>

                        <div className={`text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b ${getScoreGradient(result.fitScore)}`}>
                            {result.fitScore}%
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Strengths */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-green-500/30 transition-colors">
                    <div className="flex items-center space-x-2 mb-4">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <h3 className="text-lg font-semibold text-slate-200">Key Strengths</h3>
                    </div>
                    <ul className="space-y-3">
                        {result.strengths.map((item, i) => (
                            <li key={i} className="flex items-start space-x-3 text-slate-300 text-sm">
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500/50 flex-shrink-0"></span>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Gaps */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-red-500/30 transition-colors">
                    <div className="flex items-center space-x-2 mb-4">
                        <XCircle className="w-5 h-5 text-red-400" />
                        <h3 className="text-lg font-semibold text-slate-200">Missing Requirements</h3>
                    </div>
                    <ul className="space-y-3">
                        {result.gaps.map((item, i) => (
                            <li key={i} className="flex items-start space-x-3 text-slate-300 text-sm">
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500/50 flex-shrink-0"></span>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Recommendations */}
            <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-slate-700 rounded-xl p-6">
                <div className="flex items-center space-x-2 mb-4">
                    <Lightbulb className="w-5 h-5 text-yellow-400" />
                    <h3 className="text-lg font-semibold text-slate-200">AI Recommendations</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                    {result.recommendations.map((rec, i) => (
                        <div key={i} className="bg-slate-900/40 p-4 rounded-lg border border-slate-800/50 flex items-start space-x-3">
                            <Target className="w-4 h-4 text-purple-400 mt-1 flex-shrink-0" />
                            <p className="text-slate-300 text-sm">{rec}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AnalysisResultView;
