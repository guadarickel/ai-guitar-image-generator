import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center mb-10">
      <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
        AI Guitar Image Generator
      </h1>
      <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
        Create stunning, high-quality product images for your guitar listings. Select a category below to generate unique visuals.
      </p>
    </header>
  );
};

export default Header;
