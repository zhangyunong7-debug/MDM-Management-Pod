import { useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Plus,
  Edit,
  Trash2,
  Tag,
  GraduationCap,
  Landmark,
  Search,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
} from 'lucide-react';
import type { ClassificationDef, ExtensionSchema, ExtSchemaEnum } from '@/types';

export function TagManagement() {
  const {
    scholarClassDefs,
    institutionClassDefs,
    addClassificationDef,
    updateClassificationDef,
    deleteClassificationDef,
    addToast,
  } = useAppStore();

  const [entityType, setEntityType] = useState<'scholar' | 'institution'>('scholar');
  const [dimension, setDimension] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingDef, setEditingDef] = useState<ClassificationDef | null>(null);
  const [deleteDef, setDeleteDef] = useState<ClassificationDef | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    classCode: '',
    className: '',
    classDisplayName: '',
    classDesc: '',
    dimension: 'RISK' as 'RISK' | 'Business Classification',
    subDimension: 'COMPLIANCE',
    extAttr: 'BOOLEAN' as 'BOOLEAN' | 'SCOPE' | 'SEVERITY' | 'YEAR_ATTR' | 'RANK' | 'SCORE',
    extSchema: { type: 'boolean', duration: 'permanent' } as ExtensionSchema,
    status: '1',
    hasRule: false,
  });

  const classDefs = entityType === 'scholar' ? scholarClassDefs : institutionClassDefs;

  const filteredDefs = classDefs.filter((def) => {
    const matchesSearch =
      def.classDisplayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      def.classCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      def.classDesc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDimension = dimension === 'all' || def.dimension === dimension;
    return matchesSearch && matchesDimension;
  });

  const getSubDimensions = (dim: string) => {
    if (dim === 'RISK') {
      return ['COMPLIANCE', 'INTEGRITY', 'SECURITY', 'REPUTATION', 'COMMERCIAL'];
    }
    return ['QUALITY', 'VALUE', 'PREFERENCE', 'RANKING', 'STRATEGIC', 'TYPE', 'OPTOUT'];
  };

  const getSchemaValues = (extAttr: string) => {
    switch (extAttr) {
      case 'SCOPE':
        return { type: 'enum', values: ['CFP', 'MKT', 'SCF', 'BOOK', 'ALL'] };
      case 'SEVERITY':
        return { type: 'enum', values: ['YELLOW', 'RED'] };
      case 'YEAR_ATTR':
      case 'RANK':
        return { type: 'integer', min: 2000, max: 2099 };
      case 'SCORE':
        return { type: 'integer', min: 0, max: 100 };
      default:
        return { type: 'boolean', duration: 'permanent' };
    }
  };

  const handleExtAttrChange = (value: string) => {
    const extAttr = value as 'BOOLEAN' | 'SCOPE' | 'SEVERITY' | 'YEAR_ATTR' | 'RANK' | 'SCORE';
    setFormData({
      ...formData,
      extAttr,
      extSchema: getSchemaValues(value),
    });
  };

  const handleSubmit = () => {
    const targetEntityType =
      formData.extAttr === 'SCOPE' ||
      formData.extAttr === 'SEVERITY' ||
      formData.extAttr === 'YEAR_ATTR' ||
      formData.extAttr === 'RANK' ||
      formData.extAttr === 'SCORE'
        ? 'scholar'
        : 'institution';

    const defData = {
      classCode: formData.classCode,
      className: formData.className,
      classDisplayName: formData.classDisplayName,
      classDesc: formData.classDesc,
      dimension: formData.dimension,
      subDimension: formData.subDimension as any,
      extAttr: formData.extAttr,
      extSchema: formData.extSchema,
      createdBy: 'user',
      status: formData.status,
      hasRule: formData.hasRule,
    };

    if (editingDef) {
      updateClassificationDef(editingDef.id, defData);
      addToast({ type: 'success', title: 'Tag Updated', message: `${formData.classDisplayName} has been updated` });
    } else {
      addClassificationDef(defData);
      addToast({ type: 'success', title: 'Tag Created', message: `${formData.classDisplayName} has been created` });
    }

    setIsAddDialogOpen(false);
    setEditingDef(null);
    resetForm();
  };

  const handleEdit = (def: ClassificationDef) => {
    setEditingDef(def);
    setFormData({
      classCode: def.classCode,
      className: def.className,
      classDisplayName: def.classDisplayName,
      classDesc: def.classDesc,
      dimension: def.dimension,
      subDimension: def.subDimension,
      extAttr: def.extAttr,
      extSchema: def.extSchema,
      status: def.status || '1',
      hasRule: def.hasRule || false,
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = () => {
    if (deleteDef) {
      deleteClassificationDef(deleteDef.id, entityType);
      addToast({ type: 'success', title: 'Tag Deleted', message: `${deleteDef.classDisplayName} has been deleted` });
      setDeleteDef(null);
    }
  };

  const resetForm = () => {
    setFormData({
      classCode: '',
      className: '',
      classDisplayName: '',
      classDesc: '',
      dimension: 'RISK',
      subDimension: 'COMPLIANCE',
      extAttr: 'BOOLEAN',
      extSchema: { type: 'boolean', duration: 'permanent' },
      status: '1',
      hasRule: false,
    });
  };

  const renderSchemaInfo = (schema: ExtensionSchema) => {
    if (schema.type === 'boolean') {
      return (
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span>Boolean</span>
          {schema.duration && <Badge variant="outline">{schema.duration}</Badge>}
        </div>
      );
    }
    if (schema.type === 'enum') {
      const enumSchema = schema as ExtSchemaEnum;
      return (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <Tag className="h-4 w-4 text-blue-500" />
            <span>Enum: {enumSchema.values.join(', ')}</span>
          </div>
          {enumSchema.auto_upgrade && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Info className="h-3 w-3" />
              <span>Auto-upgrade at threshold: {enumSchema.threshold}</span>
            </div>
          )}
        </div>
      );
    }
    if (schema.type === 'integer') {
      return (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Integer: {schema.min} - {schema.max}</span>
        </div>
      );
    }
    if (schema.type === 'date_period') {
      return (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Date Period: start_date, end_date</span>
        </div>
      );
    }
    return null;
  };

  const getDimensionColor = (dim: string) => {
    if (dim === 'RISK') return 'destructive';
    return 'default';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tag Management</h1>
          <p className="text-muted-foreground">
            Manage classification tags for scholars and institutions
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setEditingDef(null);
            setIsAddDialogOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Tag
        </Button>
      </div>

      <Tabs defaultValue="scholar" onValueChange={(v) => setEntityType(v as 'scholar' | 'institution')}>
        <TabsList>
          <TabsTrigger value="scholar" className="gap-2">
            <GraduationCap className="h-4 w-4" />
            Scholar Tags
          </TabsTrigger>
          <TabsTrigger value="institution" className="gap-2">
            <Landmark className="h-4 w-4" />
            Institution Tags
          </TabsTrigger>
        </TabsList>

        <TabsContent value={entityType} className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Classification Definitions</CardTitle>
                  <CardDescription>
                    {filteredDefs.length} tags available
                  </CardDescription>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search tags..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 w-[250px]"
                    />
                  </div>
                  <Select value={dimension} onValueChange={setDimension}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by dimension" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Dimensions</SelectItem>
                      <SelectItem value="RISK">Risk</SelectItem>
                      <SelectItem value="Business Classification">Business</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Display Name</TableHead>
                      <TableHead>Dimension</TableHead>
                      <TableHead>Sub-Dimension</TableHead>
                      <TableHead>Ext. Attr</TableHead>
                      <TableHead>Schema</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDefs.map((def) => (
                      <TableRow key={def.id}>
                        <TableCell className="font-mono text-sm">{def.classCode}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{def.classDisplayName}</div>
                            <div className="text-xs text-muted-foreground">{def.className}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getDimensionColor(def.dimension)}>
                            {def.dimension}
                          </Badge>
                        </TableCell>
                        <TableCell>{def.subDimension}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{def.extAttr}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-[200px]">{renderSchemaInfo(def.extSchema)}</div>
                        </TableCell>
                        <TableCell>
                          {def.status === '1' ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : def.status === '0' ? (
                            <XCircle className="h-5 w-5 text-red-500" />
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(def)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeleteDef(def)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingDef ? 'Edit Tag' : 'Add New Tag'}</DialogTitle>
            <DialogDescription>
              {editingDef ? 'Update the tag definition' : 'Create a new classification tag'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="classCode">Class Code</Label>
                <Input
                  id="classCode"
                  value={formData.classCode}
                  onChange={(e) => setFormData({ ...formData, classCode: e.target.value })}
                  placeholder="e.g., SCH-COMP-NEW"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="className">Class Name</Label>
                <Input
                  id="className"
                  value={formData.className}
                  onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                  placeholder="e.g., new_tag"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="classDisplayName">Display Name</Label>
              <Input
                id="classDisplayName"
                value={formData.classDisplayName}
                onChange={(e) => setFormData({ ...formData, classDisplayName: e.target.value })}
                placeholder="e.g., New Classification"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="classDesc">Description</Label>
              <Textarea
                id="classDesc"
                value={formData.classDesc}
                onChange={(e) => setFormData({ ...formData, classDesc: e.target.value })}
                placeholder="Describe what this tag represents..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Dimension</Label>
                <Select
                  value={formData.dimension}
                  onValueChange={(v) => {
                    setFormData({
                      ...formData,
                      dimension: v as 'RISK' | 'Business Classification',
                      subDimension: getSubDimensions(v)[0],
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RISK">Risk</SelectItem>
                    <SelectItem value="Business Classification">Business</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Sub-Dimension</Label>
                <Select
                  value={formData.subDimension}
                  onValueChange={(v) => setFormData({ ...formData, subDimension: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {getSubDimensions(formData.dimension).map((sub) => (
                      <SelectItem key={sub} value={sub}>
                        {sub}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Extension Attribute</Label>
                <Select value={formData.extAttr} onValueChange={handleExtAttrChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BOOLEAN">Boolean</SelectItem>
                    <SelectItem value="SCOPE">Scope (Enum)</SelectItem>
                    <SelectItem value="SEVERITY">Severity (Enum)</SelectItem>
                    <SelectItem value="YEAR_ATTR">Year Attribute (Integer)</SelectItem>
                    <SelectItem value="RANK">Rank (Integer)</SelectItem>
                    <SelectItem value="SCORE">Score (Integer)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(v) => setFormData({ ...formData, status: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Active</SelectItem>
                    <SelectItem value="0">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Has Rule</Label>
                <Switch
                  checked={formData.hasRule}
                  onCheckedChange={(checked) => setFormData({ ...formData, hasRule: checked })}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Enable automatic tagging based on predefined rules
              </p>
            </div>
            {formData.extAttr !== 'BOOLEAN' && (
              <div className="rounded-lg bg-muted p-4">
                <h4 className="font-medium mb-2">Schema Preview</h4>
                <pre className="text-xs overflow-auto">
                  {JSON.stringify(formData.extSchema, null, 2)}
                </pre>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!formData.classCode || !formData.classDisplayName}>
              {editingDef ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteDef} onOpenChange={() => setDeleteDef(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the tag "{deleteDef?.classDisplayName}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
