import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  Briefcase,
  Building2,
  Check,
  Plus,
  Search,
  User,
} from "lucide-react";
import { api } from "@/services/api";
import type {
  Investigation,
  InvestigationEntityRole,
  OrganizationResult,
  AffiliateResult,
} from "@/services/types";
import { cn } from "@/lib/utils";

// Entity type
type EntityType = "organization" | "affiliate";

// Role configuration
const roleConfig: Record<
  InvestigationEntityRole,
  { label: string; description: string }
> = {
  subject: {
    label: "Subject",
    description: "Primary target of investigation",
  },
  associate: {
    label: "Associate",
    description: "Connected person or organization",
  },
  witness: {
    label: "Witness",
    description: "Person with relevant information",
  },
  "company-of-interest": {
    label: "Company of Interest",
    description: "Business entity relevant to case",
  },
  other: {
    label: "Other",
    description: "Other relevance to case",
  },
};

interface AddToInvestigationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityType: EntityType;
  entity: OrganizationResult | AffiliateResult | null;
  onSuccess?: (investigationId: string) => void;
}

/**
 * Dialog for adding an entity (organization or affiliate) to an investigation
 * Allows selecting existing investigation or creating a new one
 */
const AddToInvestigationDialog = ({
  open,
  onOpenChange,
  entityType,
  entity,
  onSuccess,
}: AddToInvestigationDialogProps) => {
  // State
  const [investigations, setInvestigations] = useState<Investigation[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInvestigation, setSelectedInvestigation] = useState<Investigation | null>(null);
  const [selectedRole, setSelectedRole] = useState<InvestigationEntityRole>("associate");
  const [notes, setNotes] = useState("");
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newInvestigationTitle, setNewInvestigationTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Extract entity info for display
  const entityInfo = getEntityInfo(entityType, entity);

  // Fetch active investigations on open
  useEffect(() => {
    if (open) {
      fetchInvestigations();
      // Reset state
      setSelectedInvestigation(null);
      setSelectedRole("associate");
      setNotes("");
      setIsCreatingNew(false);
      setNewInvestigationTitle("");
      setError(null);
    }
  }, [open]);

  const fetchInvestigations = async () => {
    setLoading(true);
    try {
      const response = await api.getInvestigations({
        status: "active",
        limit: 50,
        sortBy: "updatedAt",
        sortOrder: "desc",
      });
      setInvestigations(response.investigations);
    } catch (err) {
      console.error("Failed to fetch investigations:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter investigations by search
  const filteredInvestigations = investigations.filter((inv) =>
    inv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle submit
  const handleSubmit = async () => {
    if (!entity) return;

    setSubmitting(true);
    setError(null);

    try {
      let targetInvestigationId: string;

      // Create new investigation if needed
      if (isCreatingNew) {
        if (!newInvestigationTitle.trim()) {
          setError("Please enter a title for the new investigation");
          setSubmitting(false);
          return;
        }

        const newInvestigation = await api.createInvestigation({
          title: newInvestigationTitle.trim(),
          description: `Investigation created from ${entityType} search result`,
          status: "active",
          priority: "medium",
          tags: [],
        });
        targetInvestigationId = newInvestigation.id;
      } else {
        if (!selectedInvestigation) {
          setError("Please select an investigation");
          setSubmitting(false);
          return;
        }
        targetInvestigationId = selectedInvestigation.id;
      }

      // Build payload based on entity type
      const payload = {
        entityType,
        role: selectedRole,
        notes: notes.trim() || undefined,
        ...(entityType === "organization"
          ? { organizationId: getOrganizationId(entity as OrganizationResult) }
          : { affiliateId: getAffiliateId(entity as AffiliateResult) }),
      };

      // Link entity to investigation
      await api.linkEntityToInvestigation(
        targetInvestigationId,
        payload,
        entity
      );

      onOpenChange(false);
      onSuccess?.(targetInvestigationId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add to investigation");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg border-white/10 bg-background/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            Add to Investigation
          </DialogTitle>
          <DialogDescription>
            Link this {entityType} to an existing investigation or create a new one.
          </DialogDescription>
        </DialogHeader>

        {/* Entity being added */}
        <div className="rounded-lg border border-white/10 bg-white/5 p-3">
          <div className="flex items-start gap-3">
            {entityType === "organization" ? (
              <Building2 className="h-5 w-5 text-primary mt-0.5" />
            ) : (
              <User className="h-5 w-5 text-primary mt-0.5" />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{entityInfo.name}</p>
              {entityInfo.subtitle && (
                <p className="text-xs text-muted-foreground truncate">
                  {entityInfo.subtitle}
                </p>
              )}
            </div>
            <Badge
              variant="outline"
              className="border-white/20 bg-white/5 text-xs capitalize"
            >
              {entityType}
            </Badge>
          </div>
        </div>

        {/* Role selection */}
        <div className="space-y-2">
          <Label>Role in Investigation</Label>
          <Select
            value={selectedRole}
            onValueChange={(value) => setSelectedRole(value as InvestigationEntityRole)}
          >
            <SelectTrigger className="border-white/20 bg-background/60">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(roleConfig).map(([role, config]) => (
                <SelectItem key={role} value={role}>
                  <div className="flex flex-col">
                    <span>{config.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {config.description}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label>Notes (optional)</Label>
          <Textarea
            placeholder="Add context about why this entity is relevant..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="border-white/20 bg-background/60 resize-none"
            rows={2}
          />
        </div>

        {/* Investigation selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Select Investigation</Label>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7"
              onClick={() => setIsCreatingNew(!isCreatingNew)}
            >
              {isCreatingNew ? (
                "Select existing"
              ) : (
                <>
                  <Plus className="h-3 w-3 mr-1" />
                  Create new
                </>
              )}
            </Button>
          </div>

          {isCreatingNew ? (
            <div className="space-y-2">
              <Input
                placeholder="New investigation title"
                value={newInvestigationTitle}
                onChange={(e) => setNewInvestigationTitle(e.target.value)}
                className="border-white/20 bg-background/60"
                autoFocus
              />
            </div>
          ) : (
            <>
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search investigations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 border-white/20 bg-background/60"
                />
              </div>

              {/* Investigation list */}
              <ScrollArea className="h-48 rounded-lg border border-white/10">
                {loading ? (
                  <div className="p-3 space-y-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : filteredInvestigations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                    <Briefcase className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {searchQuery
                        ? "No investigations match your search"
                        : "No active investigations"}
                    </p>
                    <Button
                      variant="link"
                      size="sm"
                      className="mt-1"
                      onClick={() => setIsCreatingNew(true)}
                    >
                      Create a new investigation
                    </Button>
                  </div>
                ) : (
                  <div className="p-2 space-y-1">
                    {filteredInvestigations.map((inv) => (
                      <button
                        key={inv.id}
                        onClick={() => setSelectedInvestigation(inv)}
                        className={cn(
                          "w-full text-left p-3 rounded-lg transition-colors",
                          "hover:bg-white/5",
                          selectedInvestigation?.id === inv.id
                            ? "bg-primary/10 border border-primary/30"
                            : "border border-transparent"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          {selectedInvestigation?.id === inv.id && (
                            <Check className="h-4 w-4 text-primary flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {inv.title}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {inv.caseNumber} •{" "}
                              {new Date(inv.updatedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-white/20"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              submitting ||
              (!isCreatingNew && !selectedInvestigation) ||
              (isCreatingNew && !newInvestigationTitle.trim())
            }
          >
            {submitting ? "Adding..." : "Add to Investigation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Helper to extract entity display info
function getEntityInfo(
  entityType: EntityType,
  entity: OrganizationResult | AffiliateResult | null
): { name: string; subtitle: string | null } {
  if (!entity) {
    return { name: "Unknown", subtitle: null };
  }

  if (entityType === "organization") {
    const org = entity as OrganizationResult;
    return {
      name: org.approvedName?.trim() || org.rcNumber || "Unnamed Organization",
      subtitle: org.rcNumber ? `RC ${org.rcNumber}` : null,
    };
  } else {
    const aff = entity as AffiliateResult;
    const name =
      [aff.firstname, aff.otherName, aff.surname]
        .filter(Boolean)
        .join(" ")
        .trim() || aff.email || "Unnamed Affiliate";
    return {
      name,
      subtitle: aff.occupation || aff.affiliate_type || null,
    };
  }
}

// Helper to extract organization ID for API payload
function getOrganizationId(org: OrganizationResult): number | undefined {
  // If there's a numeric ID field, use it; otherwise, parse from rcNumber
  if (org.rcNumber) {
    // Try to extract numeric portion from RC number (e.g., "RC123456" -> 123456)
    const numericMatch = org.rcNumber.match(/\d+/);
    if (numericMatch) {
      return parseInt(numericMatch[0], 10);
    }
  }
  // Return undefined if we can't extract a numeric ID
  return undefined;
}

// Helper to extract affiliate ID for API payload
function getAffiliateId(aff: AffiliateResult): string | undefined {
  // Use identity_number as primary ID, fall back to a generated ID
  return (
    aff.identity_number ||
    `${aff.firstname || ""}-${aff.surname || ""}-${aff.email || ""}`.trim() ||
    undefined
  );
}

export default AddToInvestigationDialog;
