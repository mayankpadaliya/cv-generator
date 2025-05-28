import React from 'react';
import { Education } from '../../types/cv';

interface EducationSectionProps {
  education: Education[];
  onChange: (education: Education[]) => void;
}

const INSTITUTE_LIST = [
  // IITs
  "Indian Institute of Technology (IIT) Bombay",
  "Indian Institute of Technology (IIT) Delhi",
  "Indian Institute of Technology (IIT) Kanpur",
  "Indian Institute of Technology (IIT) Kharagpur",
  "Indian Institute of Technology (IIT) Madras",
  "Indian Institute of Technology (IIT) Roorkee",
  "Indian Institute of Technology (IIT) Guwahati",
  "Indian Institute of Technology (IIT) Hyderabad",
  "Indian Institute of Technology (IIT) Indore",
  "Indian Institute of Technology (IIT) Varanasi (BHU)",
  "Indian Institute of Technology (IIT) Bhubaneswar",
  "Indian Institute of Technology (IIT) Gandhinagar",
  "Indian Institute of Technology (IIT) Jodhpur",
  "Indian Institute of Technology (IIT) Mandi",
  "Indian Institute of Technology (IIT) Patna",
  "Indian Institute of Technology (IIT) Ropar",
  "Indian Institute of Technology (IIT) Palakkad",
  "Indian Institute of Technology (IIT) Tirupati",
  "Indian Institute of Technology (IIT) Dhanbad (ISM)",
  // NITs
  "National Institute of Technology (NIT) Trichy",
  "National Institute of Technology (NIT) Surathkal",
  "National Institute of Technology (NIT) Warangal",
  "National Institute of Technology (NIT) Calicut",
  "National Institute of Technology (NIT) Rourkela",
  "National Institute of Technology (NIT) Kurukshetra",
  "National Institute of Technology (NIT) Durgapur",
  "National Institute of Technology (NIT) Allahabad",
  "National Institute of Technology (NIT) Jaipur",
  "National Institute of Technology (NIT) Jalandhar",
  "National Institute of Technology (NIT) Patna",
  "National Institute of Technology (NIT) Raipur",
  "National Institute of Technology (NIT) Silchar",
  "National Institute of Technology (NIT) Srinagar",
  "National Institute of Technology (NIT) Agartala",
  "National Institute of Technology (NIT) Goa",
  "National Institute of Technology (NIT) Arunachal Pradesh",
  "National Institute of Technology (NIT) Meghalaya",
  "National Institute of Technology (NIT) Manipur",
  "National Institute of Technology (NIT) Mizoram",
  "National Institute of Technology (NIT) Nagaland",
  "National Institute of Technology (NIT) Puducherry",
  "National Institute of Technology (NIT) Sikkim",
  "National Institute of Technology (NIT) Uttarakhand",
  "National Institute of Technology (NIT) Delhi",
  // IISc and other top central institutions
  "Indian Institute of Science (IISc) Bangalore",
  "Indian Statistical Institute (ISI) Kolkata",
  "Indian Institute of Information Technology (IIIT) Allahabad",
  "Indian Institute of Information Technology (IIIT) Delhi",
  "Indian Institute of Information Technology (IIIT) Hyderabad",
  // Major central universities
  "University of Delhi",
  "Jawaharlal Nehru University (JNU)",
  "Banaras Hindu University (BHU)",
  "Aligarh Muslim University (AMU)",
  "Jamia Millia Islamia",
  "University of Hyderabad",
  // Top private/state universities
  "Birla Institute of Technology and Science (BITS) Pilani",
  "Birla Institute of Technology and Science (BITS) Goa",
  "Birla Institute of Technology and Science (BITS) Hyderabad",
  "Vellore Institute of Technology (VIT)",
  "Manipal Academy of Higher Education",
  "SRM Institute of Science and Technology",
  "Amity University",
  "Symbiosis International University",
  "Christ University",
  "Jadavpur University",
  "Savitribai Phule Pune University",
  "Anna University",
  "Osmania University",
  "University of Calcutta",
  "University of Mumbai",
  "Gujarat Technological University",
  "Parul University",
  // World-renowned institutions
  "Massachusetts Institute of Technology (MIT)",
  "Stanford University",
  "Harvard University",
  "California Institute of Technology (Caltech)",
  "University of Oxford",
  "University of Cambridge",
  "ETH Zurich",
  "Imperial College London",
  "University College London (UCL)",
  "University of Chicago",
  "Princeton University",
  "Yale University",
  "Columbia University",
  "University of California, Berkeley",
  "University of California, Los Angeles (UCLA)",
  "University of Toronto",
  "University of Melbourne",
  "National University of Singapore (NUS)",
  "Nanyang Technological University (NTU)",
  "Tsinghua University",
  "Peking University",
  "University of Tokyo",
  "Seoul National University",
  "University of Hong Kong",
  "University of Sydney",
  "University of New South Wales (UNSW)",
  "University of Edinburgh",
  "University of Manchester",
  "King's College London",
  "Australian National University",
  "McGill University",
  "University of British Columbia",
  "University of Pennsylvania",
  "Johns Hopkins University",
  "Duke University",
  "Cornell University",
  "Northwestern University",
  "University of Michigan",
  "Carnegie Mellon University",
  "New York University (NYU)",
  "University of California, San Diego (UCSD)",
  "University of Washington",
  "London School of Economics (LSE)",
  "University of Amsterdam",
  "Technical University of Munich",
  "Heidelberg University",
  "Sorbonne University",
  "École Polytechnique Fédérale de Lausanne (EPFL)",
  "KU Leuven",
  "University of Copenhagen",
  "Lomonosov Moscow State University",
  "University of Auckland",
  "University of Cape Town",
  "Instituto Superior Técnico",
  "Wroclaw University of Science and Technology",
  "Bright Day School Vadodara",
  // Add more as needed
  "Other"
];

