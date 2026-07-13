import { useAppStore } from '@/store/appStore';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Search,
  PlusCircle,
  AlertCircle,
  CheckCircle,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Landmark,
  Tags,
  TagIcon
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'search', label: 'Entity Search', icon: Search },
  { id: 'create', label: 'Create New Entity', icon: PlusCircle },
  { id: 'corrections', label: 'Data Correction', icon: AlertCircle, badge: 12 },
  { id: 'approvals', label: 'Approval Center', icon: CheckCircle, badge: 8 },
  { id: 'tags', label: 'Tag Management', icon: TagIcon },
  { id: 'logs', label: 'Operation Logs', icon: History },
  { id: 'settings', label: 'System Settings', icon: Settings },
];

export function Sidebar() {
  const {
    currentPage,
    setCurrentPage,
    sidebarCollapsed,
    toggleSidebar,
    dashboardKPI
  } = useAppStore();

  const handleNavClick = (pageId: string) => {
    setCurrentPage(pageId);
  };

  const getBadgeCount = (item: NavItem) => {
    if (item.id === 'corrections') return dashboardKPI.pendingCorrections;
    if (item.id === 'approvals') return dashboardKPI.pendingApprovals;
    return item.badge;
  };

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          'fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] transition-all duration-300 ease-drawer',
          'bg-white border-r border-border',
          sidebarCollapsed ? 'w-16' : 'w-64'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Collapse Toggle */}
          <div className="flex justify-end p-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
              onClick={toggleSidebar}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Logo Area (when expanded) */}
          {!sidebarCollapsed && (
            <div className="px-4 pb-4 mb-2 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                     style={{
                       background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                       boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)'
                     }}>
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    GARC
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    Master Data
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <ScrollArea className="flex-1 px-2">
            <nav className="space-y-0.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                const badgeCount = getBadgeCount(item);

                const navButton = (
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative group',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <Icon className={cn('h-5 w-5 flex-shrink-0 transition-colors', isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground')} />
                    {!sidebarCollapsed && (
                      <>
                        <span className="flex-1 text-left">{item.label}</span>
                        {badgeCount && badgeCount > 0 && (
                          <Badge
                            variant={isActive ? 'default' : 'secondary'}
                            className={cn(
                              'h-5 min-w-5 px-1.5 text-xs font-medium',
                              isActive ? 'bg-primary text-primary-foreground' : ''
                            )}
                          >
                            {badgeCount}
                          </Badge>
                        )}
                      </>
                    )}
                    {sidebarCollapsed && badgeCount && badgeCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full text-[10px] text-white flex items-center justify-center font-medium"
                            style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
                        {badgeCount}
                      </span>
                    )}
                  </button>
                );

                if (sidebarCollapsed) {
                  return (
                    <Tooltip key={item.id}>
                      <TooltipTrigger asChild>
                        {navButton}
                      </TooltipTrigger>
                      <TooltipContent side="right" className="flex items-center gap-2">
                        {item.label}
                        {badgeCount && badgeCount > 0 && (
                          <Badge variant="secondary" className="h-4 min-w-4 px-1 text-[10px]">
                            {badgeCount}
                          </Badge>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  );
                }

                return <div key={item.id}>{navButton}</div>;
              })}
            </nav>
          </ScrollArea>

          {/* Entity Type Indicator */}
          {!sidebarCollapsed && (
            <div className="p-4 mt-auto border-t border-border">
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Entity Types
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-md bg-blue-50">
                    <GraduationCap className="h-3.5 w-3.5 text-blue-600" />
                    <span className="text-xs text-blue-700">Scholar</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-md bg-indigo-50">
                    <Landmark className="h-3.5 w-3.5 text-indigo-600" />
                    <span className="text-xs text-indigo-700">Institution</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
}
