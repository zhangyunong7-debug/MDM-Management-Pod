import { useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { cn } from '@/lib/utils';
import type { OperationLog } from '@/types';
import { 
  History, 
  Search, 
  User,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Download,
  Calendar,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

const operationTypeConfig = {
  CREATE: { label: 'Create', icon: Plus, color: 'bg-emerald-100 text-emerald-800' },
  UPDATE: { label: 'Update', icon: Edit, color: 'bg-blue-100 text-blue-800' },
  DELETE: { label: 'Delete', icon: Trash2, color: 'bg-rose-100 text-rose-800' },
  APPROVE: { label: 'Approve', icon: CheckCircle, color: 'bg-emerald-100 text-emerald-800' },
  REJECT: { label: 'Reject', icon: XCircle, color: 'bg-rose-100 text-rose-800' },
};

interface LogEntryProps {
  log: OperationLog;
}

function LogEntry({ log }: LogEntryProps) {
  const [expanded, setExpanded] = useState(false);
  const typeConfig = operationTypeConfig[log.operationType];
  const TypeIcon = typeConfig.icon;

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString(),
      full: date.toLocaleString(),
    };
  };

  const timestamp = formatTimestamp(log.timestamp);

  return (
    <div className="border-b border-border last:border-0">
      <div 
        className="p-4 hover:bg-muted/50 transition-colors cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start gap-4">
          <div className={cn('p-2 rounded-lg flex-shrink-0', typeConfig.color)}>
            <TypeIcon className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium text-sm">{log.description}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {log.user}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {timestamp.full}
                  </span>
                  {log.workflowId && (
                    <Badge variant="outline" className="text-xs">
                      {log.workflowId}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs capitalize">
                  {log.entityType}
                </Badge>
                {expanded ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 pl-16">
          <div className="bg-muted rounded-lg p-4 space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Entity ID</p>
                <code className="text-xs font-mono">{log.entityId || 'N/A'}</code>
              </div>
              <div>
                <p className="text-muted-foreground">Entity Name</p>
                <p>{log.entityName}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Operation Type</p>
                <Badge className={typeConfig.color}>
                  {typeConfig.label}
                </Badge>
              </div>
              <div>
                <p className="text-muted-foreground">Workflow ID</p>
                <p>{log.workflowId || 'N/A'}</p>
              </div>
            </div>

            {log.details && log.details.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Changes</p>
                <div className="space-y-2">
                  {log.details.map((change, index) => (
                    <div key={index} className="bg-background rounded p-2 text-sm">
                      <p className="font-medium">{change.fieldLabel}</p>
                      <div className="grid grid-cols-2 gap-2 mt-1 text-xs">
                        <div>
                          <span className="text-muted-foreground">From: </span>
                          <span className="line-through text-rose-600">
                            {Array.isArray(change.previous) 
                              ? change.previous.join(', ') 
                              : String(change.previous || '—')}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">To: </span>
                          <span className="text-emerald-600">
                            {Array.isArray(change.current) 
                              ? change.current.join(', ') 
                              : String(change.current || '—')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-3 w-3" />
                Export JSON
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function OperationLogs() {
  const { operationLogs, addToast } = useAppStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [operationTypeFilter, setOperationTypeFilter] = useState<string>('all');
  const [entityTypeFilter, setEntityTypeFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});

  const filteredLogs = operationLogs.filter(log => {
    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        log.description.toLowerCase().includes(query) ||
        log.entityName.toLowerCase().includes(query) ||
        log.entityId?.toLowerCase().includes(query) ||
        log.user.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Operation type filter
    if (operationTypeFilter !== 'all' && log.operationType !== operationTypeFilter) {
      return false;
    }

    // Entity type filter
    if (entityTypeFilter !== 'all' && log.entityType !== entityTypeFilter) {
      return false;
    }

    // Date range filter
    if (dateRange.from) {
      const logDate = new Date(log.timestamp);
      if (logDate < dateRange.from) return false;
    }
    if (dateRange.to) {
      const logDate = new Date(log.timestamp);
      if (logDate > dateRange.to) return false;
    }

    return true;
  });

  const handleExport = () => {
    addToast({
      type: 'success',
      title: 'Export Started',
      message: `Exporting ${filteredLogs.length} log entries...`,
    });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setOperationTypeFilter('all');
    setEntityTypeFilter('all');
    setDateRange({});
  };

  const hasActiveFilters = 
    searchQuery || 
    operationTypeFilter !== 'all' || 
    entityTypeFilter !== 'all' ||
    dateRange.from ||
    dateRange.to;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Operation Logs</h1>
          <p className="text-muted-foreground mt-1">
            Audit trail of all system operations and changes
          </p>
        </div>
        <Button onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export Logs
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Operation Type Filter */}
            <Select value={operationTypeFilter} onValueChange={setOperationTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Operation Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Operations</SelectItem>
                <SelectItem value="CREATE">Create</SelectItem>
                <SelectItem value="UPDATE">Update</SelectItem>
                <SelectItem value="DELETE">Delete</SelectItem>
                <SelectItem value="APPROVE">Approve</SelectItem>
                <SelectItem value="REJECT">Reject</SelectItem>
              </SelectContent>
            </Select>

            {/* Entity Type Filter */}
            <Select value={entityTypeFilter} onValueChange={setEntityTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Entity Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Entities</SelectItem>
                <SelectItem value="scholar">Scholar</SelectItem>
                <SelectItem value="institution">Institution</SelectItem>
              </SelectContent>
            </Select>

            {/* Date Range */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[240px] justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {dateRange.from.toLocaleDateString()} - {dateRange.to.toLocaleDateString()}
                      </>
                    ) : (
                      dateRange.from.toLocaleDateString()
                    )
                  ) : (
                    'Select date range'
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="range"
                  selected={{
                    from: dateRange.from,
                    to: dateRange.to,
                  }}
                  onSelect={(range) => {
                    setDateRange({
                      from: range?.from,
                      to: range?.to,
                    });
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button variant="ghost" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              Log Entries
              <Badge variant="secondary" className="ml-2">
                {filteredLogs.length}
              </Badge>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12">
              <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">No logs found</h3>
              <p className="text-muted-foreground mt-1">
                Try adjusting your filters
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-400px)]">
              <div className="divide-y divide-border">
                {filteredLogs.map((log) => (
                  <LogEntry key={log.id} log={log} />
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
