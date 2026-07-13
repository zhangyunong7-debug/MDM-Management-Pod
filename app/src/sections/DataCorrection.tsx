import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/appStore';
import { cn } from '@/lib/utils';
import type { CorrectionTask } from '@/types';
import {
  AlertCircle,
  Clock,
  CheckCircle,
  Link2,
  Tag,
  Users,
  Search,
  Landmark,
  User,
  X,
  Plus,
  Mail,
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
    icon: Link2,
  },
  INFO_OUTDATED: {
    label: 'Info Outdated',
    color: 'bg-amber-100 text-amber-800 border-amber-200',
    icon: AlertCircle,
  },
  TAG_MISSING: {
    label: 'Tag Missing',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: Tag,
  },
  DUPLICATE_SUSPECTED: {
    label: 'Duplicate Suspected',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: Users,
  },
};

const priorityConfig = {
  high: { color: 'bg-rose-500', label: 'High' },
  medium: { color: 'bg-amber-500', label: 'Medium' },
  low: { color: 'bg-emerald-500', label: 'Low' },
};

function formatTime(timestamp: string) {
  const date = new Date(timestamp);
  const formatted = date.toISOString().replace('T', ' ').slice(0, 19);
  return formatted;
}

/* ------------------------------------------------------------------ */
/*  Pending Correction Card                                            */
/* ------------------------------------------------------------------ */
interface PendingCardProps {
  task: CorrectionTask;
  onClick: () => void;
}

