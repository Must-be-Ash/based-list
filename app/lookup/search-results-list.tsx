'use client';

import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import Image from 'next/image';

interface SearchResultItem {
  name: string;
  displayName: string;
  avatar?: string | null;
  address?: string | null;
}

interface SearchResultsListProps {
  results: SearchResultItem[];
  onSelectResult: (name: string) => void;
  query: string;
}

export default function SearchResultsList({ results, onSelectResult, query }: SearchResultsListProps) {
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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4"
    >
      <div className="text-sm text-[#393939]/70 dark:text-[#e0e0e0]/70 mb-2 px-2">
        Found {results.length} result{results.length !== 1 ? 's' : ''} for &quot;{query}&quot;
      </div>
      
      <div className="max-h-60 overflow-y-auto rounded-xl border border-[#0052FF]/10 dark:border-[#0052FF]/20 bg-white dark:bg-black/90">
        <ul className="divide-y divide-[#0052FF]/10 dark:divide-[#0052FF]/20">
          {results.map((result) => (
            <li key={result.name} className="hover:bg-[#f0f4ff]/50 dark:hover:bg-[#0a1836]/30 transition-colors">
              <Button
                variant="ghost"
                className="w-full justify-start p-3 rounded-none text-left"
                onClick={() => onSelectResult(result.name)}
              >
                <div className="flex items-center gap-3">
                  {result.avatar ? (
                    <div className="relative w-8 h-8 rounded-full overflow-hidden">
                      <Image 
                        src={result.avatar} 
                        alt={result.displayName} 
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#0052FF]/10 dark:bg-[#0052FF]/20 flex items-center justify-center text-[#0052FF]">
                      <User size={16} />
                    </div>
                  )}
                  <div>
                    <div className="font-medium">{result.displayName}</div>
                    <div className="text-xs text-[#393939]/60 dark:text-[#e0e0e0]/60">{result.name}</div>
                  </div>
                </div>
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}