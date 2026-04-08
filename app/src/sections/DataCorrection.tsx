import { useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { cn } from '@/lib/utils';
import type { CorrectionTask } from '@/types';
import { 
  AlertCircle, 
  Clock, 
  CheckCircle, 
  User,
  Link2,
  Info,
  Tag,
  Users,
  Search
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { mockInstitutions, mockScholars } from '@/data/mock';

const issueTypeConfig = {
  XREF_MISMATCH: { 
    label: 'XREF Mismatch', 
    color: 'bg-rose-100 text-rose-800 border-rose-200',
    icon: Link2 
  },
  INFO_OUTDATED: { 
    label: 'Info Outdated', 
    color: 'bg-amber-100 text-amber-800 border-amber-200',
    icon: Info 
  },
  TAG_MISSING: { 
    label: 'Tag Missing', 
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: Tag 
  },
  DUPLICATE_SUSPECTED: { 
    label: 'Duplicate Suspected', 
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: Users 
  },
};

const priorityConfig = {
  high: { color: 'bg-rose-500', label: 'High' },
  medium: { color: 'bg-amber-500', label: 'Medium' },
  low: { color: 'bg-emerald-500', label: 'Low' },
};

interface KanbanColumnProps {
  title: string;
  status: 'pending' | 'in_progress' | 'submitted';
  tasks: CorrectionTask[];
  onTaskMove: (taskId: string, newStatus: 'pending' | 'in_progress' | 'submitted') => void;
  onTaskClick: (task: CorrectionTask) => void;
  icon: React.ElementType;
  color: string;
}

function KanbanColumn({ 
  title, 
  status, 
  tasks, 
  onTaskMove, 
  onTaskClick,
  icon: Icon,
  color 
}: KanbanColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      onTaskMove(taskId, status);
    }
  };

  return (
    <div 
      className={cn(
        'flex flex-col h-full rounded-lg border-2 transition-colors',
        isDragOver ? 'border-primary bg-primary/5' : 'border-border bg-muted/30'
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className={cn('p-3 border-b border-border rounded-t-lg', color)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4" />
            <h3 className="font-semibold text-sm">{title}</h3>
          </div>
          <Badge variant="secondary" className="text-xs">
            {tasks.length}
          </Badge>
        </div>
      </div>
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-3">
          {tasks.map((task) => (
            <KanbanCard 
              key={task.id} 
              task={task} 
              onClick={() => onTaskClick(task)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

interface KanbanCardProps {
  task: CorrectionTask;
  onClick: () => void;
}

function KanbanCard({ task, onClick }: KanbanCardProps) {
  const issueConfig = issueTypeConfig[task.issueType];
  const IssueIcon = issueConfig.icon;
  const priority = priorityConfig[task.priority];

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('taskId', task.id);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={onClick}
      className="kanban-card cursor-pointer"
    >
      <div className="flex items-start justify-between mb-2">
        <Badge variant="outline" className={cn('text-xs', issueConfig.color)}>
          <IssueIcon className="h-3 w-3 mr-1" />
          {issueConfig.label}
        </Badge>
        <div className={cn('w-2 h-2 rounded-full', priority.color)} title={priority.label} />
      </div>
      
      <h4 className="font-medium text-sm mb-1">{task.entityName}</h4>
      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
        {task.description}
      </p>
      
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          Flagged {formatTime(task.createdAt)}
        </span>
        {task.assignee ? (
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs bg-primary text-primary-foreground">
              {task.assigneeAvatar}
            </AvatarFallback>
          </Avatar>
        ) : (
          <span className="text-xs text-amber-600">Unassigned</span>
        )}
      </div>
    </div>
  );
}

function XREFCorrectionDialog({ 
  task, 
  open, 
  onClose 
}: { 
  task: CorrectionTask | null; 
  open: boolean; 
  onClose: () => void;
}) {
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  if (!task) return null;

  const entity = task.entityType === 'scholar' 
    ? mockScholars.find((s) => s.id === task.entityId)
    : mockInstitutions.find((i) => i.id === task.entityId);

  const suggestedMatches = task.entityType === 'scholar' 
    ? mockInstitutions.filter((i) => 
        i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.shortName?.toLowerCase().includes(searchQuery.toLowerCase())
      ).map((i) => ({
        id: i.id,
        name: i.name,
        type: 'institution' as const,
        location: `${i.city}, ${i.country}`,
        confidence: Math.floor(Math.random() * 30) + 70,
        matchReason: 'Name similarity',
      }))
    : mockScholars.filter((s) => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
      ).map((s) => ({
        id: s.id,
        name: s.name,
        type: 'scholar' as const,
        location: s.currentAffiliation || '',
        confidence: Math.floor(Math.random() * 30) + 70,
        matchReason: 'Affiliation match',
      }));

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'confidence-high';
    if (confidence >= 70) return 'confidence-medium';
    return 'confidence-low';
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            Cross-Reference Correction
          </DialogTitle>
          <DialogDescription>
            Review and correct the entity relationship for {task.entityName}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 mt-4">
          {/* Current State */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
              Current State
              <span className="ml-2 text-rose-600">(TO BE UNLINKED)</span>
            </h4>
            {entity && (
              <Card className="border-rose-200 bg-rose-50/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
                      {task.entityType === 'scholar' ? (
                        <User className="h-5 w-5 text-rose-600" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-rose-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{entity.name}</p>
                      <code className="text-xs text-muted-foreground">{entity.id}</code>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Primary Affiliation
                  </Badge>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Suggested Matches */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
              Suggested Matches
            </h4>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search correct entity..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {suggestedMatches.map((match) => (
                  <button
                    key={match.id}
                    onClick={() => setSelectedMatch(match.id)}
                    className={cn(
                      'w-full text-left p-3 rounded-lg border transition-all',
                      selectedMatch === match.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          'w-2 h-2 rounded-full',
                          getConfidenceColor(match.confidence)
                        )} />
                        <span className="font-medium text-sm">{match.name}</span>
                      </div>
                      <span className="text-xs font-medium">{match.confidence}%</span>
                    </div>
                    <Progress 
                      value={match.confidence} 
                      className="h-1.5 mb-2"
                    />
                    <p className="text-xs text-muted-foreground">{match.location}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {match.matchReason}
                    </p>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            disabled={!selectedMatch}
            onClick={() => {
              onClose();
            }}
          >
            Stage Correction
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function InfoUpdateDialog({ 
  task, 
  open, 
  onClose 
}: { 
  task: CorrectionTask | null; 
  open: boolean; 
  onClose: () => void;
}) {
  if (!task) return null;

  const entity = task.entityType === 'scholar' 
    ? mockScholars.find((s) => s.id === task.entityId)
    : mockInstitutions.find((i) => i.id === task.entityId);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Entity Information Update
          </DialogTitle>
          <DialogDescription>
            Update outdated information for {task.entityName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="text-sm font-medium mb-2">Current Data</h4>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(entity, null, 2)}
            </pre>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onClose}>
            Submit Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function DataCorrection() {
  const { 
    correctionTasks, 
    moveTaskToColumn,
    addToast 
  } = useAppStore();
  
  const [selectedTask, setSelectedTask] = useState<CorrectionTask | null>(null);
  const [dialogType, setDialogType] = useState<'xref' | 'info' | null>(null);

  const pendingTasks = correctionTasks.filter((t: CorrectionTask) => t.status === 'pending');
  const inProgressTasks = correctionTasks.filter((t: CorrectionTask) => t.status === 'in_progress');
  const submittedTasks = correctionTasks.filter((t: CorrectionTask) => t.status === 'submitted');

  const handleTaskMove = (taskId: string, newStatus: 'pending' | 'in_progress' | 'submitted') => {
    moveTaskToColumn(taskId, newStatus);
    if (newStatus === 'in_progress') {
      addToast({
        type: 'success',
        title: 'Task Claimed',
        message: 'You have claimed this correction task',
      });
    }
  };

  const handleTaskClick = (task: CorrectionTask) => {
    setSelectedTask(task);
    if (task.issueType === 'XREF_MISMATCH') {
      setDialogType('xref');
    } else {
      setDialogType('info');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in h-full">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Data Correction</h1>
          <p className="text-muted-foreground mt-1">
            Governance Pool - Manage and resolve data quality issues
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              <span>High Priority</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span>Medium Priority</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span>Low Priority</span>
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-280px)]">
        <KanbanColumn
          title="Pending Correction"
          status="pending"
          tasks={pendingTasks}
          onTaskMove={handleTaskMove}
          onTaskClick={handleTaskClick}
          icon={AlertCircle}
          color="bg-rose-50 text-rose-800 border-rose-200"
        />
        <KanbanColumn
          title="In Progress"
          status="in_progress"
          tasks={inProgressTasks}
          onTaskMove={handleTaskMove}
          onTaskClick={handleTaskClick}
          icon={Clock}
          color="bg-amber-50 text-amber-800 border-amber-200"
        />
        <KanbanColumn
          title="Submitted for Approval"
          status="submitted"
          tasks={submittedTasks}
          onTaskMove={handleTaskMove}
          onTaskClick={handleTaskClick}
          icon={CheckCircle}
          color="bg-sky-50 text-sky-800 border-sky-200"
        />
      </div>

      {/* Dialogs */}
      {dialogType === 'xref' && (
        <XREFCorrectionDialog
          task={selectedTask}
          open={!!selectedTask}
          onClose={() => {
            setSelectedTask(null);
            setDialogType(null);
          }}
        />
      )}
      {dialogType === 'info' && (
        <InfoUpdateDialog
          task={selectedTask}
          open={!!selectedTask}
          onClose={() => {
            setSelectedTask(null);
            setDialogType(null);
          }}
        />
      )}
    </div>
  );
}
