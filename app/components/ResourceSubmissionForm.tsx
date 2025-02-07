'use client';

import { useState } from 'react';

interface ResourceSubmissionFormProps {
  onSubmit: (data: { title: string; description: string; link: string }) => Promise<void>;
  onClose: () => void;
}

export default function ResourceSubmissionForm({ onSubmit, onClose }: ResourceSubmissionFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setFormData({ title: '', description: '', link: '' });
      onClose();
    } catch (error) {
      console.error('Error submitting resource:', error);
      alert('Failed to submit resource. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Resource Name
        </label>
        <input
          type="text"
          id="title"
          required
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-[#0052FF] focus:border-[#0052FF] dark:bg-gray-700 dark:text-white"
          placeholder="Enter resource name"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description
        </label>
        <textarea
          id="description"
          required
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-[#0052FF] focus:border-[#0052FF] dark:bg-gray-700 dark:text-white"
          rows={3}
          placeholder="Enter resource description"
        />
      </div>

      <div>
        <label htmlFor="link" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          URL Link
        </label>
        <input
          type="url"
          id="link"
          required
          value={formData.link}
          onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-[#0052FF] focus:border-[#0052FF] dark:bg-gray-700 dark:text-white"
          placeholder="https://example.com"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-[#0052FF] hover:bg-[#0043CC] rounded-md disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Resource'}
        </button>
      </div>
    </form>
  );
} 