import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/appStore';
import { cn } from '@/lib/utils';
import type { Scholar, Institution, Tag, ClassificationDef, TagExtensionValue, ExtSchemaEnum } from '@/types';
import {
  Save,
  Send,
  X,
  Upload,
  Download,
  Check,
  GraduationCap,
  Landmark,
  User,
  Mail,
  Globe,
  MapPin,
  Calendar,
  Award,
  BookOpen,
  Search,
  Tag as TagIcon,
  Shield,
  AlertTriangle,
  Star,
  Briefcase,
  Target,
  TrendingUp,
  Layers,
  Flag,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockTags, countries, researchAreas, degrees, institutionTypes, mockInstitutions } from '@/data/mock';

// Sub-dimension configuration with icons and colors
const subDimensionConfig: Record<string, {
  label: string;
  icon: React.ElementType;
  dimension: 'RISK' | 'Business Classification';
  colorClass: string;
  bgClass: string;
  borderClass: string;
}> = {
  // Risk sub-dimensions
  COMPLIANCE: { label: 'Compliance', icon: Shield, dimension: 'RISK', colorClass: 'text-red-600', bgClass: 'bg-red-50', borderClass: 'border-red-200' },
  INTEGRITY: { label: 'Integrity', icon: AlertTriangle, dimension: 'RISK', colorClass: 'text-orange-600', bgClass: 'bg-orange-50', borderClass: 'border-orange-200' },
  SECURITY: { label: 'Security', icon: Shield, dimension: 'RISK', colorClass: 'text-amber-600', bgClass: 'bg-amber-50', borderClass: 'border-amber-200' },
  REPUTATION: { label: 'Reputation', icon: Star, dimension: 'RISK', colorClass: 'text-yellow-600', bgClass: 'bg-yellow-50', borderClass: 'border-yellow-200' },
  COMMERCIAL: { label: 'Commercial', icon: Briefcase, dimension: 'RISK', colorClass: 'text-amber-700', bgClass: 'bg-amber-50', borderClass: 'border-amber-200' },
  // Business sub-dimensions
  QUALITY: { label: 'Quality', icon: Star, dimension: 'Business Classification', colorClass: 'text-blue-600', bgClass: 'bg-blue-50', borderClass: 'border-blue-200' },
  VALUE: { label: 'Value', icon: TrendingUp, dimension: 'Business Classification', colorClass: 'text-green-600', bgClass: 'bg-green-50', borderClass: 'border-green-200' },
  PREFERENCE: { label: 'Preference', icon: Target, dimension: 'Business Classification', colorClass: 'text-teal-600', bgClass: 'bg-teal-50', borderClass: 'border-teal-200' },
  RANKING: { label: 'Ranking', icon: TrendingUp, dimension: 'Business Classification', colorClass: 'text-indigo-600', bgClass: 'bg-indigo-50', borderClass: 'border-indigo-200' },
  STRATEGIC: { label: 'Strategic', icon: Target, dimension: 'Business Classification', colorClass: 'text-violet-600', bgClass: 'bg-violet-50', borderClass: 'border-violet-200' },
  TYPE: { label: 'Type', icon: Layers, dimension: 'Business Classification', colorClass: 'text-purple-600', bgClass: 'bg-purple-50', borderClass: 'border-purple-200' },
  OPTOUT: { label: 'Opt-out', icon: Flag, dimension: 'Business Classification', colorClass: 'text-gray-600', bgClass: 'bg-gray-50', borderClass: 'border-gray-200' },
};

// Extension value types
interface AssignedTag {
  tagId: number;
  tagCode: string;
  tagName: string;
  subDimension: string;
  extValue?: TagExtensionValue;
}

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  hint?: string;
}

function FormField({ label, required, error, children, hint }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-1">
        {label}
        {required && <span className="text-rose-500">*</span>}
      </Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="text-xs text-rose-500">{error}</p>}
    </div>
  );
}

