import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Home, Moon, Sun, PenTool, LogOut, Settings, LayoutDashboard, User, Menu, X } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export const Navbar: React.FC = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
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
        <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="p-2">
          {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
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
                  <p>Home</p>
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
                      <p>Write</p>
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
                      <p>Dashboard</p>
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
                        <p>Admin Panel</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Bottom Section */}
          <div className="p-4 border-t border-sidebar-border space-y-2 flex flex-col items-center">
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
                <p>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</p>
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
                    <p>Profile</p>
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
                    <p>Logout</p>
                  </TooltipContent>
                </Tooltip>
              </>
            ) : (
              <div className="space-y-2 flex flex-col items-center">
                <Link href="/login">
                  <Button variant="outline" size="sm" className="text-xs px-2">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="text-xs px-2">
                    Sign up
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
