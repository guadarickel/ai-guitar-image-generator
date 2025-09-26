import React, { useState, FormEvent } from 'react';

interface AddGuitarFormProps {
  onAddGuitar: (guitar: { brand: string; model: string; description: string }) => void;
}

const AddGuitarForm: React.FC<AddGuitarFormProps> = ({ onAddGuitar }) => {
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!brand.trim() || !model.trim() || !description.trim()) {
      setError('Brand, Model/Category, and Description are required.');
      return;
    }
    setError(null);
    onAddGuitar({ brand, model, description });
    // Reset form fields
    setBrand('');
    setModel('');
    setType('');
    setDescription('');
  };

  const placeholderText = `A ${brand || '[Brand]'} ${model || '[Model]'} ${type || '[Type]'}. Add details like color, finish, and style for better results.`;

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold text-white mb-4">Add a New Guitar</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="brand" className="block text-sm font-medium text-gray-300">Brand</label>
            <input
              type="text"
              id="brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="e.g., Gibson"
              className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              aria-required="true"
            />
          </div>
          <div>
            <label htmlFor="model" className="block text-sm font-medium text-gray-300">Model / Category</label>
            <input
              type="text"
              id="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="e.g., Les Paul"
              className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              aria-required="true"
            />
          </div>
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-300">Type</label>
            <input
              type="text"
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="e.g., Electric Guitar"
              className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description for Image Generation</label>
          <textarea
            id="description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={placeholderText}
            className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            aria-required="true"
          />
           <p className="mt-2 text-xs text-gray-500">This text is sent to the AI to generate images. Be descriptive for the best results!</p>
        </div>

        {error && (
            <p className="text-sm text-red-400" role="alert">{error}</p>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
          >
            Add Guitar Card
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddGuitarForm;