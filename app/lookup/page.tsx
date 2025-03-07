'use client';

import { useState } from 'react';
import { LoadingSpinner } from '@/app/components/ui/loading-spinner';
import ENSProfileCard from './ens-profile-card';
import SearchForm from './search-form';
import { Card, CardContent } from '@/app/components/ui/card';
import { motion } from 'framer-motion';

interface SearchResult {
  name: string;
  address?: string;
  avatar?: string;
  records: Array<{
    key: string;
    value: string;
    type: string;
  }>;
  contentHash?: string;
}

export default function LookupPage() {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string, type: 'name' | 'address') => {
    setIsSearching(true);
    setError(null);
    setSearchResult(null);
    
    try {
      // Format the query based on the search type
      const formattedQuery = query.toLowerCase().trim();
      
      // Call the API endpoint with the appropriate parameters
      const params = type === 'name' 
        ? `name=${encodeURIComponent(formattedQuery)}&type=name` 
        : `address=${encodeURIComponent(formattedQuery)}&type=address`;
      
      const response = await fetch(`/api/ens/lookup?${params}`);
      const data = await response.json();
      
      if (!response.ok) {
        // Handle specific error types
        if (data.error === 'SUBGRAPH_CONFIGURATION_ERROR') {
          throw new Error(
            'ENS data for base.eth domains is currently unavailable. ' +
            'This is a known issue that our team is working to resolve. ' +
            'Please try again later.'
          );
        } else if (data.error === 'DOMAIN_NOT_FOUND') {
          throw new Error(`Domain not found: ${type === 'name' ? formattedQuery + '.base.eth' : formattedQuery}`);
        } else if (data.error === 'ADDRESS_NOT_FOUND') {
          throw new Error(`No ENS name found for address: ${formattedQuery}`);
        } else {
          throw new Error(data.message || 'Failed to fetch ENS profile');
        }
      }
      
      setSearchResult(data);
    } catch (err) {
      console.error('Error searching ENS:', err);
      setError(err instanceof Error ? err.message : 'Failed to search ENS profile');
      setSearchResult(null);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Basenames Directory
            </h1>
            <p className="text-lg text-[#393939] dark:text-[#e0e0e0] max-w-2xl mx-auto">
              search for names and find their associated base.eth profiles
            </p>
          </div>
          
          <Card className="rounded-2xl overflow-hidden shadow-md border-[#0052FF]/10 dark:border-[#0052FF]/20 bg-white dark:bg-black/90">
            <CardContent className="p-6">
              <SearchForm onSearch={handleSearch} isSearching={isSearching} />
              
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-red-50/50 dark:bg-red-900/10 text-red-600 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-800/30"
                >
                  {error}
                </motion.div>
              )}
            </CardContent>
          </Card>

          {isSearching ? (
            <div className="flex justify-center my-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : searchResult ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ENSProfileCard profile={searchResult} />
            </motion.div>
          ) : (
            <div className="text-center my-12 text-[#393939]/70 dark:text-[#e0e0e0]/70">
              <p className="text-lg">Enter a name or address above to search for Base.eth profiles.</p>
              <p className="mt-2 text-sm">Examples: <span className="text-[#0052FF]">jesse</span>, <span className="text-[#0052FF]">mustbeash</span>, <span className="text-[#0052FF]">0x849151d7D0bF1F34b70d5caD5149D28CC2308bf1</span></p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
} 