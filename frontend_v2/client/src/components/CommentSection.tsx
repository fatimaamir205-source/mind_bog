import React, { useState } from 'react';
import { Heart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export interface Comment {
  id: string;
  author: {
    id: string;
    username: string;
    avatar?: string;
  };
  content: string;
  likes: number;
  isLiked: boolean;
  createdAt: string;
  canDelete: boolean;
}

interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (content: string) => void;
  onDeleteComment: (commentId: string) => void;
  onLikeComment: (commentId: string) => void;
  isLoading?: boolean;
  isAuthenticated: boolean;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  onAddComment,
  onDeleteComment,
  onLikeComment,
  isLoading = false,
  isAuthenticated,
}) => {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddComment(newComment);
      setNewComment('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours === 0) {
        const minutes = Math.floor(diff / (1000 * 60));
        return `${minutes}m ago`;
      }
      return `${hours}h ago`;
    }
    if (days === 1) return 'yesterday';
    if (days < 7) return `${days}d ago`;

    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold text-lg mb-4">Comments ({comments.length})</h3>

        {isAuthenticated ? (
          <form onSubmit={handleSubmit} className="mb-6 space-y-3">
            <Textarea
              placeholder="Share your thoughts..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
              disabled={isSubmitting}
            />
            <Button
              type="submit"
              disabled={!newComment.trim() || isSubmitting}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </Button>
          </form>
        ) : (
          <div className="bg-muted border border-border rounded-lg p-4 mb-6 text-center">
            <p className="text-sm text-muted-foreground mb-3">
              Sign in to leave a comment
            </p>
            <Button variant="outline" size="sm">
              Sign in
            </Button>
          </div>
        )}
      </div>

      {/* Comments list */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading comments...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No comments yet. Be the first!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-card border border-border rounded-lg p-4 space-y-3"
            >
              {/* Comment header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold flex-shrink-0">
                    {comment.author.avatar ? (
                      <img
                        src={comment.author.avatar}
                        alt={comment.author.username}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      comment.author.username.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{comment.author.username}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(comment.createdAt)}
                    </p>
                  </div>
                </div>
                {comment.canDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteComment(comment.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {/* Comment content */}
              <p className="text-sm leading-relaxed">{comment.content}</p>

              {/* Comment actions */}
              <div className="flex items-center gap-2 pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onLikeComment(comment.id)}
                  className={`gap-1 ${
                    comment.isLiked ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <Heart
                    className="w-4 h-4"
                    fill={comment.isLiked ? 'currentColor' : 'none'}
                  />
                  <span className="text-xs">{comment.likes}</span>
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
