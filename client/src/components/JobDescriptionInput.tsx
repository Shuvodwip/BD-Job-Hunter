import React from 'react';
import { Briefcase } from 'lucide-react';

interface JobDescriptionInputProps {
    value: string;
    onChange: (value: string) => void;
}

const JobDescriptionInput: React.FC<JobDescriptionInputProps> = ({ value, onChange }) => {
    return (
        <div className="space-y-3">
            <div className="flex items-center space-x-2 text-slate-200">
                <Briefcase className="w-5 h-5 text-purple-400" />
                <h3 className="font-semibold">Job Description</h3>
            </div>
            <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl opacity-20 group-hover:opacity-40 transition duration-300 blur"></div>
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Paste the job description here (responsibilities, requirements, skills)..."
                    className="relative w-full h-48 bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-300 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all resize-none custom-scrollbar"
                />
            </div>
        </div>
    );
};

export default JobDescriptionInput;
