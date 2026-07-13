import React from 'react';
import { useAppStore } from '@/store/appStore';
import { cn } from '@/lib/utils';
import type { Scholar, Institution, ClassificationDef } from '@/types';
import {
  X,
  GraduationCap,
  Landmark,
  Globe,
  MapPin,
  Link2,
  History,
  Edit,
  FolderPlus,
  Award,
  ExternalLink,
  BookOpen,
  Shield,
  Briefcase,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const subDimensionConfig: Record<string, {
  dimension: 'RISK' | 'Business Classification';
  textClass: string;
}> = {
  COMPLIANCE: { dimension: 'RISK', textClass: 'text-red-700 border-red-200 bg-red-50' },
  INTEGRITY: { dimension: 'RISK', textClass: 'text-orange-700 border-orange-200 bg-orange-50' },
  SECURITY: { dimension: 'RISK', textClass: 'text-amber-700 border-amber-200 bg-amber-50' },
  REPUTATION: { dimension: 'RISK', textClass: 'text-yellow-700 border-yellow-200 bg-yellow-50' },
  COMMERCIAL: { dimension: 'RISK', textClass: 'text-amber-700 border-amber-200 bg-amber-50' },
  QUALITY: { dimension: 'Business Classification', textClass: 'text-blue-700 border-blue-200 bg-blue-50' },
  VALUE: { dimension: 'Business Classification', textClass: 'text-green-700 border-green-200 bg-green-50' },
  PREFERENCE: { dimension: 'Business Classification', textClass: 'text-teal-700 border-teal-200 bg-teal-50' },
  RANKING: { dimension: 'Business Classification', textClass: 'text-indigo-700 border-indigo-200 bg-indigo-50' },
  STRATEGIC: { dimension: 'Business Classification', textClass: 'text-violet-700 border-violet-200 bg-violet-50' },
  TYPE: { dimension: 'Business Classification', textClass: 'text-purple-700 border-purple-200 bg-purple-50' },
  OPTOUT: { dimension: 'Business Classification', textClass: 'text-gray-700 border-gray-200 bg-gray-50' },
};

function TagBadge({ def }: { def: ClassificationDef }) {
  const config = subDimensionConfig[def.subDimension] || { textClass: 'text-gray-700 border-gray-200 bg-gray-50', dimension: def.dimension };
  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border',
      config.textClass
    )}>
      {def.dimension === 'RISK' ? <Shield className="h-3 w-3" /> : <Briefcase className="h-3 w-3" />}
      {def.classDisplayName}
    </span>
  );
}

function DetailSection({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border">
      <div className="flex items-center justify-between px-4 py-2.5 bg-muted/30 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {action}
      </div>
      <div className="px-4 py-3">{children}</div>
    </div>
  );
}

function AffiliationRow({ aff }: { aff: { institutionName: string; city: string; country: string; isPrimary?: boolean; globalInstCode?: string } }) {
  const { setSearchFilters, setEntityDrawerOpen, setCurrentPage } = useAppStore();

  const handleInstClick = () => {
    setEntityDrawerOpen(false);
    setSearchFilters({ entityType: 'institution', query: aff.institutionName });
    setCurrentPage('search');
  };

  return (
    <div className="flex items-start gap-2 text-sm">
      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 flex-shrink-0" />
      <div className="flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium">{aff.institutionName}</span>
          {aff.isPrimary && (
            <Badge variant="outline" className="text-xs border-primary/30 text-primary">Primary</Badge>
          )}
        </div>
        {aff.globalInstCode && (
          <button
            onClick={handleInstClick}
            className="text-xs font-mono text-primary hover:underline cursor-pointer"
          >
            {aff.globalInstCode}
          </button>
        )}
        <span className="text-muted-foreground text-xs block">
          {aff.city} / {aff.country}
        </span>
      </div>
    </div>
  );
}

