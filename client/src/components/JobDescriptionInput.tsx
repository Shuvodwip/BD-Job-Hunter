import React from 'react';
import { Briefcase } from 'lucide-react';

interface JobDescriptionInputProps {
    value: string;
    onChange: (value: string) => void;
}

const JobDescriptionInput: React.FC<JobDescriptionInputProps> = ({ value, onChange }) => {
    return (
        <div className="space-y-3 h-full flex flex-col">
            <div className="flex items-center space-x-2 text-slate-800">
                <div className="p-1.5 bg-yellow-100 rounded-lg">
                    <Briefcase className="w-5 h-5 text-yellow-600" />
                </div>
                <h3 className="font-bold text-lg">Job Description</h3>
            </div>
            <div className="relative group flex-grow">
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Paste the job requirements here..."
                    className="w-full h-full min-h-[250px] bg-white border-2 border-slate-200 rounded-2xl p-6 text-slate-800 placeholder-slate-400 
          focus:outline-none focus:border-yellow-400 focus:shadow-[0_0_0_4px_rgba(250,204,21,0.2)] transition-all resize-none custom-scrollbar font-medium text-lg"
                />
                <div className="absolute bottom-4 right-4 pointer-events-none">
                    <span className="text-xs font-bold text-slate-300 bg-slate-50 px-2 py-1 rounded">Text Area</span>
                </div>
            </div>
        </div>
    );
};

export default JobDescriptionInput;
