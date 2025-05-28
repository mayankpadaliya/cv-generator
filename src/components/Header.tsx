import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-primary-800">CV Generator</h1>
        <p className="mt-2 text-primary-600">
          Create a professional CV in minutes with our easy-to-use generator
        </p>
      </div>
    </header>
  );
};

export default Header; 