import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  Briefcase,
  ChevronRight,
  Clock,
  Filter,
  Folder,
  FolderOpen,
  MoreHorizontal,
  Pause,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useInvestigationStore } from "@/stores/investigationStore";
import { api } from "@/services/api";
import type { InvestigationStatus, InvestigationPriority, CaseGroup } from "@/services/types";
import InvestigationForm from "./InvestigationForm";

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
const priorityConfig: Record<
  InvestigationPriority,
  { label: string; color: string }
> = {
  low: { label: "Low", color: "bg-gray-500/10 text-gray-400 border-gray-500/30" },
  medium: { label: "Medium", color: "bg-blue-500/10 text-blue-400 border-blue-500/30" },
  high: { label: "High", color: "bg-orange-500/10 text-orange-400 border-orange-500/30" },
  critical: { label: "Critical", color: "bg-red-500/10 text-red-400 border-red-500/30" },
};

/**
 * Main investigations list page with filtering and search
 */
const InvestigationsHome = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<InvestigationStatus | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<InvestigationPriority | "all">("all");
  const [groupFilter, setGroupFilter] = useState<string | "all">("all");
  
  // Group management dialog state
  const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<CaseGroup | null>(null);
  const [groupFormData, setGroupFormData] = useState({ name: "", description: "" });
  const [isGroupFormLoading, setIsGroupFormLoading] = useState(false);

  const {
    investigations,
    stats,
    listStatus,
    listError,
    listParams,
    setInvestigations,
    setListStatus,
    setListError,
    setListParams,
    isCreateDialogOpen,
    openCreateDialog,
    closeCreateDialog,
    addInvestigationToList,
    groups,
    groupsStatus,
    setGroups,
    setGroupsStatus,
    addGroup,
    updateGroup,
    removeGroup,
    updateInvestigationGroup,
  } = useInvestigationStore();

  // Check for ?action=new query param to auto-open create dialog
  useEffect(() => {
    if (searchParams.get("action") === "new") {
      openCreateDialog();
      // Clear the query param to avoid reopening on navigation
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, openCreateDialog, setSearchParams]);

  // Fetch groups on mount
  useEffect(() => {
    const fetchGroups = async () => {
      setGroupsStatus("loading");
      try {
        const groupsData = await api.getGroups();
        setGroups(groupsData);
        setGroupsStatus("success");
      } catch (error) {
        console.error("Failed to load groups:", error);
        setGroupsStatus("error");
      }
    };
    fetchGroups();
  }, []);

  // Fetch investigations on mount and when filters change
  useEffect(() => {
    const fetchInvestigations = async () => {
      setListStatus("loading");
      try {
        const params = {
          ...listParams,
          search: searchQuery || undefined,
          status: statusFilter !== "all" ? statusFilter : undefined,
          priority: priorityFilter !== "all" ? priorityFilter : undefined,
          groupId: groupFilter !== "all" ? groupFilter : undefined,
        };
        const response = await api.getInvestigations(params);
        setInvestigations(response.investigations, response.total, response.stats);
      } catch (error) {
        setListError(error instanceof Error ? error.message : "Failed to load investigations");
      }
    };

    // Debounce search
    const timeoutId = setTimeout(fetchInvestigations, searchQuery ? 300 : 0);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, statusFilter, priorityFilter, groupFilter, listParams.sortBy, listParams.sortOrder]);

  // Filter counts for badges
  const filterCounts = useMemo(() => ({
    all: stats.total,
    ...stats.byStatus,
  }), [stats]);

  // Get group name by ID helper
  const getGroupName = useCallback((groupId: string | null) => {
    if (!groupId) return null;
    const group = groups.find(g => g.id === groupId);
    return group?.name ?? null;
  }, [groups]);

  // Handle investigation card click
  const handleInvestigationClick = (id: string) => {
    navigate(`/app/investigations/${id}`);
  };

  // Handle new investigation created
  const handleInvestigationCreated = async (investigation: import("@/services/types").Investigation) => {
    addInvestigationToList(investigation);
    closeCreateDialog();
    navigate(`/app/investigations/${investigation.id}`);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setGroupFilter("all");
  };

  const hasActiveFilters = searchQuery || statusFilter !== "all" || priorityFilter !== "all" || groupFilter !== "all";

  // Group management handlers
  const openGroupDialog = (group?: CaseGroup) => {
    if (group) {
      setEditingGroup(group);
      setGroupFormData({ name: group.name, description: group.description || "" });
    } else {
      setEditingGroup(null);
      setGroupFormData({ name: "", description: "" });
    }
    setIsGroupDialogOpen(true);
  };

  const closeGroupDialog = () => {
    setIsGroupDialogOpen(false);
    setEditingGroup(null);
    setGroupFormData({ name: "", description: "" });
  };

  const handleGroupSubmit = async () => {
    if (!groupFormData.name.trim()) return;
    
    setIsGroupFormLoading(true);
    try {
      if (editingGroup) {
        // Update existing group
        const updated = await api.updateGroup(editingGroup.id, {
          name: groupFormData.name.trim(),
          description: groupFormData.description.trim() || undefined,
        });
        if (updated) {
          updateGroup(editingGroup.id, updated);
        }
      } else {
        // Create new group
        const created = await api.createGroup({
          name: groupFormData.name.trim(),
          description: groupFormData.description.trim() || undefined,
        });
        addGroup(created);
      }
      closeGroupDialog();
    } catch (error) {
      console.error("Failed to save group:", error);
    } finally {
      setIsGroupFormLoading(false);
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    try {
      await api.deleteGroup(groupId);
      removeGroup(groupId);
      // Reset filter if the deleted group was selected
      if (groupFilter === groupId) {
        setGroupFilter("all");
      }
    } catch (error) {
      console.error("Failed to delete group:", error);
    }
  };

  // Handler to assign investigation to a group (callable from UI)
  const handleAssignToGroup = async (investigationId: string, newGroupId: string | null) => {
    const investigation = investigations.find(inv => inv.id === investigationId);
    if (!investigation || investigation.groupId === newGroupId) return;
    
    // Optimistically update local state
    updateInvestigationGroup(investigationId, newGroupId);
    
    // Call API to persist change
    try {
      await api.assignInvestigationToGroup(investigationId, newGroupId);
    } catch (error) {
      // Revert on error
      console.error("Failed to update investigation group:", error);
      updateInvestigationGroup(investigationId, investigation.groupId);
    }
  };

  return (
    <div className="flex-1 px-6 md:px-16 py-10 text-foreground">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <Badge className="bg-experimental-green/20 text-experimental-green-foreground mb-3 hover:bg-experimental-green/20">
            Case Management
          </Badge>
          <h1 className="mt-4 text-3xl font-semibold">Investigations</h1>
          <p className="mt-2 max-w-2xl text-sm text-foreground/70">
            Manage your investigations, track progress, and organize evidence and findings.
          </p>
        </div>
        <Button onClick={openCreateDialog} className="gap-2">
          <Plus className="h-4 w-4" />
          New Investigation
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="mt-8 grid gap-4 grid-cols-2 md:grid-cols-4">
        {(Object.keys(statusConfig) as InvestigationStatus[]).map((status) => {
          const config = statusConfig[status];
          const Icon = config.icon;
          return (
            <Card
              key={status}
              className={`border-white/10 bg-white/5 backdrop-blur cursor-pointer transition-colors hover:bg-white/10 ${
                statusFilter === status ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setStatusFilter(statusFilter === status ? "all" : status)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${config.color.split(" ")[0]}`}>
                    <Icon className={`h-5 w-5 ${config.color.split(" ")[1]}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold">{stats.byStatus[status]}</p>
                    <p className="text-xs text-foreground/60">{config.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50" />
          <Input
            placeholder="Search investigations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/5 border-white/10"
          />
        </div>

        <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v as InvestigationPriority | "all")}>
          <SelectTrigger className="w-[140px] bg-white/5 border-white/10">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>

        {/* Group Filter with Management */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-[160px] justify-between bg-white/5 border-white/10">
              <span className="flex items-center gap-2">
                <Folder className="h-4 w-4" />
                <span className="truncate">
                  {groupFilter === "all" 
                    ? "All Groups" 
                    : groupFilter === "ungrouped"
                    ? "Ungrouped"
                    : getGroupName(groupFilter) || "Unknown"}
                </span>
              </span>
              <ChevronRight className="h-4 w-4 rotate-90" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[200px]">
            <DropdownMenuItem onClick={() => setGroupFilter("all")}>
              <Folder className="h-4 w-4 mr-2" />
              All Groups
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setGroupFilter("ungrouped")}>
              <FolderOpen className="h-4 w-4 mr-2" />
              Ungrouped
              {stats.byGroup.ungrouped > 0 && (
                <Badge variant="secondary" className="ml-auto text-xs">
                  {stats.byGroup.ungrouped}
                </Badge>
              )}
            </DropdownMenuItem>
            {groups.length > 0 && <DropdownMenuSeparator />}
            {groups.map((group) => (
              <div key={group.id} className="flex items-center group">
                <DropdownMenuItem 
                  className="flex-1"
                  onClick={() => setGroupFilter(group.id)}
                >
                  <Folder className="h-4 w-4 mr-2" />
                  <span className="truncate">{group.name}</span>
                  {stats.byGroup[group.id] !== undefined && (
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {stats.byGroup[group.id]}
                    </Badge>
                  )}
                </DropdownMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 mr-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" side="right">
                    <DropdownMenuItem onClick={() => openGroupDialog(group)}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDeleteGroup(group.id)}
                      className="text-red-400"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => openGroupDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              New Group
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Select
          value={listParams.sortBy || "updatedAt"}
          onValueChange={(v) => setListParams({ sortBy: v as "updatedAt" | "createdAt" | "priority" | "title" })}
        >
          <SelectTrigger className="w-[140px] bg-white/5 border-white/10">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="updatedAt">Last Updated</SelectItem>
            <SelectItem value="createdAt">Date Created</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
            <SelectItem value="title">Title</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-2 text-foreground/60">
            <X className="h-4 w-4" />
            Clear filters
          </Button>
        )}
      </div>

      {/* Investigation List */}
      <div className="mt-6 space-y-4">
        {listStatus === "loading" && (
          <>
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-white/10 bg-white/5 backdrop-blur">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full max-w-xl" />
                    </div>
                    <Skeleton className="h-8 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        )}

        {listStatus === "error" && (
          <Card className="border-red-500/30 bg-red-500/10">
            <CardContent className="p-6 flex items-center gap-4">
              <AlertCircle className="h-8 w-8 text-red-400" />
              <div>
                <p className="font-medium text-red-400">Failed to load investigations</p>
                <p className="text-sm text-red-400/70">{listError}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {listStatus === "success" && investigations.length === 0 && (
          <Card className="border-white/10 bg-white/5 backdrop-blur">
            <CardContent className="p-12 text-center">
              <FolderOpen className="h-12 w-12 mx-auto text-foreground/30 mb-4" />
              <h3 className="text-lg font-medium text-foreground/80">No investigations found</h3>
              <p className="text-sm text-foreground/50 mt-2">
                {hasActiveFilters
                  ? "Try adjusting your filters or search query"
                  : "Get started by creating your first investigation"}
              </p>
              {!hasActiveFilters && (
                <Button onClick={openCreateDialog} className="mt-4 gap-2">
                  <Plus className="h-4 w-4" />
                  New Investigation
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {listStatus === "success" && investigations.map((investigation) => {
          const statusCfg = statusConfig[investigation.status];
          const priorityCfg = priorityConfig[investigation.priority];
          const StatusIcon = statusCfg.icon;
          const groupName = getGroupName(investigation.groupId);

          return (
            <Card
              key={investigation.id}
              className="border-white/10 bg-white/5 backdrop-blur cursor-pointer transition-all hover:bg-white/10 hover:border-white/20"
              onClick={() => handleInvestigationClick(investigation.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Case number, group, and status */}
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="text-xs font-mono text-foreground/50">
                        {investigation.caseNumber}
                      </span>
                      {groupName && (
                        <Badge variant="outline" className="text-xs bg-white/5 border-white/20">
                          <Folder className="h-3 w-3 mr-1" />
                          {groupName}
                        </Badge>
                      )}
                      <Badge variant="outline" className={statusCfg.color}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusCfg.label}
                      </Badge>
                      <Badge variant="outline" className={priorityCfg.color}>
                        {priorityCfg.label}
                      </Badge>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-foreground truncate">
                      {investigation.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-foreground/60 mt-1 line-clamp-2">
                      {investigation.description}
                    </p>

                    {/* Tags and metadata */}
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      {investigation.tags.slice(0, 3).map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs bg-white/10 hover:bg-white/20"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {investigation.tags.length > 3 && (
                        <span className="text-xs text-foreground/50">
                          +{investigation.tags.length - 3} more
                        </span>
                      )}
                      <Separator orientation="vertical" className="h-4 bg-white/10" />
                      <span className="text-xs text-foreground/50">
                        Updated {new Date(investigation.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Arrow indicator */}
                  <ChevronRight className="h-5 w-5 text-foreground/30 flex-shrink-0" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Create Investigation Dialog */}
      <InvestigationForm
        open={isCreateDialogOpen}
        onOpenChange={(open) => (open ? openCreateDialog() : closeCreateDialog())}
        onSuccess={handleInvestigationCreated}
      />

      {/* Group Management Dialog */}
      <Dialog open={isGroupDialogOpen} onOpenChange={(open) => !open && closeGroupDialog()}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingGroup ? "Edit Group" : "Create New Group"}
            </DialogTitle>
            <DialogDescription>
              {editingGroup 
                ? "Update the group name and description."
                : "Create a new group to organize your investigations."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="groupName">Name</Label>
              <Input
                id="groupName"
                placeholder="Enter group name"
                value={groupFormData.name}
                onChange={(e) => setGroupFormData(prev => ({ ...prev, name: e.target.value }))}
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="groupDescription">Description (optional)</Label>
              <Textarea
                id="groupDescription"
                placeholder="Enter group description"
                value={groupFormData.description}
                onChange={(e) => setGroupFormData(prev => ({ ...prev, description: e.target.value }))}
                className="bg-white/5 border-white/10"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeGroupDialog}>
              Cancel
            </Button>
            <Button 
              onClick={handleGroupSubmit} 
              disabled={!groupFormData.name.trim() || isGroupFormLoading}
            >
              {isGroupFormLoading ? "Saving..." : editingGroup ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InvestigationsHome;
