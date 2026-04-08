import { useAppStore } from '@/store/appStore';
import { cn } from '@/lib/utils';
import type { Scholar, Institution } from '@/types';
import { 
  X, 
  GraduationCap, 
  Building2, 
  Mail, 
  Globe, 
  MapPin, 
  Link2,
  History,
  Edit,
  FolderPlus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';

const tagCategories = [
  { id: 'honors', label: 'Honors & Awards', color: 'tag-honors' },
  { id: 'memberships', label: 'Academic Memberships', color: 'tag-memberships' },
  { id: 'rankings', label: 'Rankings & Tiers', color: 'tag-rankings' },
  { id: 'geographic', label: 'Geographic Systems', color: 'tag-geographic' },
  { id: 'research', label: 'Research Areas', color: 'tag-research' },
];

function TagBadge({ tag }: { tag: { name: string; category: string } }) {
  const categoryStyle = tagCategories.find(c => c.id === tag.category)?.color || 'tag-research';
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border',
      categoryStyle
    )}>
      {tag.name}
    </span>
  );
}

function ScholarDetails({ scholar }: { scholar: Scholar }) {
  // Scholar details component
  void scholar;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
          <GraduationCap className="h-8 w-8 text-blue-600" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold">{scholar.name}</h2>
          <code className="text-sm font-mono text-muted-foreground">{scholar.id}</code>
          <div className="flex items-center gap-2 mt-2">
            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
              <GraduationCap className="h-3 w-3 mr-1" />
              Scholar
            </Badge>
            <Badge variant="outline" className="text-xs">
              {scholar.status === 'active' ? 'Active' : 'Pending Approval'}
            </Badge>
          </div>
        </div>
      </div>

      <Separator />

      {/* Contact Info */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Contact Information
        </h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <a href={`mailto:${scholar.email}`} className="text-primary hover:underline">
              {scholar.email}
            </a>
          </div>
          {scholar.orcid && (
            <div className="flex items-center gap-2 text-sm">
              <Link2 className="h-4 w-4 text-muted-foreground" />
              <a 
                href={`https://orcid.org/${scholar.orcid}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {scholar.orcid}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Affiliation */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Current Affiliation
        </h3>
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-sm">{scholar.currentAffiliation}</p>
                <code className="text-xs font-mono text-muted-foreground">
                  {scholar.currentAffiliationId}
                </code>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Academic Profile */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Academic Profile
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Highest Degree</p>
            <p className="text-sm font-medium">{scholar.highestDegree || 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">PhD Year</p>
            <p className="text-sm font-medium">{scholar.phdYear || 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Nationality</p>
            <p className="text-sm font-medium">{scholar.nationality || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Research Areas */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Research Areas
        </h3>
        <div className="flex flex-wrap gap-2">
          {scholar.researchAreas.map((area) => (
            <Badge key={area} variant="secondary" className="text-xs">
              {area}
            </Badge>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Classification Tags
        </h3>
        <div className="flex flex-wrap gap-2">
          {scholar.tags.map((tag) => (
            <TagBadge key={tag.id} tag={tag} />
          ))}
        </div>
      </div>

      {/* Biography */}
      {scholar.biography && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Biography
          </h3>
          <p className="text-sm text-muted-foreground">{scholar.biography}</p>
        </div>
      )}

      {/* Metadata */}
      <div className="pt-4 border-t border-border">
        <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
          <div>
            <p>Created</p>
            <p>{new Date(scholar.createdAt).toLocaleString()}</p>
          </div>
          <div>
            <p>Last Updated</p>
            <p>{new Date(scholar.updatedAt).toLocaleString()}</p>
          </div>
          <div>
            <p>Created By</p>
            <p>{scholar.createdBy}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function InstitutionDetails({ institution }: { institution: Institution }) {
  // Institution details component
  void institution;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
          <Building2 className="h-8 w-8 text-purple-600" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold">{institution.name}</h2>
          {institution.shortName && (
            <p className="text-sm text-muted-foreground">{institution.shortName}</p>
          )}
          <code className="text-sm font-mono text-muted-foreground">{institution.id}</code>
          <div className="flex items-center gap-2 mt-2">
            <Badge className="bg-purple-100 text-purple-800 border-purple-200">
              <Building2 className="h-3 w-3 mr-1" />
              Institution
            </Badge>
            <Badge variant="outline" className="text-xs">
              {institution.status === 'active' ? 'Active' : 'Pending Approval'}
            </Badge>
          </div>
        </div>
      </div>

      <Separator />

      {/* Basic Info */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Basic Information
        </h3>
        <div className="space-y-2">
          {institution.website && (
            <div className="flex items-center gap-2 text-sm">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <a 
                href={institution.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {institution.website}
              </a>
            </div>
          )}
          {institution.institutionType && (
            <div className="flex items-center gap-2 text-sm">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span>{institution.institutionType}</span>
            </div>
          )}
        </div>
      </div>

      {/* Location */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Location
        </h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{institution.city}, {institution.country}</span>
          </div>
          {institution.address && (
            <p className="text-sm text-muted-foreground pl-6">{institution.address}</p>
          )}
          {institution.postalCode && (
            <p className="text-sm text-muted-foreground pl-6">{institution.postalCode}</p>
          )}
        </div>
      </div>

      {/* Academic Profile */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Academic Profile
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Established</p>
            <p className="text-sm font-medium">{institution.establishedYear || 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Faculty</p>
            <p className="text-sm font-medium">
              {institution.totalFaculty?.toLocaleString() || 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Research Focus */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Research Focus Areas
        </h3>
        <div className="flex flex-wrap gap-2">
          {institution.researchFocusAreas.map((area) => (
            <Badge key={area} variant="secondary" className="text-xs">
              {area}
            </Badge>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Classification Tags
        </h3>
        <div className="flex flex-wrap gap-2">
          {institution.tags.map((tag) => (
            <TagBadge key={tag.id} tag={tag} />
          ))}
        </div>
      </div>

      {/* Metadata */}
      <div className="pt-4 border-t border-border">
        <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
          <div>
            <p>Created</p>
            <p>{new Date(institution.createdAt).toLocaleString()}</p>
          </div>
          <div>
            <p>Last Updated</p>
            <p>{new Date(institution.updatedAt).toLocaleString()}</p>
          </div>
          <div>
            <p>Created By</p>
            <p>{institution.createdBy}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function EntityDrawer() {
  const { 
    selectedEntity, 
    isEntityDrawerOpen, 
    setEntityDrawerOpen,
    setCurrentPage 
  } = useAppStore();

  if (!selectedEntity) return null;

  return (
    <>
      {/* Backdrop */}
      {isEntityDrawerOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setEntityDrawerOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          'fixed top-16 right-0 bottom-0 w-full max-w-md bg-white shadow-drawer z-50 transition-transform duration-300 ease-drawer',
          isEntityDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-semibold">Entity Details</h2>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setEntityDrawerOpen(false);
                  setCurrentPage('create');
                }}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setEntityDrawerOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <ScrollArea className="flex-1 p-4">
            {selectedEntity.type === 'scholar' ? (
              <ScholarDetails scholar={selectedEntity as Scholar} />
            ) : (
              <InstitutionDetails institution={selectedEntity as Institution} />
            )}
          </ScrollArea>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  setEntityDrawerOpen(false);
                  setCurrentPage('logs');
                }}
              >
                <History className="h-4 w-4 mr-2" />
                View History
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  setEntityDrawerOpen(false);
                  setCurrentPage('corrections');
                }}
              >
                <FolderPlus className="h-4 w-4 mr-2" />
                Add to Pool
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
