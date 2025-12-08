import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
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
  Building2,
  ExternalLink,
  Loader2,
  Mail,
  MapPin,
  MoreVertical,
  Phone,
  Plus,
  Trash2,
  User,
  UserCircle,
  Users,
} from "lucide-react";
import { useInvestigationStore } from "@/stores/investigationStore";
import { api } from "@/services/api";
import type {
  InvestigationEntity,
  InvestigationEntityRole,
  OrganizationResult,
  AffiliateResult,
} from "@/services/types";
import { toast } from "@/components/ui/use-toast";

// Role configuration
const roleConfig: Record<InvestigationEntityRole, { label: string; color: string }> = {
  subject: { label: "Subject", color: "bg-red-500/10 text-red-400 border-red-500/30" },
  associate: { label: "Associate", color: "bg-orange-500/10 text-orange-400 border-orange-500/30" },
  witness: { label: "Witness", color: "bg-blue-500/10 text-blue-400 border-blue-500/30" },
  "company-of-interest": { label: "Company of Interest", color: "bg-purple-500/10 text-purple-400 border-purple-500/30" },
  other: { label: "Other", color: "bg-gray-500/10 text-gray-400 border-gray-500/30" },
};

/**
 * Investigation entities component for managing linked organizations and people
 */
const InvestigationEntities = () => {
  const [entityToDelete, setEntityToDelete] = useState<InvestigationEntity | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [filterType, setFilterType] = useState<"all" | "organization" | "affiliate">("all");

  const { activeInvestigation, removeEntityFromActive, openAddEntityDialog } = useInvestigationStore();

  if (!activeInvestigation) return null;

  // Filter entities
  const filteredEntities = activeInvestigation.entities.filter(
    (entity) => filterType === "all" || entity.entityType === filterType
  );

  // Group entities by role
  const entitiesByRole = filteredEntities.reduce(
    (acc, entity) => {
      if (!acc[entity.role]) acc[entity.role] = [];
      acc[entity.role].push(entity);
      return acc;
    },
    {} as Record<InvestigationEntityRole, InvestigationEntity[]>
  );

  // Counts
  const orgCount = activeInvestigation.entities.filter((e) => e.entityType === "organization").length;
  const peopleCount = activeInvestigation.entities.filter((e) => e.entityType === "affiliate").length;

  // Handle delete entity
  const handleDeleteEntity = async () => {
    if (!entityToDelete) return;

    setIsDeleting(true);
    try {
      const success = await api.unlinkEntityFromInvestigation(
        activeInvestigation.id,
        entityToDelete.id
      );
      if (success) {
        removeEntityFromActive(entityToDelete.id);
        toast({
          title: "Entity Removed",
          description: "The entity has been unlinked from this investigation.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove entity",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setEntityToDelete(null);
    }
  };

  // Render organization card
  const renderOrganizationCard = (entity: InvestigationEntity) => {
    const org = entity.entitySnapshot as OrganizationResult;
    const roleCfg = roleConfig[entity.role];

    return (
      <Card key={entity.id} className="border-white/10 bg-white/5 backdrop-blur">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Building2 className="h-5 w-5 text-purple-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold truncate">{org.approvedName || "Unknown Organization"}</h3>
                  <Badge variant="outline" className={roleCfg.color}>
                    {roleCfg.label}
                  </Badge>
                </div>

                {org.rcNumber && (
                  <p className="text-xs font-mono text-foreground/50 mt-1">RC: {org.rcNumber}</p>
                )}

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-foreground/60">
                  {org.state && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {org.city ? `${org.city}, ` : ""}{org.state}
                    </span>
                  )}
                  {org.status && (
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        org.status.toUpperCase() === "ACTIVE"
                          ? "border-green-500/30 text-green-400"
                          : "border-gray-500/30 text-gray-400"
                      }`}
                    >
                      {org.status}
                    </Badge>
                  )}
                </div>

                {org.email && (
                  <div className="flex items-center gap-1 mt-2 text-sm text-foreground/60">
                    <Mail className="h-3 w-3" />
                    {org.email}
                  </div>
                )}

                {entity.notes && (
                  <p className="text-sm text-foreground/50 mt-3 italic">"{entity.notes}"</p>
                )}

                <p className="text-xs text-foreground/40 mt-2">
                  Linked {new Date(entity.linkedAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => setEntityToDelete(entity)}
                  className="text-red-400 focus:text-red-400"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove from investigation
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Render affiliate card
  const renderAffiliateCard = (entity: InvestigationEntity) => {
    const aff = entity.entitySnapshot as AffiliateResult;
    const roleCfg = roleConfig[entity.role];
    const fullName = [aff.firstname, aff.otherName, aff.surname].filter(Boolean).join(" ");

    return (
      <Card key={entity.id} className="border-white/10 bg-white/5 backdrop-blur">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <User className="h-5 w-5 text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold truncate">{fullName || "Unknown Person"}</h3>
                  <Badge variant="outline" className={roleCfg.color}>
                    {roleCfg.label}
                  </Badge>
                </div>

                {aff.occupation && (
                  <p className="text-sm text-foreground/60 mt-1">{aff.occupation}</p>
                )}

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-foreground/60">
                  {aff.state && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {aff.city ? `${aff.city}, ` : ""}{aff.state}
                    </span>
                  )}
                  {aff.nationality && (
                    <span className="text-foreground/50">{aff.nationality}</span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-foreground/60">
                  {aff.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {aff.email}
                    </span>
                  )}
                  {aff.phoneNumber && (
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {aff.phoneNumber}
                    </span>
                  )}
                </div>

                {entity.notes && (
                  <p className="text-sm text-foreground/50 mt-3 italic">"{entity.notes}"</p>
                )}

                <p className="text-xs text-foreground/40 mt-2">
                  Linked {new Date(entity.linkedAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => setEntityToDelete(entity)}
                  className="text-red-400 focus:text-red-400"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove from investigation
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Linked Entities</h2>
          <p className="text-sm text-foreground/60">
            Organizations and people connected to this investigation
          </p>
        </div>
        <Button onClick={() => openAddEntityDialog()} className="gap-2">
          <Plus className="h-4 w-4" />
          Link Entity
        </Button>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        <Badge
          variant="outline"
          className={`cursor-pointer transition-colors ${
            filterType === "all" ? "bg-primary/20 border-primary" : "hover:bg-white/10"
          }`}
          onClick={() => setFilterType("all")}
        >
          All ({activeInvestigation.entities.length})
        </Badge>
        <Badge
          variant="outline"
          className={`cursor-pointer transition-colors ${
            filterType === "organization" ? "bg-purple-500/20 border-purple-500" : "hover:bg-white/10"
          }`}
          onClick={() => setFilterType(filterType === "organization" ? "all" : "organization")}
        >
          <Building2 className="h-3 w-3 mr-1" />
          Organizations ({orgCount})
        </Badge>
        <Badge
          variant="outline"
          className={`cursor-pointer transition-colors ${
            filterType === "affiliate" ? "bg-blue-500/20 border-blue-500" : "hover:bg-white/10"
          }`}
          onClick={() => setFilterType(filterType === "affiliate" ? "all" : "affiliate")}
        >
          <User className="h-3 w-3 mr-1" />
          People ({peopleCount})
        </Badge>
      </div>

      {/* Empty state */}
      {filteredEntities.length === 0 && (
        <Card className="border-white/10 bg-white/5">
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 mx-auto text-foreground/30 mb-4" />
            <h3 className="text-lg font-medium text-foreground/80">No entities linked</h3>
            <p className="text-sm text-foreground/50 mt-2 max-w-md mx-auto">
              {filterType !== "all"
                ? "No entities of this type have been linked yet"
                : "Link organizations and people from your search results to build your investigation network"}
            </p>
            <Button onClick={() => openAddEntityDialog()} className="mt-4 gap-2">
              <Plus className="h-4 w-4" />
              Link Entity
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Entities grouped by role */}
      {Object.entries(roleConfig).map(([role, config]) => {
        const entities = entitiesByRole[role as InvestigationEntityRole];
        if (!entities || entities.length === 0) return null;

        return (
          <div key={role} className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium text-foreground/70">{config.label}</h3>
              <Badge variant="secondary" className="text-xs bg-white/10">
                {entities.length}
              </Badge>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {entities.map((entity) =>
                entity.entityType === "organization"
                  ? renderOrganizationCard(entity)
                  : renderAffiliateCard(entity)
              )}
            </div>
          </div>
        );
      })}

      {/* Delete confirmation dialog */}
      <AlertDialog open={!!entityToDelete} onOpenChange={(open) => !open && setEntityToDelete(null)}>
        <AlertDialogContent className="bg-background/95 backdrop-blur border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Entity?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the entity from this investigation. The entity data will not be
              deleted, only the link to this investigation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting} className="border-white/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteEntity}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Remove Entity
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default InvestigationEntities;
