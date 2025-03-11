'use client';

import { useState, useCallback, useEffect } from 'react';
import { LoadingSpinner } from '@/app/components/ui/loading-spinner';
import ENSProfileCard from './ens-profile-card';
import SearchForm from './search-form';
import SearchResultsList from './search-results-list';
import KeywordResultList from './keyword-result-list';
import { Card, CardContent } from '@/app/components/ui/card';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface SearchResultItem {
  name: string;
  displayName: string;
  avatar?: string | null;
  address?: string | null;
}

interface SearchCache {
  [query: string]: {
    results: SearchResultItem[];
    timestamp: number;
  };
}

// Define the ENSProfile interface
interface ENSProfile {
  name: string;
  address?: string;
  avatar?: string;
  records: Array<{
    key: string;
    value: string;
    type: string;
  }>;
  contentHash?: string;
  skills?: string[];
}

export default function LookupPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<ENSProfile | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [searchType, setSearchType] = useState<'name' | 'address' | 'keyword'>('name');
  const router = useRouter();
  
  // Cache search results for 5 minutes
  const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes in milliseconds
  const [searchCache, setSearchCache] = useState<SearchCache>({});

  // Handle full search (when form is submitted)
  const handleSearch = useCallback(async (query: string, type: 'name' | 'address' | 'keyword') => {
    setIsSearching(true);
    setError(null);
    setSelectedProfile(null);
    setSearchResults([]);
    setSearchQuery(query);
    setSearchType(type);
    
    try {
      // Add cache-busting query parameter
      const response = await fetch(`/api/ens/lookup?name=${encodeURIComponent(query)}&type=${type}&t=${Date.now()}`);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setSelectedProfile(data);
    } catch (err) {
      console.error('Error searching ENS:', err);
      setError(err instanceof Error ? err.message : 'Failed to search ENS profile');
      setSelectedProfile(null);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Handle real-time search (as user types)
  const handleSearchChange = useCallback(async (query: string, type: 'name' | 'address' | 'keyword') => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      setIsLoadingResults(false);
      return;
    }
    
    setIsLoadingResults(true);
    
    // Normalize the query for caching
    const normalizedQuery = `${query.toLowerCase()}-${type}`;
    
    // Check cache first
    const cachedData = searchCache[normalizedQuery];
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_EXPIRY) {
      console.log(`Using cached results for query: ${normalizedQuery}`);
      setSearchResults(cachedData.results);
      setIsLoadingResults(false);
    } else {
      try {
        // Add cache-busting query parameter
        const response = await fetch(`/api/ens/search?query=${encodeURIComponent(query)}&type=${type}&t=${Date.now()}`);
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        setSearchResults(data.results || []);
        
        // Cache the results
        setSearchCache(prev => ({
          ...prev,
          [normalizedQuery]: {
            results: data.results || [],
            timestamp: Date.now()
          }
        }));
      } catch (err) {
        console.error('Error searching ENS:', err);
        setSearchResults([]);
      } finally {
        setIsLoadingResults(false);
      }
    }
  }, [searchCache, CACHE_EXPIRY]);

  // Handle selecting a result from the search results list
  const handleSelectResult = useCallback(async (name: string) => {
    await handleSearch(name, 'name');
  }, [handleSearch]);

  // Function to force a refresh of the page
  const forceRefresh = useCallback(() => {
    // Clear any cached data
    router.refresh();
    // Clear the search cache
    setSearchCache({});
    // If there's a current search result, re-fetch it
    if (searchQuery) {
      handleSearch(searchQuery, searchType);
    }
  }, [router, searchQuery, searchType, handleSearch]);

  // Handle URL parameters for direct navigation
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const nameParam = urlParams.get('name');
    
    if (nameParam) {
      handleSearch(nameParam, 'name');
    }
  }, [handleSearch]);

  // Add handler for keyword clicks
  const handleKeywordClick = useCallback((keyword: string) => {
    setSearchQuery(keyword);
    handleSearch(keyword, 'keyword');
  }, [handleSearch]);

  return (
    <div className="container mx-auto px-4 py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h1 className="text-3xl font-bold mb-4 md:mb-0">Base.eth Directory</h1>
            <button 
              onClick={forceRefresh}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Refresh Data
            </button>
          </div>
          
          <Card className="rounded-2xl overflow-hidden shadow-md border-[#0052FF]/10 dark:border-[#0052FF]/20 bg-white dark:bg-black/90">
            <CardContent className="p-6">
              <SearchForm 
                onSearch={handleSearch} 
                onSearchChange={handleSearchChange}
                isSearching={isSearching} 
              />
              
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-red-50/50 dark:bg-red-900/10 text-red-600 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-800/30"
                >
                  {error}
                </motion.div>
              )}
              
              {isLoadingResults ? (
                <div className="flex justify-center my-4">
                  <LoadingSpinner size="sm" />
                </div>
              ) : searchResults.length > 0 && (
                searchType === 'keyword' ? (
                  <KeywordResultList 
                    results={searchResults} 
                    onSelectResult={handleSelectResult} 
                    query={searchQuery}
                  />
                ) : (
                  <SearchResultsList 
                    results={searchResults} 
                    onSelectResult={handleSelectResult} 
                    query={searchQuery}
                  />
                )
              )}
            </CardContent>
          </Card>

          {isSearching ? (
            <div className="flex justify-center my-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : selectedProfile ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ENSProfileCard 
                profile={selectedProfile} 
                onKeywordClick={handleKeywordClick} // Pass the handler here
              />
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