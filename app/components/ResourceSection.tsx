interface ResourceSectionProps {
  title: string;
  children: React.ReactNode;
}

export default function ResourceSection({ title, children }: ResourceSectionProps) {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200 flex items-center gap-2">
        {title}
        <div className="h-1 w-1 rounded-full bg-[#0052FF]" />
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {children}
      </div>
    </div>
  );
} 