const DEGREE_LIST = [
  // Indian undergraduate degrees
  "Bachelor of Technology (B.Tech)",
  "Bachelor of Engineering (B.E.)",
  "Bachelor of Science (B.Sc)",
  "Bachelor of Commerce (B.Com)",
  "Bachelor of Arts (B.A)",
  "Bachelor of Business Administration (BBA)",
  "Bachelor of Computer Applications (BCA)",
  "Bachelor of Architecture (B.Arch)",
  "Bachelor of Design (B.Des)",
  "Bachelor of Pharmacy (B.Pharm)",
  "Bachelor of Education (B.Ed)",
  "Bachelor of Laws (LLB)",
  "Bachelor of Dental Surgery (BDS)",
  "Bachelor of Medicine, Bachelor of Surgery (MBBS)",
  "Bachelor of Veterinary Science (B.VSc)",
  "Bachelor of Physiotherapy (BPT)",
  "Bachelor of Fine Arts (BFA)",
  // Indian postgraduate degrees
  "Master of Technology (M.Tech)",
  "Master of Engineering (M.E.)",
  "Master of Science (M.Sc)",
  "Master of Commerce (M.Com)",
  "Master of Arts (M.A)",
  "Master of Business Administration (MBA)",
  "Master of Computer Applications (MCA)",
  "Master of Architecture (M.Arch)",
  "Master of Design (M.Des)",
  "Master of Pharmacy (M.Pharm)",
  "Master of Education (M.Ed)",
  "Master of Laws (LLM)",
  "Master of Dental Surgery (MDS)",
  "Doctor of Medicine (MD)",
  "Master of Surgery (MS)",
  "Master of Public Health (MPH)",
  // Indian research degrees
  "Doctor of Philosophy (PhD)",
  "Doctor of Science (DSc)",
  // International undergraduate degrees
  "Bachelor of Science (BSc)",
  "Bachelor of Arts (BA)",
  "Bachelor of Business Administration (BBA)",
  "Bachelor of Commerce (BCom)",
  "Bachelor of Laws (LLB)",
  "Bachelor of Fine Arts (BFA)",
  "Bachelor of Social Work (BSW)",
  "Bachelor of Education (BEd)",
  "Bachelor of Engineering (BEng)",
  "Bachelor of Medicine, Bachelor of Surgery (MBBS)",
  "Bachelor of Dental Surgery (BDS)",
  "Bachelor of Pharmacy (BPharm)",
  "Bachelor of Computer Science (BCS)",
  // International postgraduate degrees
  "Master of Science (MSc)",
  "Master of Arts (MA)",
  "Master of Business Administration (MBA)",
  "Master of Commerce (MCom)",
  "Master of Laws (LLM)",
  "Master of Fine Arts (MFA)",
  "Master of Social Work (MSW)",
  "Master of Education (MEd)",
  "Master of Engineering (MEng)",
  "Master of Public Health (MPH)",
  "Master of Computer Science (MCS)",
  // International research degrees
  "Doctor of Philosophy (PhD)",
  "Doctor of Science (DSc)",
  "Doctor of Education (EdD)",
  "Doctor of Medicine (MD)",
  // Professional degrees
  "Chartered Accountant (CA)",
  "Company Secretary (CS)",
  "Cost and Management Accountant (CMA)",
  "Certified Public Accountant (CPA)",
  "Juris Doctor (JD)",
  // Add more as needed
  "Other"
];