function ScholarDetails({ scholar, allClassDefs }: { scholar: Scholar; allClassDefs: ClassificationDef[] }) {
  return (
    <div className="space-y-4">
      {/* Basic Info */}
      <DetailSection title="Basic Info">
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <p className="text-xs text-muted-foreground">Last Name</p>
              <p className="text-sm font-medium">{scholar.lastName || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">First Name</p>
              <p className="text-sm font-medium">{scholar.firstName || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Native Name</p>
              <p className="text-sm font-medium">{scholar.nativeName || '—'}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {scholar.orcid && (
              <div>
                <p className="text-xs text-muted-foreground">ORCID</p>
                <a
                  href={`https://orcid.org/${scholar.orcid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  {scholar.orcid}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
            {scholar.title && (
              <div>
                <p className="text-xs text-muted-foreground">Title</p>
                <p className="text-sm font-medium">{scholar.title}</p>
              </div>
            )}
            {scholar.category && (
              <div>
                <p className="text-xs text-muted-foreground">Category</p>
                <p className="text-sm font-medium">{scholar.category}</p>
              </div>
            )}
          </div>
          {scholar.personHomepages && scholar.personHomepages.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground">Homepage</p>
              {scholar.personHomepages.map((hp, i) => (
                <a
                  key={i}
                  href={hp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  <Globe className="h-3 w-3" />
                  <span className="truncate">{hp.url}</span>
                </a>
              ))}
            </div>
          )}
          {scholar.sciProfileUrl && (
            <div>
              <p className="text-xs text-muted-foreground">SciProfile URL</p>
              <a
                href={scholar.sciProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                <BookOpen className="h-3 w-3" />
                {scholar.sciProfileUrl}
              </a>
            </div>
          )}
        </div>
      </DetailSection>

      {/* Contacts */}
      <DetailSection
        title={`Contacts (${scholar.emails?.length || 1} email${(scholar.emails?.length || 1) !== 1 ? 's' : ''})`}
        action={
          <Button variant="ghost" size="sm" className="h-6 text-xs">
            +Add
          </Button>
        }
      >
        <div className="space-y-1.5">
          {(scholar.emails || [{ email: scholar.email, isPrimary: true }]).map((e, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <span className={cn('w-1.5 h-1.5 rounded-full', e.isPrimary ? 'bg-primary' : 'bg-muted-foreground/30')} />
              <a href={`mailto:${e.email}`} className="text-primary hover:underline flex-1">
                {e.email}
              </a>
              {e.isPrimary && (
                <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                  Primary
                </Badge>
              )}
            </div>
          ))}
        </div>
      </DetailSection>

      {/* Affiliations */}
      {scholar.affiliations && scholar.affiliations.length > 0 && (
        <DetailSection title={`Affiliations (${scholar.affiliations.length} institution${scholar.affiliations.length !== 1 ? 's' : ''})`}>
          <div className="space-y-2">
            {scholar.affiliations.map((aff, i) => (
              <AffiliationRow key={i} aff={aff} />
            ))}
          </div>
        </DetailSection>
      )}

      {/* H-Index */}
      {(scholar.hIndex != null || scholar.hIndexGoogle != null) && (
        <DetailSection title="H-Index">
          <div className="flex flex-wrap items-center gap-6">
            {scholar.hIndex != null && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">SciProfile</span>
                {scholar.sciProfileUrl ? (
                  <a
                    href={scholar.sciProfileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-2xl font-bold text-primary hover:underline"
                  >
                    {scholar.hIndex}
                  </a>
                ) : (
                  <span className="text-2xl font-bold">{scholar.hIndex}</span>
                )}
                {scholar.hIndexUpdated && (
                  <span className="text-xs text-muted-foreground">
                    · updated {scholar.hIndexUpdated}
                  </span>
                )}
              </div>
            )}
            {scholar.hIndexGoogle != null && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Google Scholar</span>
                {scholar.googleScholarId ? (
                  <a
                    href={`https://scholar.google.com/citations?user=${scholar.googleScholarId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-2xl font-bold text-primary hover:underline"
                  >
                    {scholar.hIndexGoogle}
                  </a>
                ) : (
                  <span className="text-2xl font-bold">{scholar.hIndexGoogle}</span>
                )}
                {scholar.hIndexGoogleUpdated && (
                  <span className="text-xs text-muted-foreground">
                    · updated {scholar.hIndexGoogleUpdated}
                  </span>
                )}
              </div>
            )}
          </div>
        </DetailSection>
      )}

      {/* Research Areas */}
      {scholar.researchAreas.length > 0 && (
        <DetailSection title="Research">
          <TooltipProvider>
            <div className="flex flex-wrap gap-1.5">
              {scholar.researchAreas.map((area) => {
                const desc = scholar.researchAreaDetails?.[area];
                const badge = (
                  <Badge
                    key={area}
                    variant="secondary"
                    className={cn('text-xs', desc && 'cursor-pointer hover:bg-secondary/80')}
                  >
                    {area}
                  </Badge>
                );
                return desc ? (
                  <Tooltip key={area}>
                    <TooltipTrigger asChild>{badge}</TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-xs">
                      <p className="text-xs">{desc}</p>
                    </TooltipContent>
                  </Tooltip>
                ) : badge;
              })}
            </div>
          </TooltipProvider>
        </DetailSection>
      )}

      {/* Tags */}
      {scholar.tags.length > 0 && (
        <DetailSection title="Tags">
          <div className="flex flex-wrap gap-1.5">
            {scholar.tags.map((tagId) => {
              const def = allClassDefs.find((d) => d.id === tagId);
              return def ? <TagBadge key={tagId} def={def} /> : null;
            })}
          </div>
        </DetailSection>
      )}

      {/* VIP Profile */}
      {scholar.isVip && (
        <DetailSection
          title="VIP Profile"
          action={
            <a
              href="https://staging.automation.mdpi.io/#/data-studio"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              <ExternalLink className="h-3 w-3" />
              Data Studio
            </a>
          }
        >
          <div>
            {scholar.awards && scholar.awards.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2">Awards</p>
                <div className="space-y-2">
                  {scholar.awards.map((award, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-sm">
                      <Award className="h-4 w-4 text-amber-500 flex-shrink-0" />
                      <a
                        href={award.award_page_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-primary hover:underline"
                      >
                        {award.award_name}
                      </a>
                      <span className="text-muted-foreground">({award.award_year})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DetailSection>
      )}

      {/* Metadata */}
      <div className="pt-2 text-xs text-muted-foreground space-y-1">
        <div className="flex justify-between">
          <span>Created: {new Date(scholar.createdAt).toLocaleDateString()}</span>
          <span>Updated: {new Date(scholar.updatedAt).toLocaleDateString()}</span>
        </div>
        <span>By: {scholar.createdBy}</span>
      </div>
    </div>
  );
}

function InstitutionDetails({ institution, allClassDefs }: { institution: Institution; allClassDefs: ClassificationDef[] }) {
  // Institution details component
  void institution;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
          <Landmark className="h-8 w-8 text-purple-600" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold">{institution.name}</h2>
          {institution.shortName && (
            <p className="text-sm text-muted-foreground">{institution.shortName}</p>
          )}
          <code className="text-sm font-mono text-muted-foreground">{institution.id}</code>
          <div className="flex items-center gap-2 mt-2">
            <Badge className="bg-purple-100 text-purple-800 border-purple-200">
              <Landmark className="h-3 w-3 mr-1" />
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
              <Landmark className="h-4 w-4 text-muted-foreground" />
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
          {institution.tags.map((tagId) => {
            const def = allClassDefs.find((d) => d.id === tagId);
            return def ? <TagBadge key={tagId} def={def} /> : null;
          })}
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
    setCurrentPage,
    scholarClassDefs,
    institutionClassDefs,
  } = useAppStore();
  const allClassDefs = [...scholarClassDefs, ...institutionClassDefs];

  if (!selectedEntity) return null;

  return (
    <>
      {/* Backdrop */}
      {isEntityDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity"
          onClick={() => setEntityDrawerOpen(false)}
        />
      )}

      {/* Sliding Window */}
      <div
        className={cn(
          'fixed top-0 right-0 bottom-0 w-full max-w-2xl bg-white shadow-2xl z-50 transition-transform duration-300 ease-drawer',
          isEntityDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/20">
            <div className="flex items-center gap-3 min-w-0">
              <div className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0',
                selectedEntity.type === 'scholar' ? 'bg-blue-500' : 'bg-purple-500'
              )}>
                {selectedEntity.type === 'scholar' ? (
                  <GraduationCap className="h-5 w-5" />
                ) : (
                  <Landmark className="h-5 w-5" />
                )}
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-semibold truncate">{selectedEntity.name}</h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <code className="text-xs font-mono text-muted-foreground">{selectedEntity.id}</code>
                  <Badge variant="outline" className="text-xs">
                    {selectedEntity.status === 'active' ? 'Active' : 'Pending Review'}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
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
          <ScrollArea className="flex-1">
            <div className="p-6">
              {selectedEntity.type === 'scholar' ? (
                <ScholarDetails scholar={selectedEntity as Scholar} allClassDefs={allClassDefs} />
              ) : (
                <InstitutionDetails institution={selectedEntity as Institution} allClassDefs={allClassDefs} />
              )}
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-border bg-muted/20">
            <div className="flex gap-3">
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
