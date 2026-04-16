import React from 'react';
import { Link } from 'wouter';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface BlogCardProps {
  id: string;
  title: string;
  excerpt: string;
  author: {
    id: string;
    username: string;
    avatar?: string;
  };
  date: string;
  likes: number;
  comments: number;
  tags: string[];
  isLiked?: boolean;
  image_url?: string;
  onLike?: () => void;
}

const resolveImage = (path?: string) =>
  !path ? null : path.startsWith('http') ? path : `http://localhost:5000${path}`;

export const BlogCard: React.FC<BlogCardProps> = ({
  id,
  title,
  excerpt,
  author,
  date,
  likes,
  comments,
  tags,
  isLiked = false,
  image_url,
  onLike,
}) => {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const coverImage = resolveImage(image_url);

  return (
    <Link href={`/blog/${id}`}>
      <a className="block">
        <article className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-md transition-all duration-200 hover:translate-y-[-2px] cursor-pointer">
          {/* Cover image thumbnail */}
          {coverImage && (
            <div className="w-full h-44 overflow-hidden">
              <img src={coverImage} alt={title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="p-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold flex-shrink-0">
                {author.avatar ? (
                  <img src={author.avatar} alt={author.username} className="w-full h-full rounded-full object-cover" />
                ) : (
                  author.username.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <p className="font-medium text-sm">{author.username}</p>
                <p className="text-xs text-muted-foreground">{formattedDate}</p>
              </div>
            </div>

            {/* Content */}
            <div className="mb-4">
              <h3 className="font-bold text-lg mb-2 line-clamp-2 hover:text-primary transition-colors">{title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{excerpt}</p>
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="inline-block px-2 py-1 bg-muted text-xs rounded text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                    #{tag}
                  </span>
                ))}
                {tags.length > 3 && (
                  <span className="inline-block px-2 py-1 text-xs text-muted-foreground">+{tags.length - 3}</span>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <button
                  onClick={(e) => { e.preventDefault(); onLike?.(); }}
                  className={`flex items-center gap-1 hover:text-primary transition-colors ${isLiked ? 'text-primary' : ''}`}
                >
                  <Heart className="w-4 h-4" fill={isLiked ? 'currentColor' : 'none'} />
                  <span>{likes}</span>
                </button>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>{comments}</span>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={(e) => e.preventDefault()} className="gap-1">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </article>
      </a>
    </Link>
  );
};
