import { CVData } from '../types/cv';

const API_BASE_URL = 'http://localhost:5000/api';

export const saveCV = async (cvData: CVData): Promise<{ message: string; filename: string }> => {
  const response = await fetch(`${API_BASE_URL}/cv`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data: cvData }),
  });

  if (!response.ok) {
    throw new Error('Failed to save CV data');
  }

  return response.json();
};

export const getAllCVs = async (): Promise<Array<{ filename: string; data: CVData }>> => {
  const response = await fetch(`${API_BASE_URL}/cv`);

  if (!response.ok) {
    throw new Error('Failed to fetch CVs');
  }

  return response.json();
};

export const getCV = async (filename: string): Promise<CVData> => {
  const response = await fetch(`${API_BASE_URL}/cv/${filename}`);

  if (!response.ok) {
    throw new Error('Failed to fetch CV');
  }

  return response.json();
}; 