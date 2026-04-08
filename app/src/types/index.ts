// Entity Types
export type EntityType = 'scholar' | 'institution';

export interface Entity {
  id: string;
  type: EntityType;
  name: string;
  tags: Tag[];
  lastUpdated: string;
  status: WorkflowStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface Scholar extends Entity {
  type: 'scholar';
  email: string;
  orcid?: string;
  nationality?: string;
  currentAffiliation?: string;
  currentAffiliationId?: string;
  researchAreas: string[];
  honors: string[];
  memberships: string[];
  highestDegree?: string;
  phdYear?: number;
  biography?: string;
}

export interface Institution extends Entity {
  type: 'institution';
  shortName?: string;
  website?: string;
  institutionType?: string;
  country: string;
  city: string;
  address?: string;
  postalCode?: string;
  coordinates?: { lat: number; lng: number };
  establishedYear?: number;
  totalFaculty?: number;
  researchFocusAreas: string[];
  rankingTags: string[];
  systemMembership: string[];
}

// Tag System
export type TagCategory = 'honors' | 'memberships' | 'rankings' | 'geographic' | 'research';

export interface Tag {
  id: string;
  name: string;
  category: TagCategory;
  color?: string;
}

// Workflow Status
export type WorkflowStatus = 
  | 'pending_correction' 
  | 'in_progress' 
  | 'pending_approval' 
  | 'active' 
  | 'rejected';

// Correction/Issue Types
export type IssueType = 
  | 'XREF_MISMATCH' 
  | 'INFO_OUTDATED' 
  | 'TAG_MISSING' 
  | 'DUPLICATE_SUSPECTED';

export interface CorrectionTask {
  id: string;
  entityId: string;
  entityName: string;
  entityType: EntityType;
  issueType: IssueType;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'submitted';
  createdAt: string;
  assignee?: string;
  assigneeAvatar?: string;
  description: string;
}

// Approval Request Types
export type ApprovalType = 
  | 'NEW_ENTITY' 
  | 'XREF_CORRECTION' 
  | 'INFO_UPDATE' 
  | 'BULK_TAG';

export interface ApprovalRequest {
  id: string;
  type: ApprovalType;
  entityId?: string;
  entityName?: string;
  entityType?: EntityType;
  requester: string;
  requesterAvatar?: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'needs_info';
  priority: 'high' | 'medium' | 'low';
  description: string;
  changes: EntityChange[];
  currentVersion?: Scholar | Institution;
  proposedVersion?: Scholar | Institution;
}

export interface EntityChange {
  field: string;
  fieldLabel: string;
  previous: any;
  current: any;
  changeType: 'modified' | 'added' | 'removed';
}

// Operation Log
export type OperationType = 'CREATE' | 'UPDATE' | 'DELETE' | 'APPROVE' | 'REJECT';

export interface OperationLog {
  id: string;
  operationType: OperationType;
  entityType: EntityType;
  entityId: string;
  entityName: string;
  user: string;
  userAvatar?: string;
  timestamp: string;
  description: string;
  details?: EntityChange[];
  workflowId?: string;
}

// Dashboard KPI
export interface DashboardKPI {
  pendingCorrections: number;
  pendingApprovals: number;
  rejectedItems: number;
  dataQualityScore: number;
}

// Activity Item
export interface ActivityItem {
  id: string;
  type: 'correction' | 'approval' | 'create' | 'update';
  description: string;
  user: string;
  userAvatar?: string;
  timestamp: string;
  entityName?: string;
  entityType?: EntityType;
}

// Search Filters
export interface SearchFilters {
  query: string;
  entityType: 'all' | EntityType;
  tags: string[];
  countries: string[];
  researchAreas: string[];
}

// Navigation Item
export interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  badge?: number;
}

// User
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'governance' | 'researcher';
  language: 'en' | 'zh';
}

// Form Field Definition
export interface FormField {
  name: string;
  type: 'text' | 'email' | 'number' | 'select' | 'multi_select' | 'textarea' | 'entity_reference' | 'tag_selector' | 'country_select';
  label: string;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  category?: string;
  target?: EntityType;
  pattern?: string;
  min?: number;
  max?: number;
  multilingual?: boolean;
}

// View Mode
export type ViewMode = 'table' | 'card';

// Toast Notification
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}
