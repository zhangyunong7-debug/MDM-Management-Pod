import { useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { cn } from '@/lib/utils';
import type { ApprovalRequest, EntityChange } from '@/types';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  MessageSquare,
  ArrowUpRight,
  User,
  Building2,
  ChevronRight,
  FileText,
  Link2,
  Tag,
  Info,
  Check,
  X
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const approvalTypeConfig = {
  NEW_ENTITY: { label: 'New Entity', icon: User, color: 'bg-blue-100 text-blue-800' },
  XREF_CORRECTION: { label: 'XREF Correction', icon: Link2, color: 'bg-purple-100 text-purple-800' },
  INFO_UPDATE: { label: 'Info Update', icon: Info, color: 'bg-amber-100 text-amber-800' },
  BULK_TAG: { label: 'Bulk Tag', icon: Tag, color: 'bg-emerald-100 text-emerald-800' },
};

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-sky-100 text-sky-800 border-sky-200' },
  approved: { label: 'Approved', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  rejected: { label: 'Rejected', color: 'bg-rose-100 text-rose-800 border-rose-200' },
  needs_info: { label: 'Needs Info', color: 'bg-amber-100 text-amber-800 border-amber-200' },
};

const priorityConfig = {
  high: { color: 'bg-rose-500', label: 'High' },
  medium: { color: 'bg-amber-500', label: 'Medium' },
  low: { color: 'bg-emerald-500', label: 'Low' },
};

function DiffView({ changes }: { changes: EntityChange[] }) {
  return (
    <div className="space-y-3">
      {changes.map((change, index) => (
        <div key={index} className="border rounded-lg overflow-hidden">
          <div className="bg-muted px-3 py-2 text-sm font-medium">
            {change.fieldLabel}
          </div>
          <div className="grid grid-cols-2 divide-x">
            <div className="p-3 bg-rose-50/50">
              <p className="text-xs text-muted-foreground mb-1">Current Value</p>
              <p className="text-sm line-through text-rose-700">
                {Array.isArray(change.previous) 
                  ? change.previous.join(', ') 
                  : String(change.previous || '—')}
              </p>
            </div>
            <div className="p-3 bg-emerald-50/50">
              <p className="text-xs text-muted-foreground mb-1">Proposed Value</p>
              <p className="text-sm text-emerald-700">
                {Array.isArray(change.current) 
                  ? change.current.join(', ') 
                  : String(change.current || '—')}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function WorkflowStepper({ status }: { status: string }) {
  const steps = [
    { id: 'submitted', label: 'Submitted', icon: FileText },
    { id: 'auto_review', label: 'Auto Review', icon: CheckCircle },
    { id: 'manual_review', label: 'Manual Review', icon: User },
    { id: 'decision', label: 'Decision', icon: CheckCircle },
  ];

  const currentStep = status === 'pending' ? 2 : status === 'approved' || status === 'rejected' ? 3 : 1;

  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => {
        const StepIcon = step.icon;
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;

        return (
          <div key={step.id} className="flex items-center">
            <div className={cn(
              'flex flex-col items-center',
              isCompleted && 'text-emerald-600',
              isCurrent && 'text-primary'
            )}>
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center border-2',
                isCompleted && 'bg-emerald-100 border-emerald-500',
                isCurrent && 'bg-primary/10 border-primary',
                !isCompleted && !isCurrent && 'bg-muted border-border'
              )}>
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <StepIcon className="h-4 w-4" />
                )}
              </div>
              <span className="text-xs mt-1">{step.label}</span>
            </div>
            {index < steps.length - 1 && (
              <div className={cn(
                'w-12 h-0.5 mx-2',
                index < currentStep ? 'bg-emerald-500' : 'bg-border'
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function ApprovalDetailDialog({ 
  request, 
  open, 
  onClose,
  onApprove,
  onReject,
  onRequestInfo
}: { 
  request: ApprovalRequest | null; 
  open: boolean; 
  onClose: () => void;
  onApprove: (comment?: string) => void;
  onReject: (reason: string) => void;
  onRequestInfo: (questions: string) => void;
}) {
  const [comment, setComment] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [infoQuestions, setInfoQuestions] = useState('');

  if (!request) return null;

  const typeConfig = approvalTypeConfig[request.type];
  const TypeIcon = typeConfig.icon;

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className={cn('p-2 rounded-lg', typeConfig.color)}>
                <TypeIcon className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle>{request.entityName || request.type.replace('_', ' ')}</DialogTitle>
                <DialogDescription>
                  Submitted by {request.requester} on {formatDate(request.submittedAt)}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <ScrollArea className="h-[calc(90vh-200px)]">
            <div className="space-y-6 pr-4">
              {/* Workflow Stepper */}
              <Card>
                <CardContent className="p-4">
                  <WorkflowStepper status={request.status} />
                </CardContent>
              </Card>

              {/* Request Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Request Type</p>
                  <p className="font-medium">{typeConfig.label}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Priority</p>
                  <div className="flex items-center gap-2">
                    <div className={cn('w-2 h-2 rounded-full', priorityConfig[request.priority].color)} />
                    <span className="font-medium capitalize">{request.priority}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Entity Type</p>
                  <p className="font-medium capitalize">{request.entityType || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className={statusConfig[request.status].color}>
                    {statusConfig[request.status].label}
                  </Badge>
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">Description</p>
                <p className="text-sm bg-muted p-3 rounded-lg">{request.description}</p>
              </div>

              {/* Changes */}
              {request.changes.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-3">Proposed Changes</p>
                  <DiffView changes={request.changes} />
                </div>
              )}

              {/* XREF Visualization */}
              {request.type === 'XREF_CORRECTION' && (
                <div>
                  <p className="text-sm font-medium mb-3">Relationship Change</p>
                  <Card className="p-4">
                    <div className="flex items-center justify-center gap-4">
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
                          <User className="h-8 w-8 text-blue-600" />
                        </div>
                        <p className="text-sm font-medium">Dr. Elena Vance</p>
                        <p className="text-xs text-muted-foreground">Scholar</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-xs text-rose-600 mb-1">BREAK</span>
                        <X className="h-6 w-6 text-rose-500" />
                        <span className="text-xs text-muted-foreground mt-1">Old Link</span>
                      </div>
                      <div className="text-center opacity-50">
                        <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-2">
                          <Building2 className="h-8 w-8 text-purple-600" />
                        </div>
                        <p className="text-sm font-medium">Harvard University</p>
                      </div>
                      <ArrowUpRight className="h-6 w-6 text-muted-foreground" />
                      <div className="flex flex-col items-center">
                        <span className="text-xs text-emerald-600 mb-1">CREATE</span>
                        <Check className="h-6 w-6 text-emerald-500" />
                        <span className="text-xs text-muted-foreground mt-1">New Link</span>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-2">
                          <Building2 className="h-8 w-8 text-purple-600" />
                        </div>
                        <p className="text-sm font-medium">MIT</p>
                        <p className="text-xs text-muted-foreground">New Affiliation</p>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* Comment Input */}
              {request.status === 'pending' && (
                <div>
                  <p className="text-sm font-medium mb-2">Add Comment (Optional)</p>
                  <Textarea 
                    placeholder="Enter your comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                  />
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Actions */}
          {request.status === 'pending' && (
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowInfoDialog(true)}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Request Info
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => setShowRejectDialog(true)}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Reject
              </Button>
              <Button 
                onClick={() => onApprove(comment)}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejection
            </DialogDescription>
          </DialogHeader>
          <Textarea 
            placeholder="Enter rejection reason..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                onReject(rejectReason);
                setShowRejectDialog(false);
              }}
              disabled={!rejectReason.trim()}
            >
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Request Info Dialog */}
      <Dialog open={showInfoDialog} onOpenChange={setShowInfoDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request More Information</DialogTitle>
            <DialogDescription>
              What additional information do you need?
            </DialogDescription>
          </DialogHeader>
          <Textarea 
            placeholder="Enter your questions..."
            value={infoQuestions}
            onChange={(e) => setInfoQuestions(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInfoDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => {
                onRequestInfo(infoQuestions);
                setShowInfoDialog(false);
              }}
              disabled={!infoQuestions.trim()}
            >
              Send Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function ApprovalCenter() {
  const { 
    approvalRequests,
    approveRequest,
    rejectRequest,
    requestMoreInfo,
    addToast,
    currentUser
  } = useAppStore();
  
  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null);
  const [activeTab, setActiveTab] = useState('pending');

  const filteredRequests = approvalRequests.filter((r: ApprovalRequest) => {
    if (activeTab === 'pending') return r.status === 'pending';
    if (activeTab === 'approved') return r.status === 'approved';
    if (activeTab === 'rejected') return r.status === 'rejected';
    if (activeTab === 'my_submissions') return r.requester === currentUser.name;
    return true;
  });

  const handleApprove = (comment?: string) => {
    if (selectedRequest) {
      approveRequest(selectedRequest.id, comment);
      addToast({
        type: 'success',
        title: 'Request Approved',
        message: 'The request has been approved and changes applied',
      });
      setSelectedRequest(null);
    }
  };

  const handleReject = (reason: string) => {
    if (selectedRequest) {
      rejectRequest(selectedRequest.id, reason);
      addToast({
        type: 'info',
        title: 'Request Rejected',
        message: 'The request has been rejected',
      });
      setSelectedRequest(null);
    }
  };

  const handleRequestInfo = (questions: string) => {
    if (selectedRequest) {
      requestMoreInfo(selectedRequest.id, questions);
      addToast({
        type: 'warning',
        title: 'Info Requested',
        message: 'Request sent back to submitter for more information',
      });
      setSelectedRequest(null);
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Approval Center</h1>
          <p className="text-muted-foreground mt-1">
            Review and approve data governance requests
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="pending">
            Pending
            <Badge variant="secondary" className="ml-2">
              {approvalRequests.filter((r: ApprovalRequest) => r.status === 'pending').length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
          <TabsTrigger value="my_submissions">My Submissions</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">No requests found</h3>
              <p className="text-muted-foreground mt-1">
                There are no requests in this category
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((request: ApprovalRequest) => {
                const typeConfig = approvalTypeConfig[request.type];
                const TypeIcon = typeConfig.icon;

                return (
                  <Card 
                    key={request.id} 
                    className="cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => setSelectedRequest(request)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className={cn('p-2 rounded-lg', typeConfig.color)}>
                            <TypeIcon className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{request.entityName || request.type.replace('_', ' ')}</h3>
                              <Badge className={statusConfig[request.status].color}>
                                {statusConfig[request.status].label}
                              </Badge>
                              <div className={cn('w-2 h-2 rounded-full', priorityConfig[request.priority].color)} />
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {request.description}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <User className="h-3.5 w-3.5" />
                                {request.requester}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                {formatDate(request.submittedAt)}
                              </span>
                              {request.entityType && (
                                <span className="flex items-center gap-1">
                                  {request.entityType === 'scholar' ? (
                                    <User className="h-3.5 w-3.5" />
                                  ) : (
                                    <Building2 className="h-3.5 w-3.5" />
                                  )}
                                  {request.entityType}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Detail Dialog */}
      <ApprovalDetailDialog
        request={selectedRequest}
        open={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        onApprove={handleApprove}
        onReject={handleReject}
        onRequestInfo={handleRequestInfo}
      />
    </div>
  );
}
