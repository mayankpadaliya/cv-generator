import React from 'react';
import { Experience } from '../../types/cv';

interface ExperienceSectionProps {
  experience: Experience[];
  onChange: (experience: Experience[]) => void;
}

const COMPANY_LIST = [
  // Big Tech
  "Google", "Microsoft", "Amazon", "Facebook", "Apple", "Netflix", "Tesla",
  // Indian IT & Consulting
  "TCS", "Infosys", "Wipro", "HCL Technologies", "Tech Mahindra", "LTI", "Mindtree", "Mphasis", "Persistent Systems", "Birlasoft", "Hexaware", "Zensar", "Cyient", "NIIT Technologies", "Sonata Software", "Accenture", "Capgemini", "Cognizant", "Deloitte", "EY", "KPMG", "PwC",
  // Global Consulting
  "McKinsey & Company", "Boston Consulting Group", "Bain & Company", "Roland Berger", "Oliver Wyman", "AT Kearney", "Strategy&", "Mercer", "Gartner",
  // Startups & Unicorns
  "Flipkart", "Ola", "Paytm", "Swiggy", "Zomato", "BYJU'S", "Razorpay", "Freshworks", "CRED", "Meesho", "Udaan", "ShareChat", "Dream11", "Delhivery", "InMobi", "PhonePe", "PolicyBazaar", "Nykaa", "Lenskart", "BigBasket", "Urban Company",
  // Global Tech
  "IBM", "Oracle", "SAP", "Salesforce", "Adobe", "VMware", "Cisco", "Intel", "AMD", "NVIDIA", "Qualcomm", "Broadcom", "Dell", "HP", "Lenovo", "Asus", "Samsung", "LG", "Sony", "Panasonic",
  // Banks & Financial
  "JPMorgan Chase", "Goldman Sachs", "Morgan Stanley", "Barclays", "HSBC", "Citibank", "Deutsche Bank", "ICICI Bank", "HDFC Bank", "Axis Bank", "SBI", "Kotak Mahindra Bank", "IndusInd Bank", "Yes Bank",
  // Other Global
  "Unilever", "Procter & Gamble", "Nestle", "PepsiCo", "Coca-Cola", "Johnson & Johnson", "Siemens", "GE", "Schneider Electric", "Philips", "Bosch", "Honeywell", "Shell", "ExxonMobil", "Chevron", "BP", "TotalEnergies",
  // Indian Conglomerates
  "Reliance Industries", "Adani Group", "Tata Group", "Mahindra Group", "Godrej Group", "Larsen & Toubro", "JSW Group", "Vedanta Resources", "Bajaj Group", "Hinduja Group",
  // Architectural Companies (Global)
  "Foster + Partners", "Gensler", "Zaha Hadid Architects", "SOM (Skidmore, Owings & Merrill)", "AECOM", "Perkins and Will", "HOK", "HDR", "Kohn Pedersen Fox (KPF)", "BIG (Bjarke Ingels Group)", "Snøhetta", "Buro Happold", "Arup", "Populous", "NBBJ", "Woods Bagot", "CallisonRTKL", "DLR Group", "HKS Architects", "CannonDesign", "Stantec",
  // Architectural Companies (India)
  "CP Kukreja Architects", "Hafeez Contractor", "Morphogenesis", "Sanjay Puri Architects", "Vastu Shilpa Consultants", "Edifice Consultants", "RSP Design Consultants", "C&T Architects", "Kembhavi Architecture Foundation", "Sikka Associates Architects", "Design Forum International", "Somaya & Kalappa Consultants", "Space Matrix", "Urban Frame Pvt Ltd", "Studio Lotus", "Architecture BRIO", "Hundredhands", "Mindspace Architects", "Genesis Planners", "DSP Design Associates",
  // Others
  "ISRO", "DRDO", "BHEL", "ONGC", "GAIL", "NTPC", "SAIL", "HAL", "BEL", "Indian Railways", "Air India", "IndiGo", "SpiceJet", "Vistara",
  // Add more as needed
  "Other"
];

