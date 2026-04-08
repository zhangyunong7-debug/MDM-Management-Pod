import { useAppStore } from '@/store/appStore';
import { cn } from '@/lib/utils';
import { 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  TrendingUp,
  Plus,
  Search,
  AlertTriangle,
  Clock,
  User,
  Building2,
  GraduationCap,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface KPICardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  trend?: string;
  trendUp?: boolean;
  color: 'blue' | 'amber' | 'rose' | 'emerald' | 'purple';
  onClick?: () => void;
}

const iconBgStyles = {
  blue: 'bg-blue-100 text-blue-600',
  amber: 'bg-amber-100 text-amber-600',
  rose: 'bg-rose-100 text-rose-600',
  emerald: 'bg-emerald-100 text-emerald-600',
  purple: 'bg-purple-100 text-purple-600',
};

function KPICard({ title, value, icon: Icon, trend, trendUp, color, onClick }: KPICardProps) {
  return (
    <Card 
      className={cn(
        'cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5',
        onClick && 'hover:border-primary/50'
      )}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold mt-2">{value.toLocaleString()}</p>
            {trend && (
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className={cn(
                  'h-4 w-4',
                  trendUp ? 'text-emerald-500' : 'text-rose-500 rotate-180'
                )} />
                <span className={cn(
                  'text-sm',
                  trendUp ? 'text-emerald-600' : 'text-rose-600'
                )}>
                  {trend}
                </span>
              </div>
            )}
          </div>
          <div className={cn('p-3 rounded-lg', iconBgStyles[color])}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ActivityTimeline() {
  const { activities, setCurrentPage } = useAppStore();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'create':
        return <div className="w-2 h-2 rounded-full bg-emerald-500" />;
      case 'update':
        return <div className="w-2 h-2 rounded-full bg-blue-500" />;
      case 'correction':
        return <div className="w-2 h-2 rounded-full bg-amber-500" />;
      case 'approval':
        return <div className="w-2 h-2 rounded-full bg-purple-500" />;
      default:
        return <div className="w-2 h-2 rounded-full bg-gray-400" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (hours < 168) return `${Math.floor(hours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <CardDescription>Last 7 days of system activity</CardDescription>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setCurrentPage('logs')}
          >
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[280px]">
          <div className="space-y-4">
            {activities.map((activity, index: number) => (
              <div key={activity.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    {getActivityIcon(activity.type)}
                  </div>
                  {index < activities.length - 1 && (
                    <div className="w-px flex-1 bg-border mt-2" />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <p className="text-sm font-medium">{activity.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">
                      by {activity.user}
                    </span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">
                      {formatTimestamp(activity.timestamp)}
                    </span>
                  </div>
                  {activity.entityName && (
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {activity.entityType === 'scholar' ? (
                          <GraduationCap className="h-3 w-3 mr-1" />
                        ) : (
                          <Building2 className="h-3 w-3 mr-1" />
                        )}
                        {activity.entityName}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function QuickActions() {
  const { setCurrentPage } = useAppStore();

  const actions = [
    {
      label: 'New Scholar',
      description: 'Create a new scholar profile',
      icon: User,
      color: 'blue' as const,
      onClick: () => setCurrentPage('create'),
    },
    {
      label: 'New Institution',
      description: 'Add a new institution',
      icon: Building2,
      color: 'purple' as const,
      onClick: () => setCurrentPage('create'),
    },
    {
      label: 'View Governance Pool',
      description: 'Review pending corrections',
      icon: AlertTriangle,
      color: 'amber' as const,
      onClick: () => setCurrentPage('corrections'),
    },
  ];

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Quick Actions</CardTitle>
        <CardDescription>Common tasks and shortcuts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                onClick={action.onClick}
                className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted transition-colors text-left"
              >
                <div className={cn('p-2 rounded-md', iconBgStyles[action.color])}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{action.label}</p>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function DataQualityScore() {
  const { dashboardKPI } = useAppStore();
  const score = dashboardKPI.dataQualityScore;

  let scoreColor = 'text-emerald-600';
  let scoreBg = 'bg-emerald-500';
  if (score < 80) {
    scoreColor = 'text-rose-600';
    scoreBg = 'bg-rose-500';
  } else if (score < 90) {
    scoreColor = 'text-amber-600';
    scoreBg = 'bg-amber-500';
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Data Quality Score</p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className={cn('text-3xl font-bold', scoreColor)}>{score}%</span>
              <span className="text-sm text-muted-foreground">Excellent</span>
            </div>
          </div>
          <div className="w-16 h-16 relative">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-muted"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className={scoreBg}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray={`${score}, 100`}
              />
            </svg>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Complete Records</span>
            <span className="font-medium">98.5%</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Verified Affiliations</span>
            <span className="font-medium">96.2%</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Valid ORCID</span>
            <span className="font-medium">87.3%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function Dashboard() {
  const { dashboardKPI, setCurrentPage } = useAppStore();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of your data governance activities
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setCurrentPage('search')}>
            <Search className="mr-2 h-4 w-4" />
            Search Entities
          </Button>
          <Button onClick={() => setCurrentPage('create')}>
            <Plus className="mr-2 h-4 w-4" />
            New Entity
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Pending Corrections"
          value={dashboardKPI.pendingCorrections}
          icon={AlertCircle}
          color="rose"
          onClick={() => setCurrentPage('corrections')}
        />
        <KPICard
          title="Pending Approvals"
          value={dashboardKPI.pendingApprovals}
          icon={Clock}
          color="amber"
          onClick={() => setCurrentPage('approvals')}
        />
        <KPICard
          title="Rejected Items"
          value={dashboardKPI.rejectedItems}
          icon={XCircle}
          color="rose"
          trend="-2 from last week"
          trendUp={true}
        />
        <DataQualityScore />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Timeline */}
        <div className="lg:col-span-2">
          <ActivityTimeline />
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <QuickActions />
        </div>
      </div>

      {/* Entity Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Entity Summary</CardTitle>
          <CardDescription>Overview of entities in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-50">
                <GraduationCap className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">1,247</p>
                <p className="text-sm text-muted-foreground">Total Scholars</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-purple-50">
                <Building2 className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">386</p>
                <p className="text-sm text-muted-foreground">Total Institutions</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-emerald-50">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">98.2%</p>
                <p className="text-sm text-muted-foreground">Active Entities</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
