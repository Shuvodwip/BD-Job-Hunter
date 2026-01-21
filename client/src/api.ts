export interface AnalysisResult {
    fitScore: number;
    strengths: string[];
    gaps: string[];
    recommendations: string[];
}

export interface RagDebug {
    criteriaUsed: string[];
    relevantChunksCount: number;
    relevantChunksPreview: string[];
}

export interface AnalysisResponse {
    analysis: AnalysisResult;
    ragDebug: RagDebug;
    error?: string;
}

export const analyzeFit = async (file: File, jobDescription: string): Promise<AnalysisResponse> => {
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobDescription', jobDescription);

    try {
        const response = await fetch('http://localhost:5000/analyze', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to analyze');
        }

        return await response.json();
    } catch (error) {
        console.error('Analysis API Error:', error);
        throw error;
    }
};
