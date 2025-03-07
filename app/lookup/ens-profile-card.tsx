'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, ExternalLink, Check, Twitter, Github, Mail, Globe, User } from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';

interface ENSRecord {
  key: string;
  value: string;
  type: string;
}

interface ENSProfile {
  name: string;
  address?: string;
  avatar?: string;
  records: ENSRecord[];
  contentHash?: string;
}

export default function ENSProfileCard({ profile }: { profile: ENSProfile }) {
  const [showAllRecords, setShowAllRecords] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [records, setRecords] = useState<ENSRecord[]>([]);
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    // Ensure records is always an array
    setRecords(Array.isArray(profile.records) ? profile.records : []);
  }, [profile.records]);
  
  // Helper function to format record values based on type
  const formatRecordValue = (record: ENSRecord) => {
    if (!record || !record.value) return null;
    
    if (record.key.includes('url') || record.key.includes('website') || record.key.includes('com.')) {
      // For Twitter, GitHub, etc., add the appropriate URL prefix if not present
      let url = record.value;
      
      if (record.key === 'com.twitter' && !url.startsWith('http')) {
        url = `https://twitter.com/${url}`;
      } else if (record.key === 'com.github' && !url.startsWith('http')) {
        url = `https://github.com/${url}`;
      } else if (!url.startsWith('http')) {
        url = `https://${url}`;
      }
      
      return (
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[#0052FF] hover:underline break-all flex items-center gap-1 group"
        >
          {record.value}
          <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
        </a>
      );
    }
    
    if (record.key.includes('email')) {
      return (
        <a 
          href={`mailto:${record.value}`} 
          className="text-[#0052FF] hover:underline break-all flex items-center gap-1 group"
        >
          {record.value}
          <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
        </a>
      );
    }
    
    return <span className="break-all">{record.value}</span>;
  };

  // Group records by category
  const contactRecords = records.filter(r => 
    r.key.includes('email') || 
    r.key.includes('phone') || 
    r.key.includes('telegram') || 
    r.key.includes('discord')
  );
  
  const socialRecords = records.filter(r => 
    r.key.includes('com.') || 
    r.key.includes('social') || 
    r.key.includes('twitter') || 
    r.key.includes('github')
  );
  
  const websiteRecords = records.filter(r => 
    r.key.includes('url') || 
    r.key.includes('website') || 
    r.key.includes('ipfs')
  );
  
  const descriptionRecord = records.find(r => r.key === 'description');
  
  const otherRecords = records.filter(r => 
    !contactRecords.includes(r) && 
    !socialRecords.includes(r) && 
    !websiteRecords.includes(r) &&
    r.key !== 'description'
  );

  const displayRecords = showAllRecords 
    ? [...contactRecords, ...socialRecords, ...websiteRecords, ...otherRecords]
    : [...contactRecords, ...socialRecords, ...websiteRecords].slice(0, 5);

  // Handle avatar display
  const renderAvatar = () => {
    if (!profile.avatar || avatarError) {
      // Get the first two letters of the name for the avatar placeholder
      const initials = profile.name.split('.')[0].substring(0, 2).toUpperCase();
      
      return (
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#0052FF] to-[#0052FF]/70 flex items-center justify-center text-white text-2xl font-bold">
          {initials}
        </div>
      );
    }

    // For IPFS avatars, try to use a gateway
    let avatarUrl = profile.avatar;
    if (avatarUrl.startsWith('ipfs://')) {
      avatarUrl = avatarUrl.replace('ipfs://', 'https://ipfs.io/ipfs/');
    }

    return (
      <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-[#121212] shadow-lg">
        <Image 
          src={avatarUrl} 
          alt={`${profile.name} avatar`} 
          fill
          className="object-cover"
          onError={() => setAvatarError(true)}
        />
      </div>
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to get icon for social record
  const getSocialIcon = (key: string) => {
    if (key.includes('twitter')) return <Twitter size={16} className="text-[#1DA1F2]" />;
    if (key.includes('github')) return <Github size={16} className="text-[#333] dark:text-[#f0f6fc]" />;
    if (key.includes('email')) return <Mail size={16} className="text-[#0052FF]" />;
    if (key.includes('url') || key.includes('website')) return <Globe size={16} className="text-[#0052FF]" />;
    return <User size={16} className="text-[#0052FF]" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-8"
    >
      <Card className="max-w-2xl mx-auto overflow-hidden rounded-2xl border-[#0052FF]/10 dark:border-[#0052FF]/20 shadow-md bg-white dark:bg-black/90">
        <div className="relative">
          {/* Background gradient header */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-[#0052FF] to-[#0052FF]/80 rounded-t-2xl"></div>
          
          <CardContent className="relative pt-16 pb-6">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <div className="z-10">
                {renderAvatar()}
              </div>
              
              <div className="flex-1 text-center md:text-left z-10">
                <h2 className="text-2xl font-bold mb-1">{profile.name}</h2>
                
                {descriptionRecord && (
                  <p className="text-[#393939]/80 dark:text-[#e0e0e0]/80 mb-3">{descriptionRecord.value}</p>
                )}
                
                {profile.address && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                      <Badge variant="outline" className="px-2 py-1 text-xs bg-[#f0f4ff] dark:bg-[#0a1836] text-[#0052FF] rounded-full">
                        Ethereum Address
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 px-2 text-[#393939]/70 dark:text-[#e0e0e0]/70 hover:text-[#0052FF] rounded-full"
                        onClick={() => copyToClipboard(profile.address || '')}
                      >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                      </Button>
                    </div>
                    <p className="font-mono text-sm break-all mt-1">{profile.address}</p>
                  </div>
                )}
              </div>
            </div>
            
            {records && records.length > 0 ? (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4 border-b border-[#0052FF]/10 dark:border-[#0052FF]/20 pb-2">Profile Records</h3>
                
                <div className="space-y-4">
                  {displayRecords.map((record, index) => (
                    <div key={index} className="flex items-start gap-3 p-2 hover:bg-[#f0f4ff]/50 dark:hover:bg-[#0a1836]/30 rounded-xl transition-colors">
                      <div className="mt-1">
                        {getSocialIcon(record.key)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-[#393939]/70 dark:text-[#e0e0e0]/70 mb-1">{record.key}</p>
                        <div className="font-medium">
                          {formatRecordValue(record)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {records.length > 5 && (
                  <Button 
                    variant="outline" 
                    className="mt-6 w-full rounded-xl border-[#0052FF]/20 hover:bg-[#f0f4ff] dark:hover:bg-[#0a1836] text-[#0052FF]"
                    onClick={() => setShowAllRecords(!showAllRecords)}
                  >
                    {showAllRecords ? 'Show Less' : `Show All Records (${records.length})`}
                  </Button>
                )}
              </div>
            ) : (
              <div className="mt-6 text-center text-[#393939]/70 dark:text-[#e0e0e0]/70">
                No records found for this ENS name
              </div>
            )}
            
            {profile.contentHash && (
              <div className="mt-6 p-4 bg-[#f0f4ff]/50 dark:bg-[#0a1836]/30 rounded-xl">
                <p className="text-sm text-[#393939]/70 dark:text-[#e0e0e0]/70 mb-1">Content Hash</p>
                <p className="font-mono text-xs break-all">{profile.contentHash}</p>
              </div>
            )}
          </CardContent>
        </div>
      </Card>
    </motion.div>
  );
} 