// Render extension input based on schema type
function renderExtInput(
  def: ClassificationDef,
  value: TagExtensionValue | undefined,
  onChange: (val: TagExtensionValue) => void
) {
  if (def.extSchema.type === 'boolean') {
    return (
      <div className="flex items-center gap-2">
        <Checkbox
          checked={value?.booleanValue || false}
          onCheckedChange={(checked) => onChange({ booleanValue: !!checked })}
        />
        <Label className="text-sm">Enabled</Label>
      </div>
    );
  }

  if (def.extSchema.type === 'enum') {
    const enumSchema = def.extSchema as ExtSchemaEnum;
    return (
      <Select
        value={value?.enumValue || ''}
        onValueChange={(v) => onChange({ enumValue: v })}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select value" />
        </SelectTrigger>
        <SelectContent>
          {enumSchema.values.map((v) => (
            <SelectItem key={v} value={v}>
              {v}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  if (def.extSchema.type === 'integer') {
    return (
      <Input
        type="number"
        value={value?.intValue || ''}
        onChange={(e) => onChange({ intValue: parseInt(e.target.value) })}
        min={def.extSchema.min}
        max={def.extSchema.max}
        placeholder={`${def.extSchema.min} - ${def.extSchema.max}`}
      />
    );
  }

  if (def.extSchema.type === 'date_period') {
    return (
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs">Start Date</Label>
          <Input
            type="date"
            value={value?.startDate || ''}
            onChange={(e) => onChange({ ...value, startDate: e.target.value })}
          />
        </div>
        <div>
          <Label className="text-xs">End Date</Label>
          <Input
            type="date"
            value={value?.endDate || ''}
            onChange={(e) => onChange({ ...value, endDate: e.target.value })}
          />
        </div>
      </div>
    );
  }

  return null;
}

// Assign Tag Component - groups by sub_dimension
function AssignTagSelector({
  entityType,
  assignedTags,
  onChange,
  classDefs,
}: {
  entityType: 'scholar' | 'institution';
  assignedTags: AssignedTag[];
  onChange: (tags: AssignedTag[]) => void;
  classDefs: ClassificationDef[];
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDefIds, setSelectedDefIds] = useState<number[]>([]);
  const [extValues, setExtValues] = useState<Record<number, TagExtensionValue>>({});
  const [searchQuery, setSearchQuery] = useState('');

  // Group classDefs by sub_dimension
  const groupedBySubDimension = classDefs.reduce((acc, def) => {
    if (!acc[def.subDimension]) {
      acc[def.subDimension] = [];
    }
    acc[def.subDimension].push(def);
    return acc;
  }, {} as Record<string, ClassificationDef[]>);

  // Filter by search query
  const filteredGroupedDefs = Object.entries(groupedBySubDimension).reduce((acc, [subDim, defs]) => {
    const filtered = defs.filter((def) => {
      const matchesSearch =
        def.classDisplayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        def.classCode.toLowerCase().includes(searchQuery.toLowerCase());
      const notAssigned = !assignedTags.some((t) => t.tagId === def.id);
      return matchesSearch && notAssigned;
    });
    if (filtered.length > 0) {
      acc[subDim] = filtered;
    }
    return acc;
  }, {} as Record<string, ClassificationDef[]>);

  const handleTagToggle = (defId: number) => {
    setSelectedDefIds((prev) =>
      prev.includes(defId) ? prev.filter((id) => id !== defId) : [...prev, defId]
    );
  };

  const handleExtValueChange = (defId: number, value: TagExtensionValue) => {
    setExtValues((prev) => ({ ...prev, [defId]: value }));
  };

  const handleAssign = () => {
    const newTags: AssignedTag[] = selectedDefIds.map((defId) => {
      const def = classDefs.find((d) => d.id === defId)!;
      return {
        tagId: def.id,
        tagCode: def.classCode,
        tagName: def.classDisplayName,
        subDimension: def.subDimension,
        extValue: extValues[defId],
      };
    });

    onChange([...assignedTags, ...newTags]);
    setSelectedDefIds([]);
    setExtValues({});
    setIsDialogOpen(false);
  };

  const handleRemoveTag = (tagId: number) => {
    onChange(assignedTags.filter((t) => t.tagId !== tagId));
  };

  // Separate by dimension for display
  const riskTags = assignedTags.filter((t) => {
    const def = classDefs.find((d) => d.id === t.tagId);
    return def?.dimension === 'RISK';
  });
  const businessTags = assignedTags.filter((t) => {
    const def = classDefs.find((d) => d.id === t.tagId);
    return def?.dimension === 'Business Classification';
  });

  return (
    <>
      <div className="space-y-4">
        {/* Display Assigned Tags by Dimension */}
        <div className="space-y-3">
          {/* RISK Tags */}
          {riskTags.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium text-red-600">Risk Tags</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {riskTags.map((tag) => (
                  <div
                    key={tag.tagId}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm bg-red-50 border border-red-200"
                  >
                    <span className="text-red-700">{tag.tagName}</span>
                    {tag.extValue && (
                      <span className="text-xs text-red-500 ml-1">
                        {tag.extValue.booleanValue !== undefined
                          ? tag.extValue.booleanValue.toString()
                          : tag.extValue.enumValue || tag.extValue.intValue?.toString() || ''}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag.tagId)}
                      className="ml-1 hover:bg-red-100 rounded"
                    >
                      <X className="h-3 w-3 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Business Tags */}
          {businessTags.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium text-blue-600">Business Tags</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {businessTags.map((tag) => (
                  <div
                    key={tag.tagId}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm bg-blue-50 border border-blue-200"
                  >
                    <span className="text-blue-700">{tag.tagName}</span>
                    {tag.extValue && (
                      <span className="text-xs text-blue-500 ml-1">
                        {tag.extValue.booleanValue !== undefined
                          ? tag.extValue.booleanValue.toString()
                          : tag.extValue.enumValue || tag.extValue.intValue?.toString() || ''}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag.tagId)}
                      className="ml-1 hover:bg-blue-100 rounded"
                    >
                      <X className="h-3 w-3 text-blue-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {assignedTags.length === 0 && (
            <p className="text-sm text-muted-foreground">No tags assigned yet</p>
          )}
        </div>

        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(true)}>
          <TagIcon className="mr-2 h-4 w-4" />
          Assign Tags
        </Button>
      </div>

      {/* Assign Tag Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Assign Tags to {entityType === 'scholar' ? 'Scholar' : 'Institution'}</DialogTitle>
            <DialogDescription>
              Select tags to assign. Tags are grouped by sub-dimension with different colors for Risk vs Business tags.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 min-h-0 flex flex-col">
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search available tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>

            {/* Tags grouped by sub-dimension */}
            <ScrollArea className="flex-1">
              <div className="space-y-4 pr-4">
                {Object.entries(filteredGroupedDefs).map(([subDim, defs]) => {
                  const config = subDimensionConfig[subDim] || {
                    label: subDim,
                    icon: TagIcon,
                    dimension: 'Business Classification' as const,
                    colorClass: 'text-gray-600',
                    bgClass: 'bg-gray-50',
                    borderClass: 'border-gray-200',
                  };
                  const Icon = config.icon;

                  return (
                    <div key={subDim} className={cn('rounded-lg p-3', config.bgClass, config.borderClass)}>
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className={cn('h-4 w-4', config.colorClass)} />
                        <span className={cn('text-sm font-medium', config.colorClass)}>
                          {config.label}
                        </span>
                        <Badge variant="outline" className="text-xs ml-auto">
                          {config.dimension}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {defs.map((def) => (
                          <div
                            key={def.id}
                            className={cn(
                              'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border transition-colors cursor-pointer',
                              selectedDefIds.includes(def.id)
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'bg-white hover:bg-muted border-border'
                            )}
                            onClick={() => handleTagToggle(def.id)}
                          >
                            {selectedDefIds.includes(def.id) && <Check className="h-3 w-3" />}
                            <span>{def.classDisplayName}</span>
                          </div>
                        ))}
                      </div>

                      {/* Extension inputs for selected tags in this sub-dimension */}
                      {selectedDefIds.some((id) => defs.some((d) => d.id === id)) && (
                        <div className="mt-3 pt-3 border-t border-border space-y-3">
                          {defs
                            .filter((def) => selectedDefIds.includes(def.id))
                            .map((def) => (
                              <div key={def.id} className="bg-white rounded-lg p-3">
                                <Label className="text-xs text-muted-foreground mb-1 block">
                                  {def.classDisplayName} - {def.extAttr}
                                </Label>
                                {renderExtInput(def, extValues[def.id], (val) =>
                                  handleExtValueChange(def.id, val)
                                )}
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                {Object.keys(filteredGroupedDefs).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No available tags found
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssign} disabled={selectedDefIds.length === 0}>
              Assign {selectedDefIds.length} Tag(s)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function ScholarForm({
  data,
  onChange,
  errors,
  assignedTags,
  onAssignedTagsChange,
  classDefs,
}: {
  data: Partial<Scholar>;
  onChange: (data: Partial<Scholar>) => void;
  errors: Record<string, string>;
  assignedTags: AssignedTag[];
  onAssignedTagsChange: (tags: AssignedTag[]) => void;
  classDefs: ClassificationDef[];
}) {
  const updateField = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="form-section">
        <h3 className="form-section-title flex items-center gap-2">
          <User className="h-4 w-4" />
          Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormField label="Full Name" required error={errors.fullName}>
            <Input
              value={data.name || ''}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="e.g., Dr. Elena Vance"
            />
          </FormField>

          <FormField label="Official Email" required error={errors.email}>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                className="pl-10"
                value={data.email || ''}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="e.g., name@institution.edu"
              />
            </div>
          </FormField>

          <FormField label="ORCID iD" hint="Format: 0000-0000-0000-0000">
            <Input
              value={data.orcid || ''}
              onChange={(e) => updateField('orcid', e.target.value)}
              placeholder="0000-0000-0000-0000"
            />
          </FormField>

          <FormField label="Nationality">
            <Select
              value={data.nationality}
              onValueChange={(value) => updateField('nationality', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>{country}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField label="Current Affiliation">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Select
                value={data.currentAffiliationId}
                onValueChange={(value) => {
                  const inst = mockInstitutions.find((i) => i.id === value);
                  updateField('currentAffiliationId', value);
                  updateField('currentAffiliation', inst?.name);
                }}
              >
                <SelectTrigger className="pl-10">
                  <SelectValue placeholder="Search institution..." />
                </SelectTrigger>
                <SelectContent>
                  {mockInstitutions.map((inst) => (
                    <SelectItem key={inst.id} value={inst.id}>{inst.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </FormField>
        </div>
      </div>

      {/* Academic Profile */}
      <div className="form-section">
        <h3 className="form-section-title flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          Academic Profile
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormField label="Primary Research Area" required>
            <Select
              value={data.researchAreas?.[0]}
              onValueChange={(value) => updateField('researchAreas', [value])}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select primary area" />
              </SelectTrigger>
              <SelectContent>
                {researchAreas.map((area) => (
                  <SelectItem key={area} value={area}>{area}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField label="Highest Degree">
            <Select
              value={data.highestDegree}
              onValueChange={(value) => updateField('highestDegree', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select degree" />
              </SelectTrigger>
              <SelectContent>
                {degrees.map((degree) => (
                  <SelectItem key={degree} value={degree}>{degree}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField label="Year of PhD Completion">
            <Input
              type="number"
              min={1900}
              max={2024}
              value={data.phdYear || ''}
              onChange={(e) => updateField('phdYear', parseInt(e.target.value))}
              placeholder="e.g., 2005"
            />
          </FormField>
        </div>
      </div>

      {/* Assign Tags */}
      <div className="form-section">
        <h3 className="form-section-title flex items-center gap-2">
          <TagIcon className="h-4 w-4" />
          Assign Tags
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Assign classification tags to this scholar. Tags are grouped by sub-dimension with different colors for Risk vs Business tags.
        </p>
        <AssignTagSelector
          entityType="scholar"
          assignedTags={assignedTags}
          onChange={onAssignedTagsChange}
          classDefs={classDefs}
        />
      </div>

      {/* Biography */}
      <div>
        <h3 className="form-section-title">Biography</h3>
        <FormField label="" hint="Maximum 500 characters">
          <Textarea
            value={data.biography || ''}
            onChange={(e) => updateField('biography', e.target.value)}
            placeholder="Brief biography..."
            maxLength={500}
            rows={4}
          />
          <p className="text-xs text-muted-foreground text-right mt-1">
            {(data.biography?.length || 0)}/500
          </p>
        </FormField>
      </div>
    </div>
  );
}

function InstitutionForm({
  data,
  onChange,
  errors,
  assignedTags,
  onAssignedTagsChange,
  classDefs,
}: {
  data: Partial<Institution>;
  onChange: (data: Partial<Institution>) => void;
  errors: Record<string, string>;
  assignedTags: AssignedTag[];
  onAssignedTagsChange: (tags: AssignedTag[]) => void;
  classDefs: ClassificationDef[];
}) {
  const updateField = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="form-section">
        <h3 className="form-section-title flex items-center gap-2">
          <Landmark className="h-4 w-4" />
          Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormField label="Official Name" required error={errors.name}>
            <Input
              value={data.name || ''}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="e.g., Massachusetts Institute of Technology"
            />
          </FormField>

          <FormField label="Short Name/Acronym" hint="e.g., MIT, CAS">
            <Input
              value={data.shortName || ''}
              onChange={(e) => updateField('shortName', e.target.value)}
              placeholder="e.g., MIT"
            />
          </FormField>

          <FormField label="Official Website">
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="url"
                className="pl-10"
                value={data.website || ''}
                onChange={(e) => updateField('website', e.target.value)}
                placeholder="https://..."
              />
            </div>
          </FormField>

          <FormField label="Institution Type">
            <Select
              value={data.institutionType}
              onValueChange={(value) => updateField('institutionType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {institutionTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        </div>
      </div>

      {/* Geographic Information */}
      <div className="form-section">
        <h3 className="form-section-title flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Geographic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormField label="Country/Region" required error={errors.country}>
            <Select
              value={data.country}
              onValueChange={(value) => updateField('country', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>{country}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField label="City" required error={errors.city}>
            <Input
              value={data.city || ''}
              onChange={(e) => updateField('city', e.target.value)}
              placeholder="e.g., Cambridge"
            />
          </FormField>

          <FormField label="Street Address">
            <Input
              value={data.address || ''}
              onChange={(e) => updateField('address', e.target.value)}
              placeholder="Street address"
            />
          </FormField>

          <FormField label="Postal Code">
            <Input
              value={data.postalCode || ''}
              onChange={(e) => updateField('postalCode', e.target.value)}
              placeholder="e.g., 02139"
            />
          </FormField>

          <FormField label="Coordinates" hint="Optional - lat, long">
            <div className="flex gap-2">
              <Input
                placeholder="Latitude"
                value={data.coordinates?.lat || ''}
                onChange={(e) => updateField('coordinates', {
                  ...data.coordinates,
                  lat: parseFloat(e.target.value)
                })}
              />
              <Input
                placeholder="Longitude"
                value={data.coordinates?.lng || ''}
                onChange={(e) => updateField('coordinates', {
                  ...data.coordinates,
                  lng: parseFloat(e.target.value)
                })}
              />
            </div>
          </FormField>
        </div>
      </div>

      {/* Academic Profile */}
      <div className="form-section">
        <h3 className="form-section-title flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Academic Profile
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormField label="Established Year">
            <Input
              type="number"
              min={1000}
              max={2024}
              value={data.establishedYear || ''}
              onChange={(e) => updateField('establishedYear', parseInt(e.target.value))}
              placeholder="e.g., 1861"
            />
          </FormField>

          <FormField label="Total Faculty Count">
            <Input
              type="number"
              value={data.totalFaculty || ''}
              onChange={(e) => updateField('totalFaculty', parseInt(e.target.value))}
              placeholder="e.g., 12000"
            />
          </FormField>
        </div>
      </div>

      {/* Assign Tags */}
      <div className="form-section">
        <h3 className="form-section-title flex items-center gap-2">
          <TagIcon className="h-4 w-4" />
          Assign Tags
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Assign classification tags to this institution. Tags are grouped by sub-dimension with different colors for Risk vs Business tags.
        </p>
        <AssignTagSelector
          entityType="institution"
          assignedTags={assignedTags}
          onChange={onAssignedTagsChange}
          classDefs={classDefs}
        />
      </div>
    </div>
  );
}

export function CreateEntity() {
  const {
    setDraftEntity,
    addToast,
    setCurrentPage,
    scholarClassDefs,
    institutionClassDefs,
  } = useAppStore();

  const [entityType, setEntityType] = useState<'scholar' | 'institution'>('scholar');
  const [scholarData, setScholarData] = useState<Partial<Scholar>>({});
  const [institutionData, setInstitutionData] = useState<Partial<Institution>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [scholarAssignedTags, setScholarAssignedTags] = useState<AssignedTag[]>([]);
  const [institutionAssignedTags, setInstitutionAssignedTags] = useState<AssignedTag[]>([]);

  // Auto-save draft every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (entityType === 'scholar' && Object.keys(scholarData).length > 0) {
        setDraftEntity({ type: 'scholar', ...scholarData });
        setLastSaved(new Date());
      } else if (entityType === 'institution' && Object.keys(institutionData).length > 0) {
        setDraftEntity({ type: 'institution', ...institutionData });
        setLastSaved(new Date());
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [scholarData, institutionData, entityType, setDraftEntity]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (entityType === 'scholar') {
      if (!scholarData.name?.trim()) {
        newErrors.fullName = 'Full name is required';
      }
      if (!scholarData.email?.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(scholarData.email)) {
        newErrors.email = 'Invalid email format';
      }
    } else {
      if (!institutionData.name?.trim()) {
        newErrors.name = 'Official name is required';
      }
      if (!institutionData.country) {
        newErrors.country = 'Country is required';
      }
      if (!institutionData.city?.trim()) {
        newErrors.city = 'City is required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      addToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Please fix the errors in the form',
      });
      return;
    }

    addToast({
      type: 'success',
      title: 'Entity Submitted',
      message: `New ${entityType} submitted for approval`,
    });
    setCurrentPage('approvals');
  };

  const handleSaveDraft = () => {
    if (entityType === 'scholar') {
      setDraftEntity({ type: 'scholar', ...scholarData });
    } else {
      setDraftEntity({ type: 'institution', ...institutionData });
    }
    setLastSaved(new Date());
    addToast({
      type: 'success',
      title: 'Draft Saved',
      message: `Draft saved at ${new Date().toLocaleTimeString()}`,
    });
  };

  const handleCancel = () => {
    const hasData = entityType === 'scholar' 
      ? Object.keys(scholarData).some((k) => !!scholarData[k as keyof Scholar])
      : Object.keys(institutionData).some((k) => !!institutionData[k as keyof Institution]);
    
    if (hasData) {
      setShowCancelDialog(true);
    } else {
      setCurrentPage('dashboard');
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Create New Entity</h1>
          <p className="text-muted-foreground mt-1">
            Add a new scholar or institution to the system
          </p>
        </div>
        <div className="flex items-center gap-2">
          {lastSaved && (
            <span className="text-sm text-muted-foreground">
              Auto-saved at {lastSaved.toLocaleTimeString()}
            </span>
          )}
          <Button variant="outline" onClick={handleSaveDraft}>
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
          <Button variant="outline" onClick={handleCancel}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            <Send className="mr-2 h-4 w-4" />
            Submit for Approval
          </Button>
        </div>
      </div>

      {/* Entity Type Selector */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setEntityType('scholar')}
              className={cn(
                'flex items-center gap-3 px-6 py-4 rounded-lg border-2 transition-all',
                entityType === 'scholar'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              )}
            >
              <div className={cn(
                'w-12 h-12 rounded-full flex items-center justify-center',
                entityType === 'scholar' ? 'bg-primary text-primary-foreground' : 'bg-muted'
              )}>
                <GraduationCap className="h-6 w-6" />
              </div>
              <div className="text-left">
                <p className={cn(
                  'font-semibold',
                  entityType === 'scholar' ? 'text-primary' : 'text-foreground'
                )}>
                  Scholar
                </p>
                <p className="text-sm text-muted-foreground">Individual researcher profile</p>
              </div>
            </button>
            
            <button
              onClick={() => setEntityType('institution')}
              className={cn(
                'flex items-center gap-3 px-6 py-4 rounded-lg border-2 transition-all',
                entityType === 'institution'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              )}
            >
              <div className={cn(
                'w-12 h-12 rounded-full flex items-center justify-center',
                entityType === 'institution' ? 'bg-primary text-primary-foreground' : 'bg-muted'
              )}>
                <Landmark className="h-6 w-6" />
              </div>
              <div className="text-left">
                <p className={cn(
                  'font-semibold',
                  entityType === 'institution' ? 'text-primary' : 'text-foreground'
                )}>
                  Institution
                </p>
                <p className="text-sm text-muted-foreground">University or research organization</p>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Form */}
      <Card>
        <CardContent className="p-4">
          {entityType === 'scholar' ? (
            <ScholarForm
              data={scholarData}
              onChange={setScholarData}
              errors={errors}
              assignedTags={scholarAssignedTags}
              onAssignedTagsChange={setScholarAssignedTags}
              classDefs={scholarClassDefs}
            />
          ) : (
            <InstitutionForm
              data={institutionData}
              onChange={setInstitutionData}
              errors={errors}
              assignedTags={institutionAssignedTags}
              onAssignedTagsChange={setInstitutionAssignedTags}
              classDefs={institutionClassDefs}
            />
          )}
        </CardContent>
      </Card>

      {/* Bulk Tag Import */}
      <Card>
        <CardHeader className="p-4 pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Bulk Tag Import
          </CardTitle>
          <CardDescription className="text-xs">
            Import tags from Excel file for multiple entities
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
            <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
            <p className="text-sm font-medium">Drag and drop your Excel file here</p>
            <p className="text-xs text-muted-foreground mt-1">
              or click to browse files
            </p>
            <Button variant="outline" className="mt-4">
              <Download className="mr-2 h-4 w-4" />
              Download Template
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Cancel Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Discard Changes?</DialogTitle>
            <DialogDescription>
              You have unsaved changes. Are you sure you want to discard them?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              Keep Editing
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                setShowCancelDialog(false);
                setCurrentPage('dashboard');
              }}
            >
              Discard Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
