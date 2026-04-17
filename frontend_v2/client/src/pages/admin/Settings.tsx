import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { adminAPI } from '@/services/api';

export default function Settings() {
  const [settings, setSettings] = useState({
    comments_enabled: 'true',
    require_approval: 'false',
    max_blog_size: '50000',
    auto_moderation: 'true',
    spam_threshold: '0.8',
    maintenance_mode: 'false',
    maintenance_message: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    adminAPI.getSettings()
      .then((res) => {
        if (res.data.settings) setSettings((prev) => ({ ...prev, ...res.data.settings }));
      })
      .catch(() => toast.error('Failed to load settings'))
      .finally(() => setIsLoading(false));
  }, []);

  const bool = (key: keyof typeof settings) => settings[key] === 'true';
  const setB = (key: keyof typeof settings, val: boolean) =>
    setSettings((prev) => ({ ...prev, [key]: String(val) }));
  const setV = (key: keyof typeof settings, val: string) =>
    setSettings((prev) => ({ ...prev, [key]: val }));

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await adminAPI.updateSettings(settings);
      toast.success('Settings saved successfully');
    } catch { toast.error('Failed to save settings'); }
    finally { setIsSaving(false); }
  };

  if (isLoading) return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 flex items-center justify-center ml-64">
        <p className="text-muted-foreground">Loading settings...</p>
      </main>
    </div>
  );

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-auto ml-64">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Platform Settings</h1>
            <p className="text-muted-foreground mt-1">Configure platform behavior and moderation rules</p>
          </div>

          <Tabs defaultValue="general" className="w-full max-w-2xl">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="moderation">Moderation</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6 mt-6">
              <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <h3 className="font-bold text-lg">Content Settings</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Enable Comments</Label>
                    <p className="text-sm text-muted-foreground">Allow users to comment on blogs</p>
                  </div>
                  <Checkbox
                    checked={bool('comments_enabled')}
                    onCheckedChange={(v) => setB('comments_enabled', v as boolean)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Require Approval</Label>
                    <p className="text-sm text-muted-foreground">New blogs require admin approval before publishing</p>
                  </div>
                  <Checkbox
                    checked={bool('require_approval')}
                    onCheckedChange={(v) => setB('require_approval', v as boolean)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxSize">Maximum Blog Size (bytes)</Label>
                  <Input
                    id="maxSize"
                    type="number"
                    value={settings.max_blog_size}
                    onChange={(e) => setV('max_blog_size', e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="moderation" className="space-y-6 mt-6">
              <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <h3 className="font-bold text-lg">Moderation Rules</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Auto Moderation</Label>
                    <p className="text-sm text-muted-foreground">Automatically flag suspicious content</p>
                  </div>
                  <Checkbox
                    checked={bool('auto_moderation')}
                    onCheckedChange={(v) => setB('auto_moderation', v as boolean)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="spamThreshold">Spam Detection Threshold (0-1)</Label>
                  <Input
                    id="spamThreshold"
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={settings.spam_threshold}
                    onChange={(e) => setV('spam_threshold', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Higher values = stricter spam detection</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="maintenance" className="space-y-6 mt-6">
              <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <h3 className="font-bold text-lg">Maintenance Mode</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Enable Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">Temporarily disable platform for maintenance</p>
                  </div>
                  <Checkbox
                    checked={bool('maintenance_mode')}
                    onCheckedChange={(v) => setB('maintenance_mode', v as boolean)}
                  />
                </div>
                {bool('maintenance_mode') && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="message">Maintenance Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Enter message to display to users..."
                        value={settings.maintenance_message}
                        onChange={(e) => setV('maintenance_message', e.target.value)}
                        rows={4}
                      />
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded p-4">
                      <p className="text-sm text-yellow-900 dark:text-yellow-100">
                        <strong>Warning:</strong> Maintenance mode is enabled. Users will see the maintenance message.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-8">
            <Button onClick={handleSave} disabled={isSaving} size="lg">
              {isSaving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
