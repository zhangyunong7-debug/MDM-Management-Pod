import { useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { cn } from '@/lib/utils';
import { 
  Search, 
  Bell, 
  Globe, 
  User, 
  ChevronDown,
  LogOut,
  Settings,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'approval' | 'correction' | 'system';
}

const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    title: 'Approval Request',
    message: 'Dr. Elena Vance affiliation update awaiting your approval',
    timestamp: '2024-03-10T14:00:00Z',
    read: false,
    type: 'approval',
  },
  {
    id: 'notif-2',
    title: 'Correction Task',
    message: 'New XREF mismatch flagged for Dr. Li Ming',
    timestamp: '2024-03-09T10:00:00Z',
    read: false,
    type: 'correction',
  },
  {
    id: 'notif-3',
    title: 'System Update',
    message: 'Data quality score improved to 94%',
    timestamp: '2024-03-08T16:00:00Z',
    read: true,
    type: 'system',
  },
];

export function TopBar() {
  const { 
    currentUser, 
    setCurrentPage,
    setSearchFilters,
  } = useAppStore();
  
  const [notifications, setNotifications] = useState(mockNotifications);
  const [searchValue, setSearchValue] = useState('');

  const unreadCount = notifications.filter((n: Notification) => !n.read).length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchFilters({ query: searchValue });
    setCurrentPage('search');
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map((n: Notification) => n.id === id ? { ...n, read: true } : n)
    );
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'approval':
        return <div className="w-2 h-2 rounded-full bg-sky-500" />;
      case 'correction':
        return <div className="w-2 h-2 rounded-full bg-rose-500" />;
      case 'system':
        return <div className="w-2 h-2 rounded-full bg-emerald-500" />;
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-white/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left: Logo & Search */}
        <div className="flex items-center gap-6 flex-1">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                 style={{
                   background: 'linear-gradient(135deg, hsl(213 100% 70%), hsl(217 91% 50%))',
                   boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)'
                 }}>
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <div className="hidden lg:block">
              <h1 className="text-sm font-semibold text-foreground">
                GARC Master Data Governance
              </h1>
              <p className="text-xs text-muted-foreground">
                Global Academic Research Consortium
              </p>
            </div>
          </div>

          {/* Global Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search scholars, institutions, or IDs..."
                className="w-full pl-10 pr-4 h-10 bg-muted border-0 focus:bg-white focus:ring-2 focus:ring-primary/20"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
          </form>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Mobile Search */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setCurrentPage('search')}
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">EN</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>English</DropdownMenuItem>
              <DropdownMenuItem>中文 (Simplified)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-rose-500 text-[10px] text-white flex items-center justify-center font-medium">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="flex items-center justify-between p-3 border-b border-border">
                <h3 className="font-semibold text-sm">Notifications</h3>
                <Button variant="ghost" size="sm" className="h-auto py-1 px-2 text-xs">
                  Mark all read
                </Button>
              </div>
              <ScrollArea className="h-64">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground text-sm">
                    No notifications
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {notifications.map((notification: Notification) => (
                      <button
                        key={notification.id}
                        onClick={() => markAsRead(notification.id)}
                        className={cn(
                          'w-full p-3 text-left hover:bg-muted transition-colors',
                          !notification.read && 'bg-muted/50'
                        )}
                      >
                        <div className="flex items-start gap-3">
                          {getNotificationIcon(notification.type)}
                          <div className="flex-1 min-w-0">
                            <p className={cn(
                              'text-sm font-medium',
                              !notification.read && 'text-foreground'
                            )}>
                              {notification.title}
                            </p>
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatTimestamp(notification.timestamp)}
                            </p>
                          </div>
                          {!notification.read && (
                            <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </ScrollArea>
              <div className="p-2 border-t border-border">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full"
                  onClick={() => setCurrentPage('approvals')}
                >
                  View all notifications
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 pl-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                    {currentUser.avatar || currentUser.name.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium leading-none">{currentUser.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{currentUser.role}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>{currentUser.name}</span>
                  <span className="text-xs text-muted-foreground font-normal">
                    {currentUser.email}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCurrentPage('settings')}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HelpCircle className="mr-2 h-4 w-4" />
                Help & Support
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-rose-600">
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
