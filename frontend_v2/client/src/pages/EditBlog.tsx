import React, { useState, useEffect, useRef } from 'react';
import { useRoute, useLocation } from 'wouter';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, Code, Save, Send, ArrowLeft, ImagePlus, X } from 'lucide-react';
import { toast } from 'sonner';
import { blogAPI, uploadAPI } from '@/services/api';

// Resolve image URL — backend stores paths like /uploads/blogs/file.jpg
const resolveImage = (path: string) =>
  path?.startsWith('http') ? path : path ? `http://localhost:5000${path}` : null;

export default function EditBlog() {
  const [match, params] = useRoute('/edit/:id');
  const [, navigate] = useLocation();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // existing image from backend
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  // new file selected by user
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const blogId = params?.id;

  useEffect(() => {
    if (!blogId) return;
    blogAPI.getBlogById(blogId)
      .then((res) => {
        const b = res.data;
        setTitle(b.title || '');
        setContent(b.content || '');
        setTags(Array.isArray(b.tags) ? b.tags.join(', ') : b.tags || '');
        setIsPublished(b.status === 'published');
        if (b.image_url) setExistingImageUrl(resolveImage(b.image_url));
      })
      .catch(() => { toast.error('Failed to load blog'); navigate('/dashboard'); })
      .finally(() => setIsLoading(false));
  }, [blogId]);

  if (!match) return null;
  if (isLoading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-muted-foreground">Loading...</p>
    </div>
  );

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
      toast.error('Invalid file type. Allowed: jpg, png, gif, webp');
      return;
    }
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setExistingImageUrl(null);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setExistingImageUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const currentPreview = imagePreview || existingImageUrl;

  const submitBlog = async (status: 'draft' | 'published') => {
    let imageUrl: string | undefined;
    if (imageFile) {
      setIsUploadingImage(true);
      try {
        const res = await uploadAPI.uploadImage(imageFile, 'blogs');
        imageUrl = res.data.file_path;
      } catch {
        toast.error('Image upload failed');
        setIsUploadingImage(false);
        return;
      }
      setIsUploadingImage(false);
    }
    const payload: any = { title, content, tags, status };
    if (imageUrl !== undefined) payload.image_url = imageUrl;
    // if user removed image without replacing, clear it
    if (!imageFile && !existingImageUrl) payload.image_url = '';
    await blogAPI.updateBlog(blogId!, payload);
  };

  const handleSaveDraft = async () => {
    if (!title.trim()) { toast.error('Please enter a title'); return; }
    setIsSubmitting(true);
    try {
      await submitBlog('draft');
      toast.success('Draft saved successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to save draft');
    } finally { setIsSubmitting(false); }
  };

  const handleUpdate = async () => {
    if (!title.trim() || !content.trim()) { toast.error('Please fill in title and content'); return; }
    setIsSubmitting(true);
    try {
      await submitBlog(isPublished ? 'published' : 'draft');
      toast.success('Blog updated successfully!');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to update blog');
    } finally { setIsSubmitting(false); }
  };

  const wordCount = content.split(/\s+/).filter((w) => w.length > 0).length;
  const readTime = Math.ceil(wordCount / 200);
  const isBusy = isSubmitting || isUploadingImage;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container py-8">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')} className="mb-6 gap-2">
            <ArrowLeft className="w-4 h-4" />Back to Dashboard
          </Button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Edit Story</h1>
            <p className="text-muted-foreground">Update your blog post</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Editor */}
            <div className="lg:col-span-2 space-y-6">
              {/* Cover image */}
              <div className="space-y-2">
                <Label>Cover Image</Label>
                {currentPreview ? (
                  <div className="relative rounded-lg overflow-hidden border border-border">
                    <img src={currentPreview} alt="Cover preview" className="w-full h-56 object-cover" />
                    <button
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-2 right-2 bg-black/60 hover:bg-black/80 text-white text-xs px-3 py-1 rounded-full transition-colors"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-40 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                  >
                    <ImagePlus className="w-8 h-8" />
                    <span className="text-sm">Click to upload cover image</span>
                    <span className="text-xs">JPG, PNG, GIF, WEBP · max 5MB</span>
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  className="hidden"
                  onChange={handleImageSelect}
                />
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter your blog title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-lg"
                />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label>Content</Label>
                <Tabs defaultValue="write" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="write" className="gap-2">
                      <Code className="w-4 h-4" />Write
                    </TabsTrigger>
                    <TabsTrigger value="preview" className="gap-2">
                      <Eye className="w-4 h-4" />Preview
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="write" className="space-y-2">
                    <Textarea
                      placeholder="Write your blog content here..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={15}
                      className="font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground">{wordCount} words · {readTime} min read</p>
                  </TabsContent>
                  <TabsContent value="preview">
                    <div className="bg-card border border-border rounded-lg p-6 min-h-96">
                      {currentPreview && (
                        <img src={currentPreview} alt="Cover" className="w-full h-48 object-cover rounded-lg mb-6" />
                      )}
                      {content ? (
                        <p className="whitespace-pre-wrap">{content}</p>
                      ) : (
                        <p className="text-muted-foreground">Your preview will appear here...</p>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  placeholder="Enter tags separated by commas"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
                <div className="flex flex-wrap gap-2">
                  {tags.split(',').map((t) => t.trim()).filter(Boolean).map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-muted rounded-full text-sm">#{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <h3 className="font-bold">Publishing Options</h3>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Published</label>
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="rounded"
                  />
                </div>
                <div className="bg-muted p-3 rounded text-xs text-muted-foreground space-y-1">
                  <p><strong>Draft:</strong> Only you can see it</p>
                  <p><strong>Published:</strong> Visible to everyone</p>
                </div>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full gap-2" onClick={handleSaveDraft} disabled={isBusy}>
                    <Save className="w-4 h-4" />
                    {isUploadingImage ? 'Uploading image...' : 'Save Draft'}
                  </Button>
                  <Button className="w-full gap-2" onClick={handleUpdate} disabled={isBusy}>
                    <Send className="w-4 h-4" />
                    {isBusy ? 'Please wait...' : 'Update'}
                  </Button>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-4 space-y-3">
                <p className="text-sm font-medium">Stats</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Words:</span>
                    <span className="font-medium">{wordCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Read time:</span>
                    <span className="font-medium">{readTime} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Characters:</span>
                    <span className="font-medium">{content.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
