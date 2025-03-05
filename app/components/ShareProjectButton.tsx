'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Share } from 'lucide-react'
import { toast } from 'sonner'

interface ShareProjectButtonProps {
  projectId: string
  className?: string
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export function ShareProjectButton({
  projectId,
  className = '',
  size = 'default'
}: ShareProjectButtonProps) {
  const [isSharing, setIsSharing] = useState(false)

  const getProjectShareUrl = (projectId: string) => {
    return `${window.location.origin}/projects/${projectId}`;
  };

  const handleShare = async () => {
    if (isSharing) return;
    
    setIsSharing(true);
    try {
      const shareUrl = getProjectShareUrl(projectId);
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Project link copied to clipboard!');
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('Failed to copy link');
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <Button
      onClick={handleShare}
      variant="outline"
      size={size}
      className={`gap-1 rounded-xl shadow-sm hover:shadow hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all ${className}`}
      disabled={isSharing}
    >
      <Share className="w-4 h-4" />
      Share
    </Button>
  );
} 