const FIELD_OF_STUDY_LIST = [
  // Humanities
  "Art History",
  "Classics",
  "Comparative Literature",
  "Creative Writing",
  "Cultural Studies",
  "Dance",
  "Drama/Theater",
  "English Literature",
  "Film Studies",
  "Fine Arts",
  "History",
  "Languages",
  "Linguistics",
  "Literature",
  "Music",
  "Musicology",
  "Philosophy",
  "Religious Studies",
  "Theology",
  "Visual Arts",
  // Social Sciences
  "Anthropology",
  "Archaeology",
  "Communication Studies",
  "Criminology",
  "Demography",
  "Development Studies",
  "Economics",
  "Education",
  "Geography",
  "International Relations",
  "Journalism",
  "Law",
  "Library Science",
  "Media Studies",
  "Political Science",
  "Psychology",
  "Public Administration",
  "Public Policy",
  "Social Work",
  "Sociology",
  "Urban Studies",
  // Natural Sciences
  "Astronomy",
  "Biochemistry",
  "Biology",
  "Biophysics",
  "Botany",
  "Chemistry",
  "Earth Science",
  "Ecology",
  "Environmental Science",
  "Forensic Science",
  "Genetics",
  "Geology",
  "Marine Science",
  "Materials Science",
  "Mathematics",
  "Meteorology",
  "Microbiology",
  "Molecular Biology",
  "Neuroscience",
  "Oceanography",
  "Paleontology",
  "Physics",
  "Physiology",
  "Statistics",
  "Zoology",
  // Formal Sciences
  "Actuarial Science",
  "Algorithms",
  "Artificial Intelligence",
  "Computational Biology",
  "Computer Science",
  "Cryptography",
  "Data Science",
  "Game Theory",
  "Information Science",
  "Logic",
  "Mathematical Physics",
  "Operations Research",
  "Pure Mathematics",
  "Quantum Computing",
  "Robotics",
  "Software Engineering",
  // Engineering & Technology
  "Aerospace Engineering",
  "Agricultural Engineering",
  "Architectural Engineering",
  "Automotive Engineering",
  "Bioengineering",
  "Biomedical Engineering",
  "Biotechnology",
  "Chemical Engineering",
  "Civil Engineering",
  "Computer Engineering",
  "Construction Management",
  "Control Systems Engineering",
  "Electrical Engineering",
  "Electronics Engineering",
  "Energy Engineering",
  "Engineering Physics",
  "Environmental Engineering",
  "Food Engineering",
  "Geotechnical Engineering",
  "Industrial Engineering",
  "Information Technology",
  "Instrumentation Engineering",
  "Manufacturing Engineering",
  "Marine Engineering",
  "Materials Engineering",
  "Mechanical Engineering",
  "Mechatronics",
  "Metallurgical Engineering",
  "Mining Engineering",
  "Nanotechnology",
  "Nuclear Engineering",
  "Ocean Engineering",
  "Optical Engineering",
  "Petroleum Engineering",
  "Polymer Engineering",
  "Production Engineering",
  "Structural Engineering",
  "Systems Engineering",
  "Telecommunications Engineering",
  "Textile Engineering",
  "Transportation Engineering",
  "Water Resources Engineering",
  // Health Sciences
  "Anatomy",
  "Anesthesiology",
  "Audiology",
  "Biomedicine",
  "Cardiology",
  "Clinical Psychology",
  "Dentistry",
  "Dermatology",
  "Emergency Medicine",
  "Endocrinology",
  "Epidemiology",
  "Family Medicine",
  "Gastroenterology",
  "Genetics (Medical)",
  "Geriatrics",
  "Gynecology",
  "Health Administration",
  "Health Economics",
  "Health Informatics",
  "Immunology",
  "Internal Medicine",
  "Kinesiology",
  "Medical Imaging",
  "Medical Laboratory Science",
  "Medical Microbiology",
  "Medicine",
  "Nephrology",
  "Neurology",
  "Neurosurgery",
  "Nursing",
  "Nutrition",
  "Obstetrics",
  "Occupational Therapy",
  "Oncology",
  "Ophthalmology",
  "Optometry",
  "Orthopedics",
  "Osteopathy",
  "Otolaryngology",
  "Pathology",
  "Pediatrics",
  "Pharmacy",
  "Physical Therapy",
  "Physiology (Medical)",
  "Physiotherapy",
  "Plastic Surgery",
  "Podiatry",
  "Preventive Medicine",
  "Primary Care",
  "Psychiatry",
  "Public Health",
  "Radiology",
  "Rehabilitation Science",
  "Respiratory Therapy",
  "Rheumatology",
  "Speech-Language Pathology",
  "Sports Medicine",
  "Surgery",
  "Toxicology",
  "Urology",
  "Veterinary Medicine",
  // Agriculture & Environmental
  "Agricultural Economics",
  "Agricultural Science",
  "Agroecology",
  "Agrology",
  "Agronomy",
  "Animal Science",
  "Aquaculture",
  "Dairy Science",
  "Entomology",
  "Fisheries Science",
  "Food Science",
  "Forestry",
  "Horticulture",
  "Plant Science",
  "Soil Science",
  "Viticulture",
  "Water Management",
  "Zoology (Agricultural)",
  // Business & Management
  "Accounting",
  "Actuarial Science (Business)",
  "Advertising",
  "Banking",
  "Business Administration",
  "Business Analytics",
  "Business Communication",
  "Business Ethics",
  "Business Law",
  "Construction Management (Business)",
  "Decision Sciences",
  "E-Commerce",
  "Entrepreneurship",
  "Finance",
  "General Management",
  "Health Systems Management",
  "Hospitality Management",
  "Human Resources",
  "Insurance",
  "International Business",
  "Logistics/Supply Chain Management",
  "Management Information Systems",
  "Marketing",
  "MBA",
  "Nonprofit Management",
  "Operations Management",
  "Organizational Studies",
  "Production/Operations Management",
  "Project Management",
  "Public Policy & Administration",
  "Quantitative Analysis",
  "Real Estate",
  "Sport Management",
  "Statistics & Actuarial Science (Business)",
  "Technology & Information Management",
  // Education
  "Adult and Distance Education",
  "Art Education",
  "Audiology/Speech Pathology",
  "Childhood/Youth Education",
  "Curriculum/Instruction",
  "Early Childhood Education",
  "Educational Leadership",
  "Educational Psychology",
  "Educational Technology",
  "Elementary Education",
  "English Education",
  "ESL/ESOL/ELL",
  "Health & Human Performance",
  "Higher Education Administration",
  "Human Development",
  "Instructional Design/Technology",
  "Math Education",
  "Middle School Education",
  "Music Education",
  "Organization and Leadership",
  "Physical Education & Kinesiology",
  "Professional Development",
  "Reading/Developmental Education",
  "Rehabilitation Counseling/Psychology",
  "Science Education",
  "Secondary Education",
  "Social Foundations",
  "Special Education",
  "Sports Studies",
  "Teacher Education",
  "Urban Education",
  // Interdisciplinary & Other
  "Area Studies",
  "Cognitive Science",
  "Developmental Studies",
  "Disaster Management",
  "Ethnic Studies",
  "Family Studies",
  "Gender Studies",
  "Gerontology",
  "Human Ecology",
  "Human Services",
  "Interdisciplinary Studies",
  "Peace and Conflict Studies",
  "Recreation/Leisure Studies",
  "Women's Studies",
  // Add more as needed
  "Other"
];

