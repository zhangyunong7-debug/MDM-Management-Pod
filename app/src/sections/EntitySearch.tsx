import { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useAppStore, selectFilteredEntities } from '@/store/appStore';
import { cn } from '@/lib/utils';
import type { Entity, Scholar, ClassificationDef } from '@/types';
import {
  Search,
  Filter,
  Grid3X3,
  List,
  Download,
  Plus,
  MoreHorizontal,
  GraduationCap,
  Landmark,
  X,
  Check,
  Edit,
  Eye,
  FolderPlus,
  Shield,
  Briefcase,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { countries, researchAreas } from '@/data/mock';

// Sub-dimension configuration with colors
const subDimensionConfig: Record<string, {
  label: string;
  dimension: 'RISK' | 'Business Classification';
  bgClass: string;
  textClass: string;
}> = {
  COMPLIANCE: { label: 'Compliance', dimension: 'RISK', bgClass: 'bg-red-50', textClass: 'text-red-700 border-red-200' },
  INTEGRITY: { label: 'Integrity', dimension: 'RISK', bgClass: 'bg-orange-50', textClass: 'text-orange-700 border-orange-200' },
  SECURITY: { label: 'Security', dimension: 'RISK', bgClass: 'bg-amber-50', textClass: 'text-amber-700 border-amber-200' },
  REPUTATION: { label: 'Reputation', dimension: 'RISK', bgClass: 'bg-yellow-50', textClass: 'text-yellow-700 border-yellow-200' },
  COMMERCIAL: { label: 'Commercial', dimension: 'RISK', bgClass: 'bg-amber-50', textClass: 'text-amber-700 border-amber-200' },
  QUALITY: { label: 'Quality', dimension: 'Business Classification', bgClass: 'bg-blue-50', textClass: 'text-blue-700 border-blue-200' },
  VALUE: { label: 'Value', dimension: 'Business Classification', bgClass: 'bg-green-50', textClass: 'text-green-700 border-green-200' },
  PREFERENCE: { label: 'Preference', dimension: 'Business Classification', bgClass: 'bg-teal-50', textClass: 'text-teal-700 border-teal-200' },
  RANKING: { label: 'Ranking', dimension: 'Business Classification', bgClass: 'bg-indigo-50', textClass: 'text-indigo-700 border-indigo-200' },
  STRATEGIC: { label: 'Strategic', dimension: 'Business Classification', bgClass: 'bg-violet-50', textClass: 'text-violet-700 border-violet-200' },
  TYPE: { label: 'Type', dimension: 'Business Classification', bgClass: 'bg-purple-50', textClass: 'text-purple-700 border-purple-200' },
  OPTOUT: { label: 'Opt-out', dimension: 'Business Classification', bgClass: 'bg-gray-50', textClass: 'text-gray-700 border-gray-200' },
};

function TagBadge({ def, className }: { def: ClassificationDef; className?: string }) {
  const config = subDimensionConfig[def.subDimension] || { textClass: 'text-gray-700 border-gray-200', dimension: def.dimension };
  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border',
      config.textClass,
      className
    )}>
      {def.dimension === 'RISK' ? <Shield className="h-3 w-3" /> : <Briefcase className="h-3 w-3" />}
      {def.classDisplayName}
    </span>
  );
}

function EntityTypeBadge({ type }: { type: 'scholar' | 'institution' }) {
  if (type === 'scholar') {
    return (
      <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
        <GraduationCap className="h-3 w-3 mr-1" />
        Scholar
      </Badge>
    );
  }
  return (
    <Badge variant="secondary" className="bg-purple-50 text-purple-700 border-purple-200">
      <Landmark className="h-3 w-3 mr-1" />
      Institution
    </Badge>
  );
}

function formatRelativeTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  
  if (hours < 1) return 'Just now';
  if (hours === 1) return '1 hour ago';
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return '1 day ago';
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString();
}

