import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import Header from './components/Header';
import CVForm from './components/CVForm';
import { CVData, CVGeneratorState } from './types/cv';
import { saveCV } from './services/api';

const initialState: CVGeneratorState = {
  data: {
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      location: '',
    },
    education: [],
    experience: [],
    skills: [],
    certifications: [],
  },
  isLoading: false,
  error: null,
  activeSection: 'personalInfo',
  selectedTemplate: 'modern',
};

function App() {
  const [state, setState] = useState<CVGeneratorState>(initialState);

  const handleDataChange = (newData: Partial<CVData>) => {
    setState(prev => ({
      ...prev,
      data: { ...prev.data, ...newData },
    }));
  };

  const handleGeneratePDF = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      // First save the CV data
      const result = await saveCV(state.data);
      
      // Then generate and download the PDF
      const response = await fetch('http://localhost:5000/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cv_file_name: result.filename }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to generate PDF');
      }

      // Get the PDF blob
      const blob = await response.blob();
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link element and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = result.filename.replace('.json', '.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('CV generated and downloaded successfully!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to generate CV');
      setState(prev => ({ ...prev, error: 'Failed to generate CV' }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <CVForm
            data={state.data}
            isLoading={state.isLoading}
            activeSection={state.activeSection}
            onDataChange={handleDataChange}
            onGeneratePDF={handleGeneratePDF}
          />
        </div>
      </main>
    </div>
  );
}

export default App; 