const EducationSection: React.FC<EducationSectionProps> = ({
  education,
  onChange,
}) => {
  const handleAdd = () => {
    onChange([
      ...education,
      {
        institution: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        description: '',
      },
    ]);
  };

  const handleChange = (index: number, field: keyof Education, value: string) => {
    const newEducation = [...education];
    newEducation[index] = {
      ...newEducation[index],
      [field]: value,
    };
    onChange(newEducation);
  };

  const handleRemove = (index: number) => {
    onChange(education.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Education</h2>
      <div className="space-y-6">
        {education.map((edu, index) => (
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
                  Institution
                </label>
                <select
                  value={INSTITUTE_LIST.includes(edu.institution) ? edu.institution : "Other"}
                  onChange={e => {
                    const value = e.target.value;
                    if (value === "Other") {
                      handleChange(index, 'institution', edu.institution && !INSTITUTE_LIST.includes(edu.institution) ? edu.institution : "");
                    } else {
                      handleChange(index, 'institution', value);
                    }
                  }}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                >
                  {INSTITUTE_LIST.map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
                {(!INSTITUTE_LIST.includes(edu.institution) || edu.institution === "") && (
                  <input
                    type="text"
                    placeholder="Enter institution name"
                    value={edu.institution}
                    onChange={e => handleChange(index, 'institution', e.target.value)}
                    className="mt-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Degree
                </label>
                <select
                  value={DEGREE_LIST.includes(edu.degree) ? edu.degree : "Other"}
                  onChange={e => {
                    const value = e.target.value;
                    if (value === "Other") {
                      handleChange(index, 'degree', edu.degree && !DEGREE_LIST.includes(edu.degree) ? edu.degree : "");
                    } else {
                      handleChange(index, 'degree', value);
                    }
                  }}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                >
                  {DEGREE_LIST.map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
                {(!DEGREE_LIST.includes(edu.degree) || edu.degree === "") && (
                  <input
                    type="text"
                    placeholder="Enter degree name"
                    value={edu.degree}
                    onChange={e => handleChange(index, 'degree', e.target.value)}
                    className="mt-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Field of Study
                </label>
                <select
                  value={FIELD_OF_STUDY_LIST.includes(edu.field) ? edu.field : "Other"}
                  onChange={e => {
                    const value = e.target.value;
                    if (value === "Other") {
                      handleChange(index, 'field', edu.field && !FIELD_OF_STUDY_LIST.includes(edu.field) ? edu.field : "");
                    } else {
                      handleChange(index, 'field', value);
                    }
                  }}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                >
                  {FIELD_OF_STUDY_LIST.map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
                {(!FIELD_OF_STUDY_LIST.includes(edu.field) || edu.field === "") && (
                  <input
                    type="text"
                    placeholder="Enter field of study"
                    value={edu.field}
                    onChange={e => handleChange(index, 'field', e.target.value)}
                    className="mt-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
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
                    value={edu.startDate}
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
                    value={edu.endDate}
                    onChange={(e) =>
                      handleChange(index, 'endDate', e.target.value)
                    }
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Description (Optional)
                </label>
                <textarea
                  value={edu.description}
                  onChange={(e) =>
                    handleChange(index, 'description', e.target.value)
                  }
                  rows={3}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAdd}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Add Education
        </button>
      </div>
    </div>
  );
};

export default EducationSection; 