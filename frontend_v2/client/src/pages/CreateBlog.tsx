import React, { useState, useRef } from 'react';
import { useLocation } from 'wouter';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Eye, Code, Save, Send, ImagePlus, X, Sparkles, TrendingUp, BookOpen, Search, ShieldAlert, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { blogAPI, uploadAPI } from '@/services/api';

export default function CreateBlog() {
  const [, navigate] = useLocation();
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isFactChecking, setIsFactChecking] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [factCheckResult, setFactCheckResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
      toast.error('Invalid file type. Allowed: jpg, png, gif, webp');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB');
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const submitBlog = async (status: 'draft' | 'published') => {
    let imageUrl = '';
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
    await blogAPI.createBlog({ title, content, tags, status, image_url: imageUrl });
  };

  const handleSaveDraft = async () => {
    if (!title.trim()) { toast.error('Please enter a title'); return; }
    setIsSubmitting(true);
    try {
      await submitBlog('draft');
      toast.success('Draft saved successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to save draft');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) { toast.error('Please fill in title and content'); return; }
    
    // Block publishing if flagged as fake news
    if (factCheckResult?.is_fake_news) {
      toast.error('❌ Cannot publish: Content flagged as fake news. Please review and edit.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await submitBlog('published');
      toast.success('Blog published successfully!');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to publish blog');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAnalyzeContent = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error('Please enter title and content to analyze');
      return;
    }
    setIsAnalyzing(true);
    try {
      const res = await blogAPI.analyzeContent(title, content);
      setAiAnalysis(res.data.analysis);
      toast.success('AI analysis completed!');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFactCheck = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error('Please enter title and content to fact-check');
      return;
    }
    setIsFactChecking(true);
    try {
      const res = await blogAPI.factCheckContent(title, content);
      setFactCheckResult(res.data.fact_check);
      if (res.data.fact_check.is_fake_news) {
        toast.error('⚠️ Content flagged as potential fake news!');
      } else if (res.data.fact_check.credibility_score < 60) {
        toast.warning('⚠️ Content has credibility concerns');
      } else {
        toast.success('✓ Content appears credible');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Fact-check failed');
    } finally {
      setIsFactChecking(false);
    }
  };

  const wordCount = content.split(/\s+/).filter((w) => w.length > 0).length;
  const readTime = Math.ceil(wordCount / 200);
  const isBusy = isSubmitting || isUploadingImage;

  return (
    <div className="min-h-screen bg-background flex">
      <Navbar />
      <main className="flex-1 md:ml-20 pt-16 md:pt-0">
        <div className="container py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Write a New Story</h1>
            <p className="text-muted-foreground">Share your ideas and insights with the community</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Editor */}
            <div className="lg:col-span-2 space-y-6">
              {/* Cover image */}
              <div className="space-y-2">
                <Label>Cover Image</Label>
                {imagePreview ? (
                  <div className="relative rounded-lg overflow-hidden border border-border">
                    <img src={imagePreview} alt="Cover preview" className="w-full h-56 object-cover" />
                    <button
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 transition-colors"
                    >
                      <X className="w-4 h-4" />
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

              {/* Excerpt */}
              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Input
                  id="excerpt"
                  placeholder="Brief summary of your blog..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  maxLength={160}
                />
                <p className="text-xs text-muted-foreground">{excerpt.length}/160 characters</p>
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
                      {imagePreview && (
                        <img src={imagePreview} alt="Cover" className="w-full h-48 object-cover rounded-lg mb-6" />
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
                  placeholder="Enter tags separated by commas (e.g., AI, JavaScript, Web Dev)"
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
                  <label className="text-sm font-medium">Publish immediately</label>
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
                  <Button className="w-full gap-2" onClick={handlePublish} disabled={isBusy}>
                    <Send className="w-4 h-4" />
                    {isBusy ? 'Please wait...' : 'Publish'}
                  </Button>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold text-sm text-blue-900 dark:text-blue-100">Writing Tips</p>
                    <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                      <li>• Use clear, descriptive titles</li>
                      <li>• Add a cover image to attract readers</li>
                      <li>• Write a compelling excerpt</li>
                      <li>• Use relevant tags</li>
                      <li>• Keep paragraphs short</li>
                    </ul>
                  </div>
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

              {/* AI Review Section */}
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 border border-purple-200 dark:border-purple-800 rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <p className="text-sm font-semibold text-purple-900 dark:text-purple-100">AI Content Review</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleAnalyzeContent}
                    disabled={isAnalyzing || !title.trim() || !content.trim()}
                    className="gap-2 border-purple-300 dark:border-purple-700"
                  >
                    <Sparkles className="w-3 h-3" />
                    {isAnalyzing ? 'Analyzing...' : 'Analyze'}
                  </Button>
                </div>

                {aiAnalysis ? (
                  <div className="space-y-3">
                    {/* Scores */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-white/50 dark:bg-black/20 rounded-lg p-3 space-y-1">
                        <div className="flex items-center gap-1 text-xs text-purple-700 dark:text-purple-300">
                          <TrendingUp className="w-3 h-3" />
                          <span>Quality</span>
                        </div>
                        <p className="text-lg font-bold text-purple-900 dark:text-purple-100">{aiAnalysis.quality_score}/100</p>
                      </div>
                      <div className="bg-white/50 dark:bg-black/20 rounded-lg p-3 space-y-1">
                        <div className="flex items-center gap-1 text-xs text-blue-700 dark:text-blue-300">
                          <BookOpen className="w-3 h-3" />
                          <span>Readability</span>
                        </div>
                        <p className="text-lg font-bold text-blue-900 dark:text-blue-100">{aiAnalysis.readability_score}/100</p>
                      </div>
                    </div>

                    {/* Grammar Feedback */}
                    {aiAnalysis.grammar_feedback && (
                      <div className="bg-white/50 dark:bg-black/20 rounded-lg p-3 space-y-1">
                        <p className="text-xs font-medium text-purple-900 dark:text-purple-100">Grammar</p>
                        <p className="text-xs text-purple-800 dark:text-purple-200 whitespace-pre-wrap">{aiAnalysis.grammar_feedback}</p>
                      </div>
                    )}

                    {/* SEO Feedback */}
                    {aiAnalysis.seo_feedback && (
                      <div className="bg-white/50 dark:bg-black/20 rounded-lg p-3 space-y-1">
                        <div className="flex items-center gap-1">
                          <Search className="w-3 h-3 text-purple-700 dark:text-purple-300" />
                          <p className="text-xs font-medium text-purple-900 dark:text-purple-100">SEO</p>
                        </div>
                        <p className="text-xs text-purple-800 dark:text-purple-200 whitespace-pre-wrap">{aiAnalysis.seo_feedback}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-purple-700 dark:text-purple-300 text-center py-2">
                    Click "Analyze" to get AI-powered insights on your content
                  </p>
                )}
              </div>

              {/* Fact-Check Section */}
              <div className={`border rounded-lg p-4 space-y-4 ${
                factCheckResult?.is_fake_news 
                  ? 'bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950 border-red-300 dark:border-red-800'
                  : factCheckResult?.credibility_score < 60
                  ? 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 border-yellow-300 dark:border-yellow-800'
                  : 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200 dark:border-green-800'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {factCheckResult?.is_fake_news ? (
                      <ShieldAlert className="w-5 h-5 text-red-600 dark:text-red-400" />
                    ) : (
                      <ShieldCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
                    )}
                    <p className={`text-sm font-semibold ${
                      factCheckResult?.is_fake_news 
                        ? 'text-red-900 dark:text-red-100'
                        : 'text-green-900 dark:text-green-100'
                    }`}>Fact-Check</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleFactCheck}
                    disabled={isFactChecking || !title.trim() || !content.trim()}
                    className={`gap-2 ${
                      factCheckResult?.is_fake_news
                        ? 'border-red-300 dark:border-red-700'
                        : 'border-green-300 dark:border-green-700'
                    }`}
                  >
                    <ShieldCheck className="w-3 h-3" />
                    {isFactChecking ? 'Checking...' : 'Check'}
                  </Button>
                </div>

                {factCheckResult ? (
                  <div className="space-y-3">
                    {/* Credibility Score */}
                    <div className="bg-white/50 dark:bg-black/20 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs font-medium ${
                          factCheckResult.is_fake_news
                            ? 'text-red-900 dark:text-red-100'
                            : factCheckResult.credibility_score < 60
                            ? 'text-yellow-900 dark:text-yellow-100'
                            : 'text-green-900 dark:text-green-100'
                        }`}>Credibility Score</span>
                        <span className={`text-lg font-bold ${
                          factCheckResult.is_fake_news
                            ? 'text-red-900 dark:text-red-100'
                            : factCheckResult.credibility_score < 60
                            ? 'text-yellow-900 dark:text-yellow-100'
                            : 'text-green-900 dark:text-green-100'
                        }`}>{factCheckResult.credibility_score}/100</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            factCheckResult.is_fake_news
                              ? 'bg-red-600'
                              : factCheckResult.credibility_score < 60
                              ? 'bg-yellow-600'
                              : 'bg-green-600'
                          }`}
                          style={{ width: `${factCheckResult.credibility_score}%` }}
                        />
                      </div>
                    </div>

                    {/* Status Badge */}
                    {factCheckResult.is_fake_news && (
                      <div className="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg p-3">
                        <p className="text-xs font-bold text-red-900 dark:text-red-100 flex items-center gap-2">
                          <ShieldAlert className="w-4 h-4" />
                          ⚠️ FAKE NEWS DETECTED - CANNOT PUBLISH
                        </p>
                      </div>
                    )}

                    {/* Feedback */}
                    {factCheckResult.fact_check_feedback && (
                      <div className="bg-white/50 dark:bg-black/20 rounded-lg p-3 space-y-1">
                        <p className={`text-xs font-medium ${
                          factCheckResult.is_fake_news
                            ? 'text-red-900 dark:text-red-100'
                            : 'text-green-900 dark:text-green-100'
                        }`}>Analysis</p>
                        <p className={`text-xs whitespace-pre-wrap ${
                          factCheckResult.is_fake_news
                            ? 'text-red-800 dark:text-red-200'
                            : 'text-green-800 dark:text-green-200'
                        }`}>{factCheckResult.fact_check_feedback}</p>
                      </div>
                    )}

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-white/50 dark:bg-black/20 rounded-lg p-2 text-center">
                        <p className="text-xs text-red-700 dark:text-red-300">Red Flags</p>
                        <p className="text-lg font-bold text-red-900 dark:text-red-100">{factCheckResult.flags_count || 0}</p>
                      </div>
                      <div className="bg-white/50 dark:bg-black/20 rounded-lg p-2 text-center">
                        <p className="text-xs text-yellow-700 dark:text-yellow-300">Warnings</p>
                        <p className="text-lg font-bold text-yellow-900 dark:text-yellow-100">{factCheckResult.warnings_count || 0}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-green-700 dark:text-green-300 text-center py-2">
                    Click "Check" to verify content credibility and detect fake news
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
