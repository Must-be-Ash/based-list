'use client';

import { FC } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface SearchResultItem {
  name: string;
  displayName: string;
  avatar?: string | null;
  address?: string | null;
}

interface KeywordResultListProps {
  results: SearchResultItem[];
  onSelectResult: (name: string) => void;
  query: string;
}

const KeywordResultList: FC<KeywordResultListProps> = ({ results, onSelectResult, query }) => {
  if (results.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center p-4 text-[#393939]/70 dark:text-[#e0e0e0]/70"
      >
        <p>No results found for &quot;{query}&quot;</p>
      </motion.div>
    );
  }

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-4">Search Results for &quot;{query}&quot;</h3>
      <div className="space-y-4">
        {results.map((result, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-white dark:bg-black/90 rounded-xl shadow-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={() => onSelectResult(result.name)}
          >
            <div className="flex items-center gap-4">
              {result.avatar ? (
                <Image src={result.avatar} alt={result.displayName} className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-white text-xl font-bold">
                  {result.displayName.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h4 className="text-lg font-medium">{result.displayName}</h4>
                {result.address && <p className="text-sm text-gray-500">{result.address}</p>}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default KeywordResultList;