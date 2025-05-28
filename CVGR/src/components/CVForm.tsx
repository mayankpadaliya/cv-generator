import React from 'react';
import { CVData } from '../types/cv';
import PersonalInfoSection from './sections/PersonalInfoSection';
import EducationSection from './sections/EducationSection';
import ExperienceSection from './sections/ExperienceSection';
import SkillsSection from './sections/SkillsSection';
import CertificationsSection from './sections/CertificationsSection';
import toast from 'react-hot-toast';

interface CVFormProps {
  data: CVData;
  isLoading: boolean;
  activeSection: string;
  onDataChange: (data: Partial<CVData>) => void;
  onGeneratePDF: () => void;
}

const CVForm: React.FC<CVFormProps> = ({
  data,
  isLoading,
  activeSection,
  onDataChange,
  onGeneratePDF,
}) => {
  const [linkedinUrl, setLinkedinUrl] = React.useState('');
  const [isFetching, setIsFetching] = React.useState(false);
  const [isProcessingPDF, setIsProcessingPDF] = React.useState(false);
  const [parsedPDFText, setParsedPDFText] = React.useState<string>('');

  const handleLinkedInFetch = async () => {
    if (!linkedinUrl) {
      toast.error('Please enter a LinkedIn profile URL');
      return;
    }

    setIsFetching(true);
    try {
      const response = await fetch('http://localhost:8000/api/fetch-linkedin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ linkedinUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch LinkedIn data');
      }

      const linkedinData = await response.json();
      onDataChange(linkedinData);
      toast.success('LinkedIn data imported successfully!');
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to fetch LinkedIn data');
    } finally {
      setIsFetching(false);
    }
  };

  const handlePDFUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if file is PDF
    if (!file.name.endsWith('.pdf')) {
      toast.error('Please upload a PDF file');
      return;
    }

    setIsProcessingPDF(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      // First test the PDF parsing
      console.log('Testing PDF parsing...');
      const testResponse = await fetch('http://localhost:5000/api/test-pdf-parse', {
        method: 'POST',
        body: formData,
      });

      if (!testResponse.ok) {
        const errorData = await testResponse.json();
        throw new Error(errorData.detail || 'Failed to test PDF parsing');
      }

      const testResult = await testResponse.json();
      console.log('PDF test results:', testResult);

      if (!testResult.success) {
        throw new Error('Could not extract text from PDF. The file might be scanned or protected.');
      }

      // If test is successful, proceed with actual upload
      console.log('PDF test successful, proceeding with upload...');
      const response = await fetch('http://localhost:5000/api/upload-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to process PDF');
      }

      const result = await response.json();
      
      // Store the raw text
      setParsedPDFText(result.rawText);
      console.log('Parsed PDF text length:', result.rawText.length);
      
      // Update form sections with the parsed data and include parsedPDFText
      onDataChange({
        ...result.sections,
        parsedPDFText: result.rawText
      });

      toast.success('CV uploaded and parsed successfully!');
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to process PDF');
    } finally {
      setIsProcessingPDF(false);
      // Clear the file input
      event.target.value = '';
    }
  };

  // Modified onGeneratePDF to include the parsed text
  const handleGeneratePDF = async () => {
    if (isLoading) return;

    try {
      // First save the CV data with parsed text
      const cvData = {
        ...data,
        parsedPDFText // Include the parsed text for OpenAI processing
      };

      // Save the CV data with parsed text
      const saveResponse = await fetch('http://localhost:5000/api/cv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: cvData }),
      });

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json();
        throw new Error(errorData.detail || 'Failed to save CV data');
      }

      const saveResult = await saveResponse.json();
      
      // Then call the parent's onGeneratePDF which will use the saved data
      onGeneratePDF();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to generate PDF');
    }
  };

  return (
    <div className="space-y-8">
      {/* Template Selection */}
      <div className="bg-white p-6 rounded-lg shadow">
        <label className="block text-sm font-medium text-gray-700">
          Choose Template
        </label>
        <select
          disabled
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md cursor-not-allowed bg-gray-100"
          title="Coming later"
        >
          <option>Modern (Coming Soon)</option>
        </select>
      </div>

      {/* LinkedIn Import Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Import Data</h2>
        
        {/* LinkedIn URL Input */}
        <div className="mb-6">
          <h3 className="text-md font-medium text-gray-700 mb-2">From LinkedIn</h3>
          <div className="flex gap-4">
            <input
              type="url"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="Enter LinkedIn profile URL"
              className="flex-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
            <button
              type="button"
              onClick={handleLinkedInFetch}
              disabled={isFetching}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isFetching ? 'Fetching...' : 'Import from LinkedIn'}
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Enter your LinkedIn profile URL to automatically import your professional data
          </p>
        </div>

        {/* PDF Upload Section */}
        <div>
          <h3 className="text-md font-medium text-gray-700 mb-2">From PDF</h3>
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept=".pdf"
              onChange={handlePDFUpload}
              disabled={isProcessingPDF}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
            />
            {isProcessingPDF && (
              <div className="flex items-center">
                <svg
                  className="animate-spin h-5 w-5 text-primary-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span className="ml-2 text-sm text-gray-600">Processing...</span>
              </div>
            )}
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Upload your existing CV in PDF format to enhance it with AI
          </p>
        </div>
      </div>

      {/* Form Sections */}
      <PersonalInfoSection
        data={data.personalInfo}
        onChange={(personalInfo) => onDataChange({ personalInfo })}
      />
      <EducationSection
        education={data.education}
        onChange={(education) => onDataChange({ education })}
      />
      <ExperienceSection
        experience={data.experience}
        onChange={(experience) => onDataChange({ experience })}
      />
      <SkillsSection
        skills={data.skills}
        onChange={(skills) => onDataChange({ skills })}
      />
      <CertificationsSection
        certifications={data.certifications}
        onChange={(certifications) => onDataChange({ certifications })}
      />

      {/* Generate PDF Button */}
      <div className="flex justify-center pt-6">
        <button
          type="button"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleGeneratePDF}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Preparing your CV...
            </>
          ) : (
            'Generate Enhanced PDF'
          )}
        </button>
      </div>
    </div>
  );
};

export default CVForm; 