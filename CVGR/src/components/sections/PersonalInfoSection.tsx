import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { PersonalInfo } from '../../types/cv';

interface PersonalInfoSectionProps {
  data: PersonalInfo;
  onChange: (data: PersonalInfo) => void;
}

// City option type
interface CityOption {
  label: string;
  value: string;
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  data,
  onChange,
}) => {
  const [cityOptions, setCityOptions] = useState<CityOption[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);

  useEffect(() => {
    setLoadingCities(true);
    fetch('/worldcities.min.json')
      .then((res) => res.json())
      .then((cities) => {
        const options = cities.map((city: any) => ({
          label: `${city.city}, ${city.country}${city.admin_name && city.admin_name !== city.city ? ' (' + city.admin_name + ')' : ''}`,
          value: `${city.city}, ${city.country}`,
        }));
        setCityOptions(options);
        setLoadingCities(false);
      })
      .catch(() => setLoadingCities(false));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    onChange({
      ...data,
      [name]: value,
    });
  };

  // Handle city select
  const handleCityChange = (option: CityOption | null) => {
    onChange({
      ...data,
      location: option ? option.value : '',
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700"
          >
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            value={data.firstName}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700"
          >
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            value={data.lastName}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={data.email}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700"
          >
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            id="phone"
            value={data.phone}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700"
          >
            Location
          </label>
          <Select
            inputId="location"
            name="location"
            options={cityOptions}
            isLoading={loadingCities}
            value={cityOptions.find((opt) => opt.value === data.location) || null}
            onChange={handleCityChange}
            placeholder="Select a city..."
            isClearable
            classNamePrefix="react-select"
          />
        </div>

        <div>
          <label
            htmlFor="linkedIn"
            className="block text-sm font-medium text-gray-700"
          >
            LinkedIn URL (Optional)
          </label>
          <input
            type="url"
            name="linkedIn"
            id="linkedIn"
            value={data.linkedIn || ''}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="https://linkedin.com/in/username"
          />
        </div>

        <div>
          <label
            htmlFor="website"
            className="block text-sm font-medium text-gray-700"
          >
            Personal Website (Optional)
          </label>
          <input
            type="url"
            name="website"
            id="website"
            value={data.website || ''}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="https://example.com"
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoSection; 