const POSITION_LIST = [
  // Engineering
  "Software Engineer", "Senior Software Engineer", "Lead Software Engineer", "Principal Engineer", "Staff Engineer", "Engineering Manager", "VP of Engineering", "CTO", "Frontend Developer", "Backend Developer", "Full Stack Developer", "Mobile Developer", "iOS Developer", "Android Developer", "Embedded Engineer", "QA Engineer", "Test Engineer", "Automation Engineer", "DevOps Engineer", "Site Reliability Engineer", "System Administrator", "Network Engineer", "Cloud Engineer", "Data Engineer", "Data Scientist", "Machine Learning Engineer", "AI Engineer", "Research Scientist", "Product Engineer", "Security Engineer", "Blockchain Developer", "Game Developer",
  // Product & Project
  "Product Manager", "Associate Product Manager", "Senior Product Manager", "Group Product Manager", "Director of Product", "Project Manager", "Program Manager", "Scrum Master", "Agile Coach",
  // Design & UX
  "UI Designer", "UX Designer", "Product Designer", "Graphic Designer", "Visual Designer", "Interaction Designer", "Design Lead", "Head of Design",
  // Business & Analysis
  "Business Analyst", "Senior Business Analyst", "Data Analyst", "Financial Analyst", "Strategy Analyst", "Operations Analyst", "Management Consultant", "Strategy Consultant", "Associate Consultant", "Principal Consultant",
  // Sales & Marketing
  "Sales Executive", "Sales Manager", "Account Manager", "Key Account Manager", "Business Development Manager", "Marketing Executive", "Marketing Manager", "Digital Marketing Specialist", "Content Strategist", "SEO Specialist", "Growth Manager", "Customer Success Manager",
  // HR & Admin
  "HR Executive", "HR Manager", "Talent Acquisition Specialist", "Recruiter", "People Operations Manager", "Office Manager", "Admin Executive",
  // Finance
  "Finance Manager", "Chartered Accountant", "Controller", "Treasury Analyst", "Investment Banker", "Portfolio Manager", "Risk Analyst",
  // Legal
  "Legal Counsel", "Corporate Lawyer", "Compliance Officer", "Paralegal",
  // Architectural Positions
  "Architect", "Senior Architect", "Principal Architect", "Lead Architect", "Project Architect", "Design Architect", "Urban Planner", "Landscape Architect", "Interior Designer", "Architectural Drafter", "BIM Manager", "Architectural Technologist", "Site Architect", "Architectural Project Manager", "Architectural Visualizer", "Sustainability Consultant", "Heritage Conservation Architect", "Town Planner", "Urban Designer", "Architectural Intern",
  // Internships
  "Software Engineering Intern", "Product Intern", "Data Science Intern", "Business Analyst Intern", "Marketing Intern", "Design Intern", "HR Intern",
  // Others
  "Founder", "Co-Founder", "Director", "CEO", "COO", "CFO", "Board Member", "Advisor", "Teacher", "Professor", "Lecturer", "Researcher", "Scientist", "Other"
];

const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  experience,
  onChange,
}) => {
  const handleAdd = () => {
    onChange([
      ...experience,
      {
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        description: '',
        achievements: [],
      },
    ]);
  };

  const handleChange = (index: number, field: keyof Experience, value: any) => {
    const newExperience = [...experience];
    newExperience[index] = {
      ...newExperience[index],
      [field]: value,
    };
    onChange(newExperience);
  };

  const handleAchievementAdd = (index: number) => {
    const newExperience = [...experience];
    newExperience[index] = {
      ...newExperience[index],
      achievements: [...newExperience[index].achievements, ''],
    };
    onChange(newExperience);
  };

  const handleAchievementChange = (
    expIndex: number,
    achievementIndex: number,
    value: string
  ) => {
    const newExperience = [...experience];
    newExperience[expIndex].achievements[achievementIndex] = value;
    onChange(newExperience);
  };

  const handleAchievementRemove = (expIndex: number, achievementIndex: number) => {
    const newExperience = [...experience];
    newExperience[expIndex].achievements = newExperience[
      expIndex
    ].achievements.filter((_, i) => i !== achievementIndex);
    onChange(newExperience);
  };

  const handleRemove = (index: number) => {
    onChange(experience.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Work Experience</h2>
      <div className="space-y-6">
        {experience.map((exp, index) => (
          <div key={index} className="border border-gray-200 p-4 rounded-md">
            <div className="flex justify-end mb-2">
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Company
                </label>
                <select
                  value={exp.company}
                  onChange={(e) => handleChange(index, 'company', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                >
                  <option value="">Select company...</option>
                  {COMPANY_LIST.map((company) => (
                    <option key={company} value={company}>{company}</option>
                  ))}
                </select>
                {exp.company === 'Other' && (
                  <input
                    type="text"
                    placeholder="Enter company name"
                    value={exp.companyOther || ''}
                    onChange={(e) => handleChange(index, 'company', e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Position
                </label>
                <select
                  value={exp.position}
                  onChange={(e) => handleChange(index, 'position', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                >
                  <option value="">Select position...</option>
                  {POSITION_LIST.map((position) => (
                    <option key={position} value={position}>{position}</option>
                  ))}
                </select>
                {exp.position === 'Other' && (
                  <input
                    type="text"
                    placeholder="Enter position name"
                    value={exp.positionOther || ''}
                    onChange={(e) => handleChange(index, 'position', e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Start Date
                  </label>
                  <input
                    type="month"
                    value={exp.startDate}
                    onChange={(e) =>
                      handleChange(index, 'startDate', e.target.value)
                    }
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    End Date
                  </label>
                  <input
                    type="month"
                    value={exp.endDate}
                    onChange={(e) =>
                      handleChange(index, 'endDate', e.target.value)
                    }
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={exp.description}
                  onChange={(e) =>
                    handleChange(index, 'description', e.target.value)
                  }
                  rows={3}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Key Achievements
                </label>
                {exp.achievements.map((achievement, achievementIndex) => (
                  <div key={achievementIndex} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={achievement}
                      onChange={(e) =>
                        handleAchievementChange(
                          index,
                          achievementIndex,
                          e.target.value
                        )
                      }
                      className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="Enter an achievement"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        handleAchievementRemove(index, achievementIndex)
                      }
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAchievementAdd(index)}
                  className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Add Achievement
                </button>
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAdd}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Add Experience
        </button>
      </div>
    </div>
  );
};

export default ExperienceSection; 