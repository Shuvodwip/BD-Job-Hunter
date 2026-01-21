import React, { useCallback, useState } from 'react';
import { Upload, FileText, X } from 'lucide-react';

interface FileUploadProps {
    onFileSelect: (file: File | null) => void;
    selectedFile: File | null;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, selectedFile }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragging(true);
        } else if (e.type === 'dragleave') {
            setIsDragging(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type === 'application/pdf') {
                onFileSelect(file);
            } else {
                alert('Please upload a PDF file');
            }
        }
    }, [onFileSelect]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onFileSelect(e.target.files[0]);
        }
    };

    if (selectedFile) {
        return (
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex items-center justify-between group hover:border-blue-500/50 transition-all">
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-500/20 rounded-lg">
                        <FileText className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                        <p className="text-slate-200 font-medium truncate max-w-[200px]">{selectedFile.name}</p>
                        <p className="text-slate-400 text-sm">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                </div>
                <button
                    onClick={() => onFileSelect(null)}
                    className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
        );
    }

    return (
        <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`
        relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 ease-in-out
        flex flex-col items-center justify-center text-center cursor-pointer
        ${isDragging
                    ? 'border-blue-500 bg-blue-500/10 scale-[1.02]'
                    : 'border-slate-700 hover:border-blue-500/50 hover:bg-slate-800/50 bg-slate-900/50'
                }
      `}
        >
            <input
                type="file"
                accept=".pdf"
                onChange={handleChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="p-4 bg-slate-800 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                <Upload className={`w-8 h-8 ${isDragging ? 'text-blue-400' : 'text-slate-400'}`} />
            </div>
            <h3 className="text-lg font-semibold text-slate-200 mb-1">
                Upload Resume (PDF)
            </h3>
            <p className="text-slate-400 text-sm">
                Drag & drop or click to browse
            </p>
        </div>
    );
};

export default FileUpload;