function PendingCard({ task, onClick }: PendingCardProps) {
  const issueConfig = issueTypeConfig[task.issueType];
  const IssueIcon = issueConfig.icon;
  const isScholar = task.entityType === 'scholar';
  const EntityIcon = isScholar ? User : Landmark;

  return (
    <div
      onClick={onClick}
      className="bg-card border border-input rounded p-4 hover:shadow-md hover:border-primary/30 transition-all cursor-pointer flex gap-4"
    >
      {/* Left icon */}
      <div className="flex-shrink-0">
        <div className={`w-10 h-10 rounded flex items-center justify-center ${isScholar ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
          <EntityIcon className="w-6 h-6" />
        </div>
      </div>

      {/* Entity info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-gray-900 truncate">{task.entityName}</h3>
        <p className="text-xs text-gray-500 mt-0.5">{task.entityId}</p>
        <div className="mt-2">
          <span className={`text-xs font-medium uppercase tracking-wider ${issueConfig.color.replace('bg-', 'text-').replace('-100', '-500')}`}>
            {issueConfig.label}
          </span>
        </div>
      </div>

      {/* Right: timestamp */}
      <div className="flex-shrink-0 flex flex-col items-end justify-between">
        <div className="flex items-center text-gray-400 text-xs">
          <Clock className="w-3.5 h-3.5 mr-1" />
          {formatTime(task.createdAt)}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  In Progress Card                                                   */
/* ------------------------------------------------------------------ */
interface InProgressCardProps {
  task: CorrectionTask;
  onClick: () => void;
}

function InProgressCard({ task, onClick }: InProgressCardProps) {
  const issueConfig = issueTypeConfig[task.issueType];
  const IssueIcon = issueConfig.icon;
  const isScholar = task.entityType === 'scholar';
  const EntityIcon = isScholar ? User : Landmark;

  return (
    <div
      onClick={onClick}
      className="bg-card border border-input rounded p-4 hover:shadow-md hover:border-primary/30 transition-all cursor-pointer flex gap-4"
    >
      {/* Left icon */}
      <div className="flex-shrink-0">
        <div className={`w-10 h-10 rounded flex items-center justify-center ${isScholar ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
          <EntityIcon className="w-6 h-6" />
        </div>
      </div>

      {/* Entity info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-gray-900 truncate">{task.entityName}</h3>
        <p className="text-xs text-gray-500 mt-0.5">{task.entityId}</p>
        <div className="mt-2">
          <span className={`text-xs font-medium uppercase tracking-wider ${issueConfig.color.replace('bg-', 'text-').replace('-100', '-500')}`}>
            {issueConfig.label}
          </span>
        </div>
      </div>

      {/* Right: clock + assignee avatar */}
      <div className="flex-shrink-0 flex flex-col items-center justify-between gap-2">
        <Clock className="w-4 h-4 text-gray-400" />
        {task.assigneeAvatar ? (
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs border border-blue-200">
            {task.assigneeAvatar}
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-xs border border-gray-200">
            ?
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Dialogs                                                            */
/* ------------------------------------------------------------------ */
function XREFCorrectionDialog({
  task,
  open,
  onClose,
}: {
  task: CorrectionTask | null;
  open: boolean;
  onClose: () => void;
}) {
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  if (!task) return null;

  const entity =
    task.entityType === 'scholar'
      ? mockScholars.find((s) => s.id === task.entityId)
      : mockInstitutions.find((i) => i.id === task.entityId);

  const suggestedMatches = task.entityType === 'scholar'
    ? mockInstitutions
        .filter(
          (i) =>
            i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            i.shortName?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map((i) => ({
          id: i.id,
          name: i.name,
          type: 'institution' as const,
          location: `${i.city}, ${i.country}`,
          confidence: Math.floor(Math.random() * 30) + 70,
          matchReason: 'Name similarity',
        }))
    : mockScholars
        .filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .map((s) => ({
          id: s.id,
          name: s.name,
          type: 'scholar' as const,
          location: s.currentAffiliation || '',
          confidence: Math.floor(Math.random() * 30) + 70,
          matchReason: 'Affiliation match',
        }));

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'bg-emerald-500';
    if (confidence >= 70) return 'bg-amber-500';
    return 'bg-rose-500';
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

        <div className="grid grid-cols-2 gap-4 mt-4">
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
                        <Users className="h-5 w-5 text-rose-600" />
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
                        <div className={cn('w-2 h-2 rounded-full', getConfidenceColor(match.confidence))} />
                        <span className="font-medium text-sm">{match.name}</span>
                      </div>
                      <span className="text-xs font-medium">{match.confidence}%</span>
                    </div>
                    <Progress value={match.confidence} className="h-1.5 mb-2" />
                    <p className="text-xs text-muted-foreground">{match.location}</p>
                    <p className="text-xs text-muted-foreground mt-1">{match.matchReason}</p>
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
          <Button disabled={!selectedMatch} onClick={onClose}>
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
  onClose,
}: {
  task: CorrectionTask | null;
  open: boolean;
  onClose: () => void;
}) {
  // Text fields
  const [editCity, setEditCity] = useState('');
  const [editCountry, setEditCountry] = useState('');
  const [editRegion, setEditRegion] = useState('');
  const [editType, setEditType] = useState('');
  const [editUrl, setEditUrl] = useState('');
  const [editAffiliation, setEditAffiliation] = useState('');
  const [editCategory, setEditCategory] = useState('');

  // Multiple emails
  const [emails, setEmails] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [primaryEmailIdx, setPrimaryEmailIdx] = useState(0);

  // Multiple research areas (scholar)
  const [researchAreas, setResearchAreas] = useState<string[]>([]);
  const [newResearchArea, setNewResearchArea] = useState('');

  // Tags
  const [tags, setTags] = useState<string[]>(['Test Code']);
  const [newTag, setNewTag] = useState('');

  // Validation
  const [errors, setErrors] = useState<string[]>([]);

  if (!task) return null;

  const isScholar = task.entityType === 'scholar';
  const entity = isScholar
    ? mockScholars.find((s) => s.id === task.entityId)
    : mockInstitutions.find((i) => i.id === task.entityId);

  const entityNotFound = !entity && task.entityType === 'institution';

  // Populate form when entity changes
  useEffect(() => {
    if (!entity) return;
    if (isScholar) {
      const s = entity as Scholar;
      const emailList = s.emails?.map((e) => e.email) || (s.email ? [s.email] : []);
      setEmails(emailList.length > 0 ? emailList : ['']);
      setPrimaryEmailIdx(0);
      setResearchAreas([...s.researchAreas]);
      setEditAffiliation(s.currentAffiliation || '');
      setEditRegion(s.nationality || '');
      setEditCategory(s.category || '');
    } else {
      const i = entity as Institution;
      setEmails([]);
      setEditCity(i.city || '');
      setEditCountry(i.country || '');
      setEditType(i.institutionType || '');
      setEditUrl(i.website || '');
    }
    setErrors([]);
  }, [entity, isScholar, task.entityId]);

  // Email helpers
  const addEmail = () => {
    const val = newEmail.trim();
    if (val && !emails.includes(val)) {
      setEmails([...emails, val]);
      setNewEmail('');
    }
  };
  const removeEmail = (idx: number) => {
    const next = emails.filter((_, i) => i !== idx);
    if (next.length === 0) setEmails(['']);
    else {
      setEmails(next);
      if (primaryEmailIdx >= next.length) setPrimaryEmailIdx(0);
      else if (primaryEmailIdx === idx) setPrimaryEmailIdx(0);
    }
  };
  const setAsPrimary = (idx: number) => setPrimaryEmailIdx(idx);

  // Research area helpers
  const addResearchArea = () => {
    const val = newResearchArea.trim();
    if (val && !researchAreas.includes(val)) {
      setResearchAreas([...researchAreas, val]);
      setNewResearchArea('');
    }
  };
  const removeResearchArea = (area: string) => {
    setResearchAreas(researchAreas.filter((a) => a !== area));
  };

  // Tag helpers
  const addTag = () => {
    const val = newTag.trim();
    if (val && !tags.includes(val)) {
      setTags([...tags, val]);
      setNewTag('');
    }
  };
  const removeTag = (idx: number) => {
    setTags(tags.filter((_, i) => i !== idx));
  };

  // Validation
  const validate = (): boolean => {
    const errs: string[] = [];
    if (entityNotFound) {
      errs.push('Institution not found in the system. Cannot submit update.');
    }
    if (emails.length === 0 || emails.every((e) => !e.trim())) {
      errs.push('At least one email is required.');
    }
    const invalidEmail = emails.find(
      (e) => e.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim())
    );
    if (invalidEmail) {
      errs.push(`Invalid email format: ${invalidEmail}`);
    }
    setErrors(errs);
    return errs.length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    addToast({ type: 'success', title: 'Update Staged', message: `${task?.entityName} update has been staged` });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Entity Information Update</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Error Banner */}
        {errors.length > 0 && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            {errors.map((err, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-red-700">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {err}
              </div>
            ))}
          </div>
        )}

        {/* Not Found Banner */}
        {entityNotFound && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span className="font-medium">Institution not found:</span>
              <span>The institution with ID <code className="font-mono bg-red-100 px-1 rounded">{task?.entityId}</code> does not exist in the system. Please verify the entity ID before submitting.</span>
            </div>
          </div>
        )}

        <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(90vh-160px)]">
          {/* ==================== Basic Information ==================== */}
          <section>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Register ID</label>
                  <div className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 font-mono break-all">
                    {task.entityId}
                  </div>
                </div>
                {isScholar ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Global Scholar Code</label>
                    <div className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 font-mono">
                      {(entity as Scholar)?.globalScholarCode || '-'}
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Global Inst Code</label>
                    <div className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 font-mono">
                      {(entity as Institution)?.shortName || '-'}
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{isScholar ? 'Global Scholar ID' : 'Global Inst ID'}</label>
                  <div className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 font-mono break-all">
                    {task.entityId}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
                  <div className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 break-all">
                    {task.entityName}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ==================== Emails (Multiple) ==================== */}
          <section>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
              {isScholar ? 'Email Addresses' : 'Contact Emails'}
            </h3>
            <div className="space-y-2">
              {emails.map((email, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        const next = [...emails];
                        next[idx] = e.target.value;
                        setEmails(next);
                      }}
                      placeholder="Enter email address"
                      className={`w-full pl-9 pr-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 ${idx === primaryEmailIdx ? 'border-blue-300 bg-blue-50/30' : 'border-gray-300'}`}
                    />
                  </div>
                  <button
                    onClick={() => setAsPrimary(idx)}
                    className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${idx === primaryEmailIdx ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                    title="Set as primary"
                  >
                    {idx === primaryEmailIdx ? 'Primary' : 'Set Primary'}
                  </button>
                  <button
                    onClick={() => removeEmail(idx)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    title="Remove"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addEmail()}
                    placeholder="Add another email..."
                    className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                  />
                </div>
                <button
                  onClick={addEmail}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>
            </div>
          </section>

          {/* ==================== Scholar-specific fields ==================== */}
          {isScholar && (
            <section>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
                Scholar Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Affiliation</label>
                  <input
                    type="text"
                    value={editAffiliation}
                    onChange={(e) => setEditAffiliation(e.target.value)}
                    placeholder="Enter current affiliation"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Nationality</label>
                  <input
                    type="text"
                    value={editRegion}
                    onChange={(e) => setEditRegion(e.target.value)}
                    placeholder="Enter nationality"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                  <input
                    type="text"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    placeholder="Enter category"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                  />
                </div>
              </div>
            </section>
          )}

          {/* ==================== Research Areas (Scholar) ==================== */}
          {isScholar && (
            <section>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Research Areas
                </h3>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {researchAreas.map((area) => (
                  <span
                    key={area}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 border border-purple-200 text-purple-700 rounded-lg text-sm font-medium"
                  >
                    {area}
                    <button
                      onClick={() => removeResearchArea(area)}
                      className="hover:text-purple-900 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
                {researchAreas.length === 0 && (
                  <span className="text-sm text-gray-400">No research areas added</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newResearchArea}
                  onChange={(e) => setNewResearchArea(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addResearchArea())}
                  placeholder="Add research area..."
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                />
                <button
                  onClick={addResearchArea}
                  className="px-4 py-2 border border-purple-300 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-50 transition-colors flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>
            </section>
          )}

          {/* ==================== Institution-specific fields ==================== */}
          {!isScholar && (
            <section>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
                Institution Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
                  <input
                    type="text"
                    value={editCity}
                    onChange={(e) => setEditCity(e.target.value)}
                    placeholder="Enter city"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Country</label>
                  <select
                    value={editCountry}
                    onChange={(e) => setEditCountry(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white pr-10"
                  >
                    <option value="">Select country</option>
                    <option>China</option>
                    <option>United States</option>
                    <option>United Kingdom</option>
                    <option>Japan</option>
                    <option>Germany</option>
                    <option>France</option>
                    <option>Australia</option>
                    <option>Canada</option>
                    <option>South Korea</option>
                    <option>Singapore</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Region</label>
                  <input
                    type="text"
                    value={editRegion}
                    onChange={(e) => setEditRegion(e.target.value)}
                    placeholder="Enter region"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Type</label>
                  <input
                    type="text"
                    value={editType}
                    onChange={(e) => setEditType(e.target.value)}
                    placeholder="Enter type"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Website URL</label>
                  <input
                    type="url"
                    value={editUrl}
                    onChange={(e) => setEditUrl(e.target.value)}
                    placeholder="https://"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                  />
                </div>
              </div>
            </section>
          )}

          {/* ==================== Classification Tags ==================== */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Classification Tags</h3>
              <button className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                <Plus className="w-4 h-4" /> Add Tags
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-sm font-medium"
                >
                  {tag}
                  <button onClick={() => removeTag(index)} className="hover:text-blue-900 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 border-t border-border bg-muted/50">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-white hover:shadow-sm transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={entityNotFound}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all"
          >
            Stage Update
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */
export function DataCorrection() {
  const { correctionTasks, addToast } = useAppStore();

  const [selectedTask, setSelectedTask] = useState<CorrectionTask | null>(null);
  const [dialogType, setDialogType] = useState<'xref' | 'info' | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [filterEntityType, setFilterEntityType] = useState<string>('all');
  const [filterIssueType, setFilterIssueType] = useState<string>('all');
  const [filterFlaggedBy, setFilterFlaggedBy] = useState<string>('');
  const [filterSearch, setFilterSearch] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  const pendingTasks = correctionTasks.filter(
    (t: CorrectionTask) => t.status === 'pending'
  );
  const inProgressTasks = correctionTasks.filter(
    (t: CorrectionTask) => t.status === 'in_progress'
  );

  const filteredPendingTasks = pendingTasks.filter((task) => {
    if (filterEntityType !== 'all' && task.entityType !== filterEntityType) return false;
    if (filterIssueType !== 'all' && task.issueType !== filterIssueType) return false;
    if (filterSearch) {
      const q = filterSearch.toLowerCase();
      if (!task.entityName.toLowerCase().includes(q) && !task.entityId.toLowerCase().includes(q)) return false;
    }
    if (filterDateFrom) {
      const taskDate = new Date(task.createdAt);
      const from = new Date(filterDateFrom);
      if (taskDate < from) return false;
    }
    if (filterDateTo) {
      const taskDate = new Date(task.createdAt);
      const to = new Date(filterDateTo);
      to.setHours(23, 59, 59);
      if (taskDate > to) return false;
    }
    return true;
  });

  const handleTaskClick = (task: CorrectionTask) => {
    setSelectedTask(task);
    if (task.issueType === 'XREF_MISMATCH') {
      setDialogType('xref');
    } else {
      setDialogType('info');
    }
  };

  return (
    <div className="space-y-4 animate-fade-in h-full">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Data Correction</h1>
          <p className="text-muted-foreground mt-1">
            Governance Pool - Manage data quality issues
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

      {/* Two-column layout: 50/50 split */}
      <div className="grid grid-cols-2 gap-4 h-[calc(100vh-280px)]">

        {/* ============ Pending Correction (col-span-7) ============ */}
        <div className="flex flex-col h-full">
          <div className="bg-card rounded shadow-sm border border-input flex-1 flex flex-col overflow-hidden">
            {/* Column Header */}
            <div className="p-4 border-b border-border flex justify-between items-center bg-muted/50">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <h2 className="font-semibold text-gray-900">Pending Correction</h2>
              </div>
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
                {pendingTasks.length}
              </span>
            </div>

            {/* Filter Toggle */}
            <div className="p-4 border-b border-gray-100">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                <svg
                  className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                Filters
                {(filterEntityType !== 'all' || filterIssueType !== 'all' || filterSearch || filterFlaggedBy || filterDateFrom || filterDateTo) && (
                  <span className="w-2 h-2 bg-blue-600 rounded-full" />
                )}
              </button>

              {/* Collapsible Filter Panel */}
              {showFilters && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Entity Type */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Entity Type</label>
                    <select
                      value={filterEntityType}
                      onChange={(e) => setFilterEntityType(e.target.value)}
                      className="w-full pl-3 pr-8 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none bg-white"
                    >
                      <option value="all">All Types</option>
                      <option value="scholar">Scholar</option>
                      <option value="institution">Institution</option>
                    </select>
                  </div>

                  {/* Issue Type */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Error Type</label>
                    <select
                      value={filterIssueType}
                      onChange={(e) => setFilterIssueType(e.target.value)}
                      className="w-full pl-3 pr-8 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none bg-white"
                    >
                      <option value="all">All Error Types</option>
                      <option value="XREF_MISMATCH">XREF Mismatch</option>
                      <option value="INFO_OUTDATED">Info Outdated</option>
                      <option value="TAG_MISSING">Tag Missing</option>
                      <option value="DUPLICATE_SUSPECTED">Duplicate Suspected</option>
                    </select>
                  </div>

                  {/* Flagged By */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Flagged By</label>
                    <input
                      type="text"
                      placeholder="Enter flagger name..."
                      value={filterFlaggedBy}
                      onChange={(e) => setFilterFlaggedBy(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Search by Code or Name */}
                  <div className="lg:col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Search by Code or Name</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search by entity code or name..."
                        value={filterSearch}
                        onChange={(e) => setFilterSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Date Range */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Date Range</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        value={filterDateFrom}
                        onChange={(e) => setFilterDateFrom(e.target.value)}
                        className="w-full px-2 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                      />
                      <span className="text-gray-400 text-xs">to</span>
                      <input
                        type="date"
                        value={filterDateTo}
                        onChange={(e) => setFilterDateTo(e.target.value)}
                        className="w-full px-2 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                      />
                    </div>
                  </div>

                  {/* Filter Actions */}
                  <div className="flex items-end gap-2">
                    <button
                      onClick={() => {
                        setFilterEntityType('all');
                        setFilterIssueType('all');
                        setFilterFlaggedBy('');
                        setFilterSearch('');
                        setFilterDateFrom('');
                        setFilterDateTo('');
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Reset
                    </button>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* List Area */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {filteredPendingTasks.map((task) => (
                  <PendingCard
                    key={task.id}
                    task={task}
                    onClick={() => handleTaskClick(task)}
                  />
                ))}
                {filteredPendingTasks.length === 0 && (
                  <div className="text-center py-12 text-gray-400 text-sm">
                    No matching records found
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* ============ In Progress (col-span-5) ============ */}
        <div className="flex flex-col h-full">
          <div className="bg-card rounded shadow-sm border border-input flex-1 flex flex-col overflow-hidden">
            {/* Column Header */}
            <div className="p-4 border-b border-border flex justify-between items-center bg-muted/50">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-orange-400" />
                <h2 className="font-semibold text-gray-900">In Progress</h2>
              </div>
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
                {inProgressTasks.length}
              </span>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-gray-100">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </span>
                <input
                  type="text"
                  placeholder="Search operator..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* List Area */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {inProgressTasks.map((task) => (
                  <InProgressCard
                    key={task.id}
                    task={task}
                    onClick={() => handleTaskClick(task)}
                  />
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
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
