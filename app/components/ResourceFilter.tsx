'use client';

import { Search } from 'lucide-react';

interface ResourceFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onSearch: (query: string) => void;
}

export default function ResourceFilter({
  categories,
  selectedCategory,
  onCategoryChange,
  onSearch,
}: ResourceFilterProps) {
  return (
    <div className="sticky top-24 z-10 bg-white/80 dark:bg-black/50 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6 items-stretch md:items-center">
          {/* Search Bar */}
          <div className="relative md:w-1/3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search resources..."
                onChange={(e) => onSearch(e.target.value)}
                className="w-full px-4 py-3 pl-12 bg-white/50 dark:bg-gray-900/50 
                         border border-gray-200 dark:border-gray-800 rounded-2xl
                         focus:ring-2 focus:ring-[#0052FF] focus:border-transparent
                         dark:text-white placeholder-gray-500 dark:placeholder-gray-400
                         transition-all duration-200"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar md:flex-wrap md:flex-1 md:justify-start">
            <button
              onClick={() => onCategoryChange('all')}
              className={`px-4 py-2.5 rounded-xl transition-all duration-200 whitespace-nowrap text-sm font-medium
                       ${selectedCategory === 'all'
                ? 'bg-[#0052FF] text-white shadow-lg shadow-blue-500/20'
                : 'bg-white/50 dark:bg-gray-900/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-800'
                }`}
            >
              All Resources
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={`px-4 py-2.5 rounded-xl transition-all duration-200 whitespace-nowrap text-sm font-medium
                         ${selectedCategory === category
                    ? 'bg-[#0052FF] text-white shadow-lg shadow-blue-500/20'
                    : 'bg-white/50 dark:bg-gray-900/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-800'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 
