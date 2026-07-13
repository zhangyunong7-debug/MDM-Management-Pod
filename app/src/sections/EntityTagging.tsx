import { useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search,
  Tag,
  Plus,
  X,
  GraduationCap,
  Landmark,
  Calendar,
  AlertTriangle,
  Check,
} from 'lucide-react';
import type { ClassificationDef, TagExtensionValue, ExtSchemaEnum } from '@/types';

interface AssignTagDialogProps {
  entityId: string;
  entityType: 'scholar' | 'institution';
  entityName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function AssignTagDialog({ entityId, entityType, entityName, open, onOpenChange }: AssignTagDialogProps) {
  const {
    scholarClassDefs,
    institutionClassDefs,
    tagAssignments,
    assignTagToEntity,
    addToast,
  } = useAppStore();

  const classDefs = entityType === 'scholar' ? scholarClassDefs : institutionClassDefs;
  const assignedTagIds = tagAssignments
    .filter((a) => a.entityId === entityId)
    .map((a) => a.tagId);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [extValues, setExtValues] = useState<Record<number, TagExtensionValue>>({});

  const filteredDefs = classDefs.filter((def) => {
    if (assignedTagIds.includes(def.id)) return false;
    return (
      def.classDisplayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      def.classCode.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleTagToggle = (defId: number) => {
    setSelectedTags((prev) =>
      prev.includes(defId) ? prev.filter((id) => id !== defId) : [...prev, defId]
    );
  };

  const handleExtValueChange = (defId: number, value: TagExtensionValue) => {
    setExtValues((prev) => ({ ...prev, [defId]: value }));
  };

  const handleAssign = () => {
    selectedTags.forEach((tagId) => {
      const def = classDefs.find((d) => d.id === tagId);
      if (def) {
        assignTagToEntity(entityId, entityType, tagId, def.classCode, extValues[tagId]);
      }
    });

    addToast({
      type: 'success',
      title: 'Tags Assigned',
      message: `${selectedTags.length} tag(s) assigned to ${entityName}`,
    });

    setSelectedTags([]);
    setExtValues({});
    onOpenChange(false);
  };

  const renderExtInput = (def: ClassificationDef) => {
    if (def.extSchema.type === 'boolean') {
      return (
        <div className="flex items-center gap-2">
          <Checkbox
            checked={extValues[def.id]?.booleanValue || false}
            onCheckedChange={(checked) =>
              handleExtValueChange(def.id, { booleanValue: !!checked })
            }
          />
          <Label className="text-sm">Enabled</Label>
        </div>
      );
    }

    if (def.extSchema.type === 'enum') {
      const enumSchema = def.extSchema as ExtSchemaEnum;
      return (
        <Select
          value={extValues[def.id]?.enumValue || ''}
          onValueChange={(value) => handleExtValueChange(def.id, { enumValue: value })}
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
          value={extValues[def.id]?.intValue || ''}
          onChange={(e) =>
            handleExtValueChange(def.id, { intValue: parseInt(e.target.value) })
          }
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
              value={extValues[def.id]?.startDate || ''}
              onChange={(e) =>
                handleExtValueChange(def.id, {
                  ...extValues[def.id],
                  startDate: e.target.value,
                })
              }
            />
          </div>
          <div>
            <Label className="text-xs">End Date</Label>
            <Input
              type="date"
              value={extValues[def.id]?.endDate || ''}
              onChange={(e) =>
                handleExtValueChange(def.id, {
                  ...extValues[def.id],
                  endDate: e.target.value,
                })
              }
            />
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Assign Tags to {entityName}</DialogTitle>
          <DialogDescription>
            Select tags to assign. Some tags may require additional attributes.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0">
          <div className="relative mb-4">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search available tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>

          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              {filteredDefs.map((def) => (
                <Card key={def.id} className={selectedTags.includes(def.id) ? 'border-primary' : ''}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={selectedTags.includes(def.id)}
                        onCheckedChange={() => handleTagToggle(def.id)}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{def.classDisplayName}</span>
                          <Badge variant="outline" className="text-xs">
                            {def.extAttr}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{def.classDesc}</p>
                        {selectedTags.includes(def.id) && (
                          <div className="mt-2 p-3 bg-muted rounded-lg">
                            <Label className="text-xs text-muted-foreground mb-1 block">
                              {def.extAttr === 'BOOLEAN'
                                ? 'Value'
                                : def.extAttr === 'SCOPE' || def.extAttr === 'SEVERITY'
                                ? 'Select Value'
                                : def.extAttr === 'YEAR_ATTR'
                                ? 'Year'
                                : def.extAttr === 'RANK'
                                ? 'Rank'
                                : def.extAttr === 'SCORE'
                                ? 'Score'
                                : 'Date Period'}
                            </Label>
                            {renderExtInput(def)}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {filteredDefs.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No available tags found
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAssign} disabled={selectedTags.length === 0}>
            Assign {selectedTags.length} Tag(s)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function EntityTagging() {
  const {
    scholars,
    institutions,
    scholarClassDefs,
    institutionClassDefs,
    tagAssignments,
    removeTagFromEntity,
    addToast,
  } = useAppStore();

  const [entityType, setEntityType] = useState<'scholar' | 'institution'>('scholar');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntity, setSelectedEntity] = useState<{ id: string; name: string; type: 'scholar' | 'institution' } | null>(null);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  const entities = entityType === 'scholar' ? scholars : institutions;

  const filteredEntities = entities.filter(
    (e) =>
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTagInfo = (tagId: number, type: 'scholar' | 'institution') => {
    const defs = type === 'scholar' ? scholarClassDefs : institutionClassDefs;
    return defs.find((d) => d.id === tagId);
  };

  const getEntityAssignments = (entityId: string) => {
    return tagAssignments.filter((a) => a.entityId === entityId);
  };

  const handleRemoveTag = (assignmentId: string, entityName: string) => {
    removeTagFromEntity(assignmentId);
    addToast({
      type: 'success',
      title: 'Tag Removed',
      message: `Tag removed from ${entityName}`,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Entity Tagging</h1>
        <p className="text-muted-foreground">
          Assign classification tags to scholars and institutions
        </p>
      </div>

      <Tabs defaultValue="scholar" onValueChange={(v) => setEntityType(v as 'scholar' | 'institution')}>
        <TabsList>
          <TabsTrigger value="scholar" className="gap-2">
            <GraduationCap className="h-4 w-4" />
            Scholars
          </TabsTrigger>
          <TabsTrigger value="institution" className="gap-2">
            <Landmark className="h-4 w-4" />
            Institutions
          </TabsTrigger>
        </TabsList>

        <TabsContent value={entityType}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>
                    {entityType === 'scholar' ? 'Scholar' : 'Institution'} Entities
                  </CardTitle>
                  <CardDescription>
                    {filteredEntities.length} {entityType}(s) found
                  </CardDescription>
                </div>
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search entities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 w-[300px]"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Assigned Tags</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEntities.map((entity) => {
                      const assignments = getEntityAssignments(entity.id);
                      return (
                        <TableRow key={entity.id}>
                          <TableCell className="font-mono text-sm">{entity.id}</TableCell>
                          <TableCell className="font-medium">{entity.name}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {assignments.map((assignment) => {
                                const tagInfo = getTagInfo(assignment.tagId, entity.type);
                                return (
                                  <Badge
                                    key={assignment.id}
                                    variant="secondary"
                                    className="gap-1 pr-1"
                                  >
                                    {tagInfo?.classDisplayName || assignment.tagCode}
                                    {assignment.extValue && (
                                      <span className="text-xs opacity-70 ml-1">
                                        {assignment.extValue.booleanValue !== undefined
                                          ? assignment.extValue.booleanValue.toString()
                                          : assignment.extValue.enumValue ||
                                            assignment.extValue.intValue?.toString() || ''}
                                      </span>
                                    )}
                                    <button
                                      onClick={() => handleRemoveTag(assignment.id, entity.name)}
                                      className="ml-1 hover:bg-muted-foreground/20 rounded"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </Badge>
                                );
                              })}
                              {assignments.length === 0 && (
                                <span className="text-sm text-muted-foreground">No tags assigned</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setSelectedEntity({ id: entity.id, name: entity.name, type: entity.type as 'scholar' | 'institution' })
                              }
                            >
                              <Plus className="mr-1 h-3 w-3" />
                              Assign Tag
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedEntity && (
        <AssignTagDialog
          entityId={selectedEntity.id}
          entityType={selectedEntity.type}
          entityName={selectedEntity.name}
          open={!!selectedEntity}
          onOpenChange={(open) => !open && setSelectedEntity(null)}
        />
      )}
    </div>
  );
}
