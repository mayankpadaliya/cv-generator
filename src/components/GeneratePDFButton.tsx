import React, { useState } from 'react';

interface GeneratePDFButtonProps {
    cvFileName: string;
}

const GeneratePDFButton: React.FC<GeneratePDFButtonProps> = ({ cvFileName }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGeneratePDF = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch('http://localhost:5000/api/generate-pdf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ cv_file_name: cvFileName }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to generate PDF');
            }

            // Get the PDF blob
            const blob = await response.blob();
            
            // Create a URL for the blob
            const url = window.URL.createObjectURL(blob);
            
            // Create a temporary link element
            const link = document.createElement('a');
            link.href = url;
            link.download = cvFileName.replace('.json', '.pdf');
            
            // Trigger the download
            document.body.appendChild(link);
            link.click();
            
            // Clean up
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-2">
            <button
                onClick={handleGeneratePDF}
                disabled={isLoading}
                className={`px-4 py-2 rounded-lg text-white font-semibold ${
                    isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
                {isLoading ? 'Generating PDF...' : 'Generate Enhanced PDF'}
            </button>
            {error && (
                <p className="text-red-500 text-sm">{error}</p>
            )}
        </div>
    );
};

export default GeneratePDFButton; 