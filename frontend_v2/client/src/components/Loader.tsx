import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export const Loader: React.FC<LoaderProps> = ({ size = 'md', text }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  );
};

// Skeleton loader for cards
export const CardSkeleton: React.FC = () => (
  <div className="bg-card rounded-lg p-6 space-y-4 border border-border">
    <div className="h-6 bg-skeleton rounded w-3/4"></div>
    <div className="space-y-2">
      <div className="h-4 bg-skeleton rounded"></div>
      <div className="h-4 bg-skeleton rounded w-5/6"></div>
    </div>
    <div className="flex gap-2 pt-2">
      <div className="h-8 bg-skeleton rounded w-16"></div>
      <div className="h-8 bg-skeleton rounded w-16"></div>
    </div>
  </div>
);

// Skeleton loader for blog list
export const BlogListSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);

// Skeleton loader for blog detail
export const BlogDetailSkeleton: React.FC = () => (
  <div className="max-w-3xl mx-auto space-y-6">
    <div className="space-y-4">
      <div className="h-10 bg-skeleton rounded w-3/4"></div>
      <div className="flex gap-4">
        <div className="w-10 h-10 bg-skeleton rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-skeleton rounded w-1/4"></div>
          <div className="h-4 bg-skeleton rounded w-1/3"></div>
        </div>
      </div>
    </div>
    <div className="h-96 bg-skeleton rounded"></div>
    <div className="space-y-3">
      <div className="h-4 bg-skeleton rounded"></div>
      <div className="h-4 bg-skeleton rounded"></div>
      <div className="h-4 bg-skeleton rounded w-5/6"></div>
    </div>
  </div>
);
