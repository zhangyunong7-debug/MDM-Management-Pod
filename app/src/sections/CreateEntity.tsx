import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/appStore';
import { cn } from '@/lib/utils';
import type { Scholar, Institution, Tag } from '@/types';
import { 
  Save, 
  Send, 
  X, 
  Upload, 
  Download,
  Check,
  GraduationCap,
  Building2,
  User,
  Mail,
  Globe,
  MapPin,
  Calendar,
  Award,
  BookOpen,
  Search
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { mockTags, countries, researchAreas, degrees, institutionTypes, mockInstitutions } from '@/data/mock';

const tagCategories = [
  { id: 'honors', label: 'Honors & Awards', color: 'tag-honors' },
  { id: 'memberships', label: 'Academic Memberships', color: 'tag-memberships' },
  { id: 'rankings', label: 'Rankings & Tiers', color: 'tag-rankings' },
  { id: 'geographic', label: 'Geographic Systems', color: 'tag-geographic' },
  { id: 'research', label: 'Research Areas', color: 'tag-research' },
];

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

function TagSelector({ 
  selectedTags, 
  onChange, 
  category 
}: { 
  selectedTags: string[]; 
  onChange: (tags: string[]) => void;
  category?: string;
}) {
  const availableTags = category 
    ? mockTags.filter((t) => t.category === category)
    : mockTags;

  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onChange(selectedTags.filter((id) => id !== tagId));
    } else {
      onChange([...selectedTags, tagId]);
    }
  };

  return (
    <div className="space-y-3">
      {category ? (
        <div className="flex flex-wrap gap-2">
          {availableTags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => toggleTag(tag.id)}
              className={cn(
                'inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm border transition-colors',
                selectedTags.includes(tag.id)
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background hover:bg-muted border-border'
              )}
            >
              {selectedTags.includes(tag.id) && <Check className="h-3 w-3" />}
              {tag.name}
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {tagCategories.map((cat) => {
            const catTags = mockTags.filter((t) => t.category === cat.id);
            const selectedInCat = selectedTags.filter((id) => 
              catTags.some((t) => t.id === id)
            );
            
            return (
              <div key={cat.id}>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  {cat.label}
                  {selectedInCat.length > 0 && (
                    <span className="ml-2 text-primary">({selectedInCat.length})</span>
                  )}
                </p>
                <div className="flex flex-wrap gap-2">
                  {catTags.map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.id)}
                      className={cn(
                        'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs border transition-colors',
                        selectedTags.includes(tag.id)
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background hover:bg-muted border-border'
                      )}
                    >
                      {selectedTags.includes(tag.id) && <Check className="h-3 w-3" />}
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ScholarForm({ 
  data, 
  onChange, 
  errors 
}: { 
  data: Partial<Scholar>; 
  onChange: (data: Partial<Scholar>) => void;
  errors: Record<string, string>;
}) {
  const updateField = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-8">
      {/* Basic Information */}
      <div className="form-section">
        <h3 className="form-section-title flex items-center gap-2">
          <User className="h-4 w-4" />
          Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          
          <FormField label="Secondary Research Areas">
            <TagSelector 
              selectedTags={data.researchAreas?.slice(1).map((ra) => 
                mockTags.find((t) => t.name === ra)?.id || ''
              ).filter(Boolean) || []}
              onChange={(tags) => {
                const primary = data.researchAreas?.[0];
                const secondaryNames = tags.map((id) => mockTags.find((t) => t.id === id)?.name).filter((name): name is string => !!name);
                updateField('researchAreas', [primary, ...secondaryNames].filter(Boolean));
              }}
              category="research"
            />
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

      {/* Classification Tags */}
      <div className="form-section">
        <h3 className="form-section-title flex items-center gap-2">
          <Award className="h-4 w-4" />
          Classification Tags
        </h3>
        <TagSelector 
          selectedTags={[
            ...(data.honors?.map((h) => mockTags.find((t) => t.name === h)?.id).filter((id): id is string => !!id) || []),
            ...(data.memberships?.map((m) => mockTags.find((t) => t.name === m)?.id).filter((id): id is string => !!id) || []),
          ]}
          onChange={(tags) => {
            const selectedTags = tags.map((id) => mockTags.find((t) => t.id === id)).filter((t): t is Tag => !!t);
            updateField('honors', selectedTags.filter((t) => t.category === 'honors').map((t) => t.name));
            updateField('memberships', selectedTags.filter((t) => t.category === 'memberships').map((t) => t.name));
          }}
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
  errors 
}: { 
  data: Partial<Institution>; 
  onChange: (data: Partial<Institution>) => void;
  errors: Record<string, string>;
}) {
  const updateField = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-8">
      {/* Basic Information */}
      <div className="form-section">
        <h3 className="form-section-title flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          
          <FormField label="Primary Research Focus Areas">
            <TagSelector 
              selectedTags={data.researchFocusAreas?.map((ra) => 
                mockTags.find((t) => t.name === ra)?.id || ''
              ).filter(Boolean) || []}
              onChange={(tags) => {
                const names = tags.map((id) => mockTags.find((t) => t.id === id)?.name).filter((name): name is string => !!name);
                updateField('researchFocusAreas', names);
              }}
              category="research"
            />
          </FormField>
        </div>
      </div>

      {/* Classification Tags */}
      <div>
        <h3 className="form-section-title flex items-center gap-2">
          <Award className="h-4 w-4" />
          Classification Tags
        </h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Rankings & Tiers</p>
            <TagSelector 
              selectedTags={data.rankingTags?.map((rt) => 
                mockTags.find((t) => t.name === rt)?.id || ''
              ).filter(Boolean) || []}
              onChange={(tags) => {
                const names = tags.map((id) => mockTags.find((t) => t.id === id)?.name).filter((name): name is string => !!name);
                updateField('rankingTags', names);
              }}
              category="rankings"
            />
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Geographic Systems</p>
            <TagSelector 
              selectedTags={data.systemMembership?.map((sm) => 
                mockTags.find((t) => t.name === sm)?.id || ''
              ).filter(Boolean) || []}
              onChange={(tags) => {
                const names = tags.map((id) => mockTags.find((t) => t.id === id)?.name).filter((name): name is string => !!name);
                updateField('systemMembership', names);
              }}
              category="geographic"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function CreateEntity() {
  const { 
    setDraftEntity, 
    addToast,
    setCurrentPage 
  } = useAppStore();
  
  const [entityType, setEntityType] = useState<'scholar' | 'institution'>('scholar');
  const [scholarData, setScholarData] = useState<Partial<Scholar>>({});
  const [institutionData, setInstitutionData] = useState<Partial<Institution>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

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
    <div className="space-y-6 animate-fade-in">
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
        <CardContent className="p-6">
          <div className="flex items-center justify-center gap-4">
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
                <Building2 className="h-6 w-6" />
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
        <CardContent className="p-6">
          {entityType === 'scholar' ? (
            <ScholarForm 
              data={scholarData}
              onChange={setScholarData}
              errors={errors}
            />
          ) : (
            <InstitutionForm 
              data={institutionData}
              onChange={setInstitutionData}
              errors={errors}
            />
          )}
        </CardContent>
      </Card>

      {/* Bulk Tag Import */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Bulk Tag Import
          </CardTitle>
          <CardDescription>
            Import tags from Excel file for multiple entities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
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
