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
            <div className="bg-white border-2 border-yellow-400 rounded-2xl p-4 flex items-center justify-between shadow-md">
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-yellow-100 rounded-xl">
                        <FileText className="w-8 h-8 text-yellow-600" />
                    </div>
                    <div>
                        <p className="text-slate-900 font-bold text-lg truncate max-w-[200px]">{selectedFile.name}</p>
                        <p className="text-slate-500 font-medium">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                </div>
                <button
                    onClick={() => onFileSelect(null)}
                    className="p-3 hover:bg-red-50 rounded-xl transition-colors text-slate-400 hover:text-red-500"
                >
                    <X className="w-6 h-6" />
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
        relative border-4 border-dashed rounded-2xl p-8 transition-all duration-300 ease-in-out
        flex flex-col items-center justify-center text-center cursor-pointer bg-slate-50
        ${isDragging
                    ? 'border-yellow-500 bg-yellow-50 scale-[1.02]'
                    : 'border-slate-300 hover:border-yellow-400 hover:bg-white'
                }
      `}
        >
            <input
                type="file"
                accept=".pdf"
                onChange={handleChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className={`p-5 rounded-full mb-4 transition-transform duration-300 group-hover:scale-110 ${isDragging ? 'bg-yellow-100' : 'bg-white shadow-sm'}`}>
                <Upload className={`w-10 h-10 ${isDragging ? 'text-yellow-600' : 'text-slate-400'}`} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-1">
                Upload Resume
            </h3>
            <p className="text-slate-500 font-medium">
                PDF Format Only
            </p>
        </div>
    );
};

export default FileUpload;
