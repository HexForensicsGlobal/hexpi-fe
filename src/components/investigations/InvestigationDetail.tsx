import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  AlertCircle,
  ArrowLeft,
  Briefcase,
  Building2,
  Calendar,
  Clock,
  Edit,
  FolderOpen,
  History,
  Loader2,
  NotebookPen,
  Pause,
  Plus,
  Trash2,
  User,
  Users,
} from "lucide-react";
import { useInvestigationStore } from "@/stores/investigationStore";
import { api } from "@/services/api";
import type { InvestigationStatus, InvestigationPriority } from "@/services/types";
import InvestigationForm from "./InvestigationForm";
import InvestigationJournal from "./InvestigationJournal";
import InvestigationEntities from "./InvestigationEntities";
import InvestigationTimeline from "./InvestigationTimeline";
import { toast } from "@/components/ui/use-toast";

// Status configuration
const statusConfig: Record<
  InvestigationStatus,
  { label: string; color: string; icon: React.ElementType }
> = {
  draft: { label: "Draft", color: "bg-gray-500/10 text-gray-400 border-gray-500/30", icon: FolderOpen },
  active: { label: "Active", color: "bg-green-500/10 text-green-400 border-green-500/30", icon: Briefcase },
  "on-hold": { label: "On Hold", color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30", icon: Pause },
  closed: { label: "Closed", color: "bg-blue-500/10 text-blue-400 border-blue-500/30", icon: Clock },
};

// Priority configuration
const priorityConfig: Record<InvestigationPriority, { label: string; color: string }> = {
  low: { label: "Low", color: "bg-gray-500/10 text-gray-400 border-gray-500/30" },
  medium: { label: "Medium", color: "bg-blue-500/10 text-blue-400 border-blue-500/30" },
  high: { label: "High", color: "bg-orange-500/10 text-orange-400 border-orange-500/30" },
  critical: { label: "Critical", color: "bg-red-500/10 text-red-400 border-red-500/30" },
};

/**
 * Investigation detail page with journal, entities, and timeline tabs
 */
const InvestigationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    activeInvestigation,
    detailStatus,
    detailError,
    setActiveInvestigation,
    setDetailStatus,
    setDetailError,
    clearActiveInvestigation,
    updateActiveInvestigation,
    isEditDialogOpen,
    openEditDialog,
    closeEditDialog,
    removeInvestigationFromList,
  } = useInvestigationStore();

  // Fetch investigation on mount
  useEffect(() => {
    if (!id) return;

    const fetchInvestigation = async () => {
      setDetailStatus("loading");
      try {
        const investigation = await api.getInvestigation(id);
        if (investigation) {
          setActiveInvestigation(investigation);
        } else {
          setDetailError("Investigation not found");
        }
      } catch (error) {
        setDetailError(error instanceof Error ? error.message : "Failed to load investigation");
      }
    };

    fetchInvestigation();

    return () => {
      clearActiveInvestigation();
    };
  }, [id]);

  // Handle edit success
  const handleEditSuccess = (updated: import("@/services/types").Investigation) => {
    updateActiveInvestigation(updated);
    closeEditDialog();
  };

  // Handle delete
  const handleDelete = async () => {
    if (!id) return;

    setIsDeleting(true);
    try {
      const success = await api.deleteInvestigation(id);
      if (success) {
        removeInvestigationFromList(id);
        toast({
          title: "Investigation Deleted",
          description: "The investigation has been permanently deleted.",
        });
        navigate("/app/investigations");
      } else {
        throw new Error("Failed to delete investigation");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete investigation",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  // Loading state
  if (detailStatus === "loading") {
    return (
      <div className="flex-1 px-6 md:px-16 py-10 text-foreground">
        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-96" />
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <Skeleton className="h-[500px] rounded-2xl" />
          <Skeleton className="h-[300px] rounded-2xl" />
        </div>
      </div>
    );
  }

  // Error state
  if (detailStatus === "error") {
    return (
      <div className="flex-1 px-6 md:px-16 py-10 text-foreground">
        <Button
          variant="ghost"
          onClick={() => navigate("/app/investigations")}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Investigations
        </Button>
        <Card className="border-red-500/30 bg-red-500/10">
          <CardContent className="p-6 flex items-center gap-4">
            <AlertCircle className="h-8 w-8 text-red-400" />
            <div>
              <p className="font-medium text-red-400">Error loading investigation</p>
              <p className="text-sm text-red-400/70">{detailError}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No data state
  if (!activeInvestigation) {
    return (
      <div className="flex-1 px-6 md:px-16 py-10 text-foreground">
        <Button
          variant="ghost"
          onClick={() => navigate("/app/investigations")}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Investigations
        </Button>
        <Card className="border-white/10 bg-white/5">
          <CardContent className="p-12 text-center">
            <FolderOpen className="h-12 w-12 mx-auto text-foreground/30 mb-4" />
            <h3 className="text-lg font-medium text-foreground/80">Investigation not found</h3>
            <p className="text-sm text-foreground/50 mt-2">
              This investigation may have been deleted or you don't have access to it.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusCfg = statusConfig[activeInvestigation.status];
  const priorityCfg = priorityConfig[activeInvestigation.priority];
  const StatusIcon = statusCfg.icon;

  return (
    <div className="flex-1 px-6 md:px-16 py-10 text-foreground">
      {/* Back button */}
      <Button
        variant="ghost"
        onClick={() => navigate("/app/investigations")}
        className="mb-6 gap-2 -ml-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Investigations
      </Button>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-6 mb-8">
        <div className="flex-1 min-w-0">
          {/* Case number and badges */}
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className="text-sm font-mono text-foreground/50">
              {activeInvestigation.caseNumber}
            </span>
            <Badge variant="outline" className={statusCfg.color}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {statusCfg.label}
            </Badge>
            <Badge variant="outline" className={priorityCfg.color}>
              {priorityCfg.label} Priority
            </Badge>
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-semibold truncate">
            {activeInvestigation.title}
          </h1>

          {/* Description */}
          <p className="text-foreground/60 mt-2 max-w-3xl">
            {activeInvestigation.description}
          </p>

          {/* Tags */}
          {activeInvestigation.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {activeInvestigation.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-white/10">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" onClick={openEditDialog} className="gap-2 border-white/10">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsDeleteDialogOpen(true)}
            className="gap-2 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Left side - Tabs */}
        <Tabs defaultValue="journal" className="space-y-6">
          <TabsList className="bg-white/5 border border-white/10 p-1">
            <TabsTrigger value="journal" className="gap-2 data-[state=active]:bg-white/10">
              <NotebookPen className="h-4 w-4" />
              Journal
              <Badge variant="secondary" className="ml-1 bg-white/10 text-xs">
                {activeInvestigation.notes.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="entities" className="gap-2 data-[state=active]:bg-white/10">
              <Users className="h-4 w-4" />
              Entities
              <Badge variant="secondary" className="ml-1 bg-white/10 text-xs">
                {activeInvestigation.entities.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="timeline" className="gap-2 data-[state=active]:bg-white/10">
              <History className="h-4 w-4" />
              Timeline
              <Badge variant="secondary" className="ml-1 bg-white/10 text-xs">
                {activeInvestigation.timeline.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="journal" className="mt-6">
            <InvestigationJournal />
          </TabsContent>

          <TabsContent value="entities" className="mt-6">
            <InvestigationEntities />
          </TabsContent>

          <TabsContent value="timeline" className="mt-6">
            <InvestigationTimeline />
          </TabsContent>
        </Tabs>

        {/* Right side - Info panel */}
        <div className="space-y-6">
          {/* Details card */}
          <Card className="border-white/10 bg-white/5 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-foreground/70">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-foreground/50" />
                <div>
                  <p className="text-foreground/50">Created</p>
                  <p>{new Date(activeInvestigation.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}</p>
                </div>
              </div>

              <Separator className="bg-white/10" />

              <div className="flex items-center gap-3 text-sm">
                <Clock className="h-4 w-4 text-foreground/50" />
                <div>
                  <p className="text-foreground/50">Last Updated</p>
                  <p>{new Date(activeInvestigation.updatedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}</p>
                </div>
              </div>

              {activeInvestigation.closedAt && (
                <>
                  <Separator className="bg-white/10" />
                  <div className="flex items-center gap-3 text-sm">
                    <FolderOpen className="h-4 w-4 text-foreground/50" />
                    <div>
                      <p className="text-foreground/50">Closed</p>
                      <p>{new Date(activeInvestigation.closedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}</p>
                      {activeInvestigation.closureReason && (
                        <Badge variant="outline" className="mt-1 text-xs">
                          {activeInvestigation.closureReason}
                        </Badge>
                      )}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Quick stats card */}
          <Card className="border-white/10 bg-white/5 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-foreground/70">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <NotebookPen className="h-4 w-4 text-foreground/50" />
                  <span className="text-foreground/70">Journal Entries</span>
                </div>
                <span className="font-semibold">{activeInvestigation.notes.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="h-4 w-4 text-foreground/50" />
                  <span className="text-foreground/70">Organizations</span>
                </div>
                <span className="font-semibold">
                  {activeInvestigation.entities.filter((e) => e.entityType === "organization").length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-foreground/50" />
                  <span className="text-foreground/70">People</span>
                </div>
                <span className="font-semibold">
                  {activeInvestigation.entities.filter((e) => e.entityType === "affiliate").length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <History className="h-4 w-4 text-foreground/50" />
                  <span className="text-foreground/70">Timeline Events</span>
                </div>
                <span className="font-semibold">{activeInvestigation.timeline.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit dialog */}
      <InvestigationForm
        open={isEditDialogOpen}
        onOpenChange={(open) => (open ? openEditDialog() : closeEditDialog())}
        onSuccess={handleEditSuccess}
        investigation={activeInvestigation}
      />

      {/* Delete confirmation dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-background/95 backdrop-blur border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Investigation?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{activeInvestigation.title}" and all associated notes,
              entities, and timeline events. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting} className="border-white/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete Investigation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default InvestigationDetail;
