'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import { LoadingSpinner } from '@/app/components/ui/loading-spinner';
import { Search, User, Tag } from 'lucide-react';
import { motion } from 'framer-motion';

interface SearchFormProps {
  onSearch: (query: string, type: 'name' | 'address' | 'keyword') => Promise<void>;
  onSearchChange?: (query: string, type: 'name' | 'address' | 'keyword') => Promise<void>;
  isSearching: boolean;
}

export default function SearchForm({ onSearch, onSearchChange, isSearching }: SearchFormProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'name' | 'address' | 'keyword'>('name');
  const [error, setError] = useState<string | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastQueryRef = useRef<string>('');

  // Handle real-time search with debouncing
  useEffect(() => {
    if (!onSearchChange || !searchQuery || searchQuery.length < 2) return;
    
    // Skip if the query is the same as the last one we searched for
    if (searchQuery.toLowerCase() === lastQueryRef.current) return;
    
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Set a new timer
    debounceTimerRef.current = setTimeout(() => {
      if (searchType === 'name' || searchType === 'keyword') {
        const normalizedQuery = searchQuery.toLowerCase();
        lastQueryRef.current = normalizedQuery;
        onSearchChange(searchQuery, searchType);
      }
    }, 300); // 300ms debounce
    
    // Cleanup on unmount
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery, searchType, onSearchChange]);

  // Reset lastQuery when search type changes
  useEffect(() => {
    lastQueryRef.current = '';
  }, [searchType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setError('Please enter a name, address, or keyword to search');
      return;
    }

    setError(null);
    
    // If searching by name, validate the format
    if (searchType === 'name') {
      const formattedQuery = searchQuery.toLowerCase().trim();
      
      // If the name includes .eth but is not a base.eth subdomain, show an error
      if (formattedQuery.includes('.eth') && !formattedQuery.endsWith('.base.eth')) {
        setError('Please enter a valid base.eth subdomain (e.g., name.base.eth)');
        return;
      }
    }
    
    // If searching by address, validate the format
    if (searchType === 'address') {
      const isValidAddress = /^0x[a-fA-F0-9]{40}$/.test(searchQuery);
      if (!isValidAddress) {
        setError('Please enter a valid Ethereum address');
        return;
      }
    }
    
    try {
      await onSearch(searchQuery, searchType);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred during search');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="flex justify-center mb-4">
          <div className="inline-flex p-1 bg-[#f0f4ff] dark:bg-[#0a1836] rounded-xl">
            <button
              type="button"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                searchType === 'name'
                  ? 'bg-white dark:bg-[#0052FF]/20 shadow-sm text-[#0052FF]'
                  : 'text-[#393939] dark:text-[#e0e0e0] hover:text-[#0052FF] dark:hover:text-[#0052FF]'
              }`}
              onClick={() => {
                setSearchType('name');
                setError(null);
              }}
            >
              <div className="flex items-center gap-2">
                <Search size={16} />
                <span>Search by Name</span>
              </div>
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                searchType === 'address'
                  ? 'bg-white dark:bg-[#0052FF]/20 shadow-sm text-[#0052FF]'
                  : 'text-[#393939] dark:text-[#e0e0e0] hover:text-[#0052FF] dark:hover:text-[#0052FF]'
              }`}
              onClick={() => {
                setSearchType('address');
                setError(null);
              }}
            >
              <div className="flex items-center gap-2">
                <User size={16} />
                <span>Search by Address</span>
              </div>
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                searchType === 'keyword'
                  ? 'bg-white dark:bg-[#0052FF]/20 shadow-sm text-[#0052FF]'
                  : 'text-[#393939] dark:text-[#e0e0e0] hover:text-[#0052FF] dark:hover:text-[#0052FF]'
              }`}
              onClick={() => {
                setSearchType('keyword');
                setError(null);
              }}
            >
              <div className="flex items-center gap-2">
                <Tag size={16} />
                <span>Search by Skill</span>
              </div>
            </button>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="search" className="text-sm font-medium">
            {searchType === 'name' ? 'Enter Base.eth Name' : searchType === 'address' ? 'Enter Ethereum Address' : 'Enter Keyword'}
          </Label>
          <div className="relative">
            <Input
              id="search"
              placeholder={searchType === 'name' 
                ? "Enter a name (e.g., jesse, mustbeash)" 
                : searchType === 'address' 
                ? "Enter an Ethereum address (0x...)" 
                : "Enter a keyword (e.g., JavaScript, Solidity)"}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setError(null); // Clear error when input changes
              }}
              className="pl-10 pr-4 py-2 h-12 text-base rounded-xl"
              autoComplete="off"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0052FF]/60">
              {searchType === 'name' ? <Search size={18} /> : searchType === 'address' ? <User size={18} /> : <Tag size={18} />}
            </div>
          </div>
          
          {searchType === 'name' && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-[#393939]/70 dark:text-[#e0e0e0]/70 mt-1"
            >
              We&apos;ll search for <span className="font-mono text-[#0052FF]">[name].base.eth</span> profiles
            </motion.p>
          )}
        </div>
      </div>
      
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-red-50/50 dark:bg-red-900/10 text-red-600 dark:text-red-400 rounded-xl text-sm border border-red-200 dark:border-red-800/30"
        >
          {error}
        </motion.div>
      )}
      
      <Button 
        type="submit" 
        disabled={isSearching || searchType === 'keyword'} // Disable button for keyword search
        className={`w-full h-12 bg-[#0052FF] hover:bg-[#0052FF]/90 text-white rounded-xl ${searchType === 'keyword' ? 'hidden' : ''}`} // Hide button for keyword search
      >
        {isSearching ? (
          <div className="flex items-center gap-2">
            <LoadingSpinner size="sm" />
            <span>Searching...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 justify-center">
            <Search size={18} />
            <span>Search</span>
          </div>
        )}
      </Button>
    </form>
  );
}