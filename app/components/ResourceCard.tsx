import Link from 'next/link';
import { FaExternalLinkAlt } from 'react-icons/fa';

interface ResourceCardProps {
  title: string;
  description: string;
  link: string;
}

export default function ResourceCard({ title, description, link }: ResourceCardProps) {
  return (
    <Link 
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-6 bg-white/80 dark:bg-black/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300 border-0 rounded-xl group"
    >
      <div className="flex justify-between items-start gap-4">
        <div>
          <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200 group-hover:text-[#0052FF] transition-colors">
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
            {description}
          </p>
        </div>
        <div className="text-[#0052FF] opacity-0 group-hover:opacity-100 transition-opacity">
          <FaExternalLinkAlt className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
} 