import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from '@/contexts/I18nContext';
import { Button } from '@/components/ui/button';
import { Home, Moon, Sun, PenTool, LogOut, Settings, LayoutDashboard, User, Menu, X, Languages } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const Navbar: React.FC = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useTranslation();
  const [location] = useLocation();

  const isActive = (path: string) => location === path;

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b border-border h-16 flex items-center justify-between px-4">
        <Link href="/">
          <a className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">AI</span>
            </div>
          </a>
        </Link>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="w-8 h-8">
                <Languages className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="end">
              <DropdownMenuItem onClick={() => setLanguage('en')}>
                <span className={language === 'en' ? 'font-bold' : ''}>English</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('zh')}>
                <span className={language === 'zh' ? 'font-bold' : ''}>中文</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="p-2">
            {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Vertical Sidebar */}
      <TooltipProvider>
        <nav className={`fixed left-0 top-0 h-screen w-20 bg-sidebar border-r border-sidebar-border z-40 flex flex-col transition-transform duration-300 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
          {/* Logo */}
          <div className="p-4 border-b border-sidebar-border flex items-center justify-center">
            <Link href="/">
              <a className="flex items-center justify-center hover:opacity-80 transition-opacity">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold">AI</span>
                </div>
              </a>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto py-4">
            <div className="space-y-2 flex flex-col items-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/">
                    <a className={`flex items-center justify-center w-12 h-12 rounded-lg transition-colors ${isActive('/') ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'text-sidebar-foreground hover:bg-sidebar-accent'}`}>
                      <Home className="w-5 h-5" />
                    </a>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{t('nav.home')}</p>
                </TooltipContent>
              </Tooltip>

              {isAuthenticated && (
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link href="/create">
                        <a className={`flex items-center justify-center w-12 h-12 rounded-lg transition-colors ${isActive('/create') ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'text-sidebar-foreground hover:bg-sidebar-accent'}`}>
                          <PenTool className="w-5 h-5" />
                        </a>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{t('nav.write')}</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link href="/dashboard">
                        <a className={`flex items-center justify-center w-12 h-12 rounded-lg transition-colors ${isActive('/dashboard') ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'text-sidebar-foreground hover:bg-sidebar-accent'}`}>
                          <LayoutDashboard className="w-5 h-5" />
                        </a>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{t('nav.dashboard')}</p>
                    </TooltipContent>
                  </Tooltip>

                  {user?.role === 'admin' && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link href="/admin">
                          <a className={`flex items-center justify-center w-12 h-12 rounded-lg transition-colors ${isActive('/admin') ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'text-sidebar-foreground hover:bg-sidebar-accent'}`}>
                            <Settings className="w-5 h-5" />
                          </a>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>{t('nav.adminPanel')}</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Bottom Section */}
          <div className="p-4 border-t border-sidebar-border space-y-2 flex flex-col items-center">
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="w-12 h-12">
                      <Languages className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Language</p>
                </TooltipContent>
              </Tooltip>
              <DropdownMenuContent side="right" align="start">
                <DropdownMenuItem onClick={() => setLanguage('en')}>
                  <span className={language === 'en' ? 'font-bold' : ''}>English</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('zh')}>
                  <span className={language === 'zh' ? 'font-bold' : ''}>中文</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="w-12 h-12"
                >
                  {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{theme === 'light' ? t('nav.darkMode') : t('nav.lightMode')}</p>
              </TooltipContent>
            </Tooltip>

            {isAuthenticated ? (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href={`/profile/${user?.id}`}>
                      <a className={`flex items-center justify-center w-12 h-12 rounded-lg transition-colors ${isActive(`/profile/${user?.id}`) ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'text-sidebar-foreground hover:bg-sidebar-accent'}`}>
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold">
                          {user?.username?.charAt(0).toUpperCase()}
                        </div>
                      </a>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{t('nav.profile')}</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={logout}
                      className="w-12 h-12 text-destructive hover:text-destructive"
                    >
                      <LogOut className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{t('nav.logout')}</p>
                  </TooltipContent>
                </Tooltip>
              </>
            ) : (
              <div className="space-y-2 flex flex-col items-center">
                <Link href="/login">
                  <Button variant="outline" size="sm" className="text-xs px-2">
                    {t('nav.login')}
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="text-xs px-2">
                    {t('nav.signUp')}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </nav>
      </TooltipProvider>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
};