function TableView({ 
  entities, 
  selectedIds, 
  onSelectId, 
  onSelectAll 
}: { 
  entities: Entity[];
  selectedIds: string[];
  onSelectId: (id: string) => void;
  onSelectAll: () => void;
}) {
  const { setSelectedEntity, setEntityDrawerOpen, setCurrentPage, scholarClassDefs, institutionClassDefs } = useAppStore();
  const allClassDefs = [...scholarClassDefs, ...institutionClassDefs];

  const allSelected = entities.length > 0 && selectedIds.length === entities.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < entities.length;

  const handleViewDetails = (entity: Entity) => {
    setSelectedEntity(entity);
    setEntityDrawerOpen(true);
  };

  return (
    <div className="rounded border overflow-hidden">
      <table className="w-full">
        <thead className="bg-muted/50">
          <tr>
            <th className="w-10 px-4 py-3">
              <Checkbox
                checked={allSelected}
                ref={(ref) => {
                  if (ref) {
                    (ref as HTMLInputElement).indeterminate = someSelected;
                  }
                }}
                onCheckedChange={onSelectAll}
              />
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Entity ID
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Type
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Tags
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Last Updated
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border [&_tr:nth-child(even)]:bg-muted/30">
          {entities.map((entity) => (
            <tr 
              key={entity.id} 
              className={cn(
                'hover:bg-muted/50 transition-colors',
                selectedIds.includes(entity.id) && 'bg-primary/5'
              )}
            >
              <td className="px-4 py-3">
                <Checkbox 
                  checked={selectedIds.includes(entity.id)}
                  onCheckedChange={() => onSelectId(entity.id)}
                />
              </td>
              <td className="px-4 py-3">
                <code className="text-xs font-mono text-muted-foreground">{entity.id}</code>
              </td>
              <td className="px-4 py-3">
                <span className="font-medium text-sm">{entity.name}</span>
              </td>
              <td className="px-4 py-3">
                <EntityTypeBadge type={entity.type} />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1 flex-wrap">
                  {entity.tags.slice(0, 3).map((tagId) => {
                    const def = allClassDefs.find((d) => d.id === tagId);
                    return def ? <TagBadge key={tagId} def={def} /> : null;
                  })}
                  {entity.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{entity.tags.length - 3}
                    </Badge>
                  )}
                </div>
              </td>
              <td className="px-4 py-3">
                <span className="text-sm text-muted-foreground">
                  {formatRelativeTime(entity.lastUpdated)}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewDetails(entity)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setCurrentPage('create')}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FolderPlus className="mr-2 h-4 w-4" />
                      Add to Governance Pool
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CardView({ 
  entities, 
  selectedIds, 
  onSelectId 
}: { 
  entities: Entity[];
  selectedIds: string[];
  onSelectId: (id: string) => void;
}) {
  const { setSelectedEntity, setEntityDrawerOpen, setCurrentPage, scholarClassDefs, institutionClassDefs } = useAppStore();
  const allClassDefs = [...scholarClassDefs, ...institutionClassDefs];

  const handleViewDetails = (entity: Entity) => {
    setSelectedEntity(entity);
    setEntityDrawerOpen(true);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {entities.map((entity) => (
        <Card 
          key={entity.id} 
          className={cn(
            'cursor-pointer transition-all duration-200 hover:shadow-md',
            selectedIds.includes(entity.id) && 'ring-2 ring-primary'
          )}
          onClick={() => onSelectId(entity.id)}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className={cn(
                'w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold',
                entity.type === 'scholar' ? 'bg-blue-500' : 'bg-purple-500'
              )}>
                {entity.type === 'scholar' ? (
                  <GraduationCap className="h-6 w-6" />
                ) : (
                  <Landmark className="h-6 w-6" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-sm truncate">{entity.name}</h3>
                    <code className="text-xs font-mono text-muted-foreground">{entity.id}</code>
                  </div>
                  <Checkbox 
                    checked={selectedIds.includes(entity.id)}
                    onCheckedChange={() => onSelectId(entity.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <div className="mt-2">
                  <EntityTypeBadge type={entity.type} />
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  {entity.tags.map((tagId) => {
                    const def = allClassDefs.find((d) => d.id === tagId);
                    return def ? <TagBadge key={tagId} def={def} /> : null;
                  })}
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Updated {formatRelativeTime(entity.lastUpdated)}
                  </span>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 px-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(entity);
                      }}
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 px-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentPage('create');
                      }}
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ScholarTableView({
  scholars,
  selectedIds,
  onSelectId,
  onSelectAll,
}: {
  scholars: Scholar[];
  selectedIds: string[];
  onSelectId: (id: string) => void;
  onSelectAll: () => void;
}) {
  const { setSelectedEntity, setEntityDrawerOpen, scholarClassDefs, institutionClassDefs } = useAppStore();
  const allClassDefs = [...scholarClassDefs, ...institutionClassDefs];

  const allSelected = scholars.length > 0 && selectedIds.length === scholars.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < scholars.length;

  const handleViewDetails = (scholar: Scholar) => {
    setSelectedEntity(scholar);
    setEntityDrawerOpen(true);
  };

  return (
    <div className="rounded border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="w-10 px-4 py-3">
                <Checkbox
                  checked={allSelected}
                  ref={(ref) => {
                    if (ref) {
                      (ref as HTMLInputElement).indeterminate = someSelected;
                    }
                  }}
                  onCheckedChange={onSelectAll}
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                Entity Code
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                Native Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                Primary Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                Institution
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                Tags
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                Status
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border [&_tr:nth-child(even)]:bg-muted/30">
            {scholars.map((scholar) => (
              <tr
                key={scholar.id}
                className={cn(
                  'hover:bg-muted/50 transition-colors',
                  selectedIds.includes(scholar.id) && 'bg-primary/5'
                )}
              >
                <td className="px-4 py-3">
                  <Checkbox
                    checked={selectedIds.includes(scholar.id)}
                    onCheckedChange={() => onSelectId(scholar.id)}
                  />
                </td>
                <td className="px-4 py-3">
                  <code className="text-xs font-mono text-muted-foreground">
                    {scholar.globalScholarCode || scholar.id}
                  </code>
                </td>
                <td className="px-4 py-3">
                  <span className="font-semibold text-sm">
                    {scholar.lastName}{scholar.lastName && scholar.firstName ? ' ' : ''}{scholar.firstName}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-muted-foreground">
                    {scholar.nativeName || '—'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <a href={`mailto:${scholar.email}`} className="text-sm text-primary hover:underline">
                    {scholar.email}
                  </a>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm">{scholar.currentAffiliation || '—'}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 flex-wrap max-w-[200px]">
                    {scholar.tags.slice(0, 2).map((tagId) => {
                      const def = allClassDefs.find((d) => d.id === tagId);
                      return def ? <TagBadge key={tagId} def={def} /> : null;
                    })}
                    {scholar.tags.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{scholar.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge
                    variant="outline"
                    className={cn(
                      'text-xs',
                      scholar.status === 'active'
                        ? 'text-green-700 border-green-200 bg-green-50'
                        : 'text-orange-700 border-orange-200 bg-orange-50'
                    )}
                  >
                    {scholar.status === 'active' ? 'Active' : 'PENDING_REVIEW'}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleViewDetails(scholar)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function EntitySearch() {
  const {
    searchFilters,
    setSearchFilters,
    clearSearchFilters,
    viewMode,
    setViewMode,
    setCurrentPage,
    addToast,
    scholarClassDefs,
    institutionClassDefs,
  } = useAppStore();

  // Combine all classification definitions for filtering
  const allClassDefs = [...scholarClassDefs, ...institutionClassDefs];
  
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [localQuery, setLocalQuery] = useState(searchFilters.query);

  const filteredEntities = useAppStore(useShallow(selectFilteredEntities));

  const handleSearch = () => {
    setSearchFilters({ query: localQuery });
  };

  const handleClearFilters = () => {
    clearSearchFilters();
    setLocalQuery('');
  };

  const toggleSelectId = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredEntities.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredEntities.map((e: Entity) => e.id));
    }
  };

  const handleExport = () => {
    addToast({
      type: 'success',
      title: 'Export Started',
      message: `Exporting ${selectedIds.length > 0 ? selectedIds.length : filteredEntities.length} entities...`,
    });
  };

  const handleBulkAddToPool = () => {
    addToast({
      type: 'success',
      title: 'Added to Governance Pool',
      message: `${selectedIds.length} entities added for correction`,
    });
    setSelectedIds([]);
  };

  const activeFiltersCount =
    searchFilters.tags.length +
    searchFilters.countries.length +
    searchFilters.researchAreas.length;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Entity Search</h1>
          <p className="text-muted-foreground mt-1">
            Search and manage scholars and institutions
          </p>
        </div>
        <Button onClick={() => setCurrentPage('create')}>
          <Plus className="mr-2 h-4 w-4" />
          New Entity
        </Button>
      </div>

      {/* Entity Type Switch */}
      <div className="flex items-center gap-3 bg-muted/50 rounded-lg px-4 py-2.5 w-fit border border-border">
        <Landmark className={cn('h-4 w-4 transition-colors', searchFilters.entityType !== 'scholar' ? 'text-purple-600' : 'text-muted-foreground')} />
        <span className={cn('text-sm font-medium transition-colors', searchFilters.entityType !== 'scholar' ? 'text-foreground' : 'text-muted-foreground')}>
          Institution
        </span>
        <Switch
          checked={searchFilters.entityType === 'scholar'}
          onCheckedChange={(checked) => setSearchFilters({ entityType: checked ? 'scholar' : 'institution' })}
        />
        <span className={cn('text-sm font-medium transition-colors', searchFilters.entityType === 'scholar' ? 'text-foreground' : 'text-muted-foreground')}>
          Scholar
        </span>
        <GraduationCap className={cn('h-4 w-4 transition-colors', searchFilters.entityType === 'scholar' ? 'text-blue-600' : 'text-muted-foreground')} />
      </div>

      {/* Search & Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, ID, or keyword..."
                  className="pl-10"
                  value={localQuery}
                  onChange={(e) => setLocalQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch}>Search</Button>
            </div>

            {/* Filter Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="ml-1">{activeFiltersCount}</Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <div className="p-3 border-b border-border">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Filters</h3>
                    {activeFiltersCount > 0 && (
                      <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                        Clear All
                      </Button>
                    )}
                  </div>
                </div>
                <ScrollArea className="h-[400px]">
                  <Accordion type="multiple" className="w-full">
                    {/* Entity Type */}
                    <AccordionItem value="type">
                      <AccordionTrigger className="px-4 py-3">Entity Type</AccordionTrigger>
                      <AccordionContent className="px-4 pb-3">
                        <div className="space-y-2">
                          {[
                            { id: 'all', label: 'All Entities' },
                            { id: 'scholar', label: 'Scholars' },
                            { id: 'institution', label: 'Institutions' },
                          ].map((type) => (
                            <label key={type.id} className="flex items-center gap-2 cursor-pointer">
                              <Checkbox 
                                checked={searchFilters.entityType === type.id}
                                onCheckedChange={() => setSearchFilters({ entityType: type.id as any })}
                              />
                              <span className="text-sm">{type.label}</span>
                            </label>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Classification Tags */}
                    <AccordionItem value="tags">
                      <AccordionTrigger className="px-4 py-3">Classification Tags</AccordionTrigger>
                      <AccordionContent className="px-4 pb-3">
                        <div className="space-y-4">
                          {/* RISK Dimension */}
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Shield className="h-4 w-4 text-red-500" />
                              <p className="text-xs font-medium text-red-600 uppercase tracking-wider">
                                Risk Tags
                              </p>
                            </div>
                            <div className="space-y-1">
                              {allClassDefs
                                .filter((def) => def.dimension === 'RISK')
                                .map((def) => (
                                  <label key={def.id} className="flex items-center gap-2 cursor-pointer">
                                    <Checkbox
                                      checked={searchFilters.tags.includes(String(def.id))}
                                      onCheckedChange={(checked) => {
                                        if (checked) {
                                          setSearchFilters({ tags: [...searchFilters.tags, String(def.id)] });
                                        } else {
                                          setSearchFilters({
                                            tags: searchFilters.tags.filter((id: string) => id !== String(def.id))
                                          });
                                        }
                                      }}
                                    />
                                    <span className="text-sm">{def.classDisplayName}</span>
                                    <Badge variant="outline" className="text-xs ml-auto">
                                      {def.subDimension}
                                    </Badge>
                                  </label>
                                ))}
                            </div>
                          </div>
                          {/* Business Dimension */}
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Briefcase className="h-4 w-4 text-blue-500" />
                              <p className="text-xs font-medium text-blue-600 uppercase tracking-wider">
                                Business Tags
                              </p>
                            </div>
                            <div className="space-y-1">
                              {allClassDefs
                                .filter((def) => def.dimension === 'Business Classification')
                                .map((def) => (
                                  <label key={def.id} className="flex items-center gap-2 cursor-pointer">
                                    <Checkbox
                                      checked={searchFilters.tags.includes(String(def.id))}
                                      onCheckedChange={(checked) => {
                                        if (checked) {
                                          setSearchFilters({ tags: [...searchFilters.tags, String(def.id)] });
                                        } else {
                                          setSearchFilters({
                                            tags: searchFilters.tags.filter((id: string) => id !== String(def.id))
                                          });
                                        }
                                      }}
                                    />
                                    <span className="text-sm">{def.classDisplayName}</span>
                                    <Badge variant="outline" className="text-xs ml-auto">
                                      {def.subDimension}
                                    </Badge>
                                  </label>
                                ))}
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Countries */}
                    <AccordionItem value="countries">
                      <AccordionTrigger className="px-4 py-3">Countries</AccordionTrigger>
                      <AccordionContent className="px-4 pb-3">
                        <div className="space-y-2">
                          {countries.map((country) => (
                            <label key={country} className="flex items-center gap-2 cursor-pointer">
                              <Checkbox 
                                checked={searchFilters.countries.includes(country)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSearchFilters({ countries: [...searchFilters.countries, country] });
                                  } else {
                                    setSearchFilters({ 
                                      countries: searchFilters.countries.filter((c: string) => c !== country) 
                                    });
                                  }
                                }}
                              />
                              <span className="text-sm">{country}</span>
                            </label>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Research Areas */}
                    <AccordionItem value="research">
                      <AccordionTrigger className="px-4 py-3">Research Areas</AccordionTrigger>
                      <AccordionContent className="px-4 pb-3">
                        <div className="space-y-2">
                          {researchAreas.map((area) => (
                            <label key={area} className="flex items-center gap-2 cursor-pointer">
                              <Checkbox 
                                checked={searchFilters.researchAreas.includes(area)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSearchFilters({ researchAreas: [...searchFilters.researchAreas, area] });
                                  } else {
                                    setSearchFilters({ 
                                      researchAreas: searchFilters.researchAreas.filter((a: string) => a !== area) 
                                    });
                                  }
                                }}
                              />
                              <span className="text-sm">{area}</span>
                            </label>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </ScrollArea>
              </PopoverContent>
            </Popover>

            {/* View Mode Toggle */}
            <div className="flex items-center border rounded-lg p-1">
              <Button
                variant={viewMode === 'table' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-8"
                onClick={() => setViewMode('table')}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'card' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-8"
                onClick={() => setViewMode('card')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Active Filters */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-border">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {searchFilters.tags.map((tagId: string) => {
                const def = allClassDefs.find((d) => String(d.id) === tagId);
                if (!def) return null;
                return (
                  <Badge key={tagId} variant="secondary" className="gap-1">
                    {def.classDisplayName}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => setSearchFilters({
                        tags: searchFilters.tags.filter((id: string) => id !== tagId)
                      })}
                    />
                  </Badge>
                );
              })}
              {searchFilters.countries.map((country: string) => (
                <Badge key={country} variant="secondary" className="gap-1">
                  {country}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => setSearchFilters({ 
                      countries: searchFilters.countries.filter((c: string) => c !== country) 
                    })}
                  />
                </Badge>
              ))}
              <Button variant="ghost" size="sm" className="h-6" onClick={handleClearFilters}>
                Clear all
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/20">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">
              {selectedIds.length} entity{selectedIds.length > 1 ? 'ies' : 'y'} selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button size="sm" onClick={handleBulkAddToPool}>
              <FolderPlus className="mr-2 h-4 w-4" />
              Add to Governance Pool
            </Button>
          </div>
        </div>
      )}

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-muted-foreground">
            Showing {filteredEntities.length} result{filteredEntities.length !== 1 ? 's' : ''}
          </p>
        </div>

        {filteredEntities.length === 0 ? (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">No entities found</h3>
            <p className="text-muted-foreground mt-1">
              Try adjusting your search or filters
            </p>
            <Button variant="outline" className="mt-4" onClick={handleClearFilters}>
              Clear Filters
            </Button>
          </div>
        ) : viewMode === 'table' && searchFilters.entityType === 'scholar' ? (
          <ScholarTableView
            scholars={filteredEntities as Scholar[]}
            selectedIds={selectedIds}
            onSelectId={toggleSelectId}
            onSelectAll={toggleSelectAll}
          />
        ) : viewMode === 'table' ? (
          <TableView 
            entities={filteredEntities}
            selectedIds={selectedIds}
            onSelectId={toggleSelectId}
            onSelectAll={toggleSelectAll}
          />
        ) : (
          <CardView 
            entities={filteredEntities}
            selectedIds={selectedIds}
            onSelectId={toggleSelectId}
          />
        )}
      </div>
    </div>
  );
}
