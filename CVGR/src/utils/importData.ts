import { CVData } from '../types/cv';

interface LinkedInData {
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumbers: string[];
    location: {
      country: string;
      city: string;
    };
    publicProfileUrl: string;
  };
  positions: Array<{
    companyName: string;
    title: string;
    startDate: {
      year: number;
      month: number;
    };
    endDate?: {
      year: number;
      month: number;
    };
    description?: string;
  }>;
  education: Array<{
    schoolName: string;
    degreeName: string;
    fieldOfStudy: string;
    startDate: {
      year: number;
      month: number;
    };
    endDate?: {
      year: number;
      month: number;
    };
    description?: string;
  }>;
  skills: Array<{
    name: string;
  }>;
  certifications: Array<{
    name: string;
    authority: string;
    timePeriod: {
      startDate: {
        year: number;
        month: number;
      };
    };
    url?: string;
  }>;
}

const formatDate = (date: { year: number; month: number }): string => {
  return `${date.year}-${String(date.month).padStart(2, '0')}`;
};

export const importLinkedInData = (data: LinkedInData): CVData => {
  return {
    personalInfo: {
      firstName: data.profile.firstName,
      lastName: data.profile.lastName,
      email: data.profile.email,
      phone: data.profile.phoneNumbers[0] || '',
      location: `${data.profile.location.city}, ${data.profile.location.country}`,
      linkedIn: data.profile.publicProfileUrl,
      website: '',
    },
    education: data.education.map((edu) => ({
      institution: edu.schoolName,
      degree: edu.degreeName,
      field: edu.fieldOfStudy,
      startDate: formatDate(edu.startDate),
      endDate: edu.endDate ? formatDate(edu.endDate) : '',
      description: edu.description || '',
    })),
    experience: data.positions.map((pos) => ({
      company: pos.companyName,
      position: pos.title,
      startDate: formatDate(pos.startDate),
      endDate: pos.endDate ? formatDate(pos.endDate) : '',
      description: pos.description || '',
      achievements: [],
    })),
    skills: data.skills.map((skill) => skill.name),
    certifications: data.certifications.map((cert) => ({
      name: cert.name,
      issuer: cert.authority,
      date: formatDate(cert.timePeriod.startDate),
      url: cert.url || '',
    })),
  };
};

export const importJSONData = async (file: File): Promise<CVData> => {
  try {
    const text = await file.text();
    const data = JSON.parse(text);
    
    // Check if this is LinkedIn data
    if (data.profile && data.positions) {
      return importLinkedInData(data as LinkedInData);
    }
    
    // If it's already in our CV format, validate and return
    if (data.personalInfo && data.education && data.experience) {
      return data as CVData;
    }
    
    throw new Error('Invalid JSON format. Please provide either LinkedIn data export or CV data in the correct format.');
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unknown error occurred while parsing the JSON file');
  }
}; 