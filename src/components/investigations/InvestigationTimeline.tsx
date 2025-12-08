import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Building2,
  CheckCircle,
  Clock,
  Edit,
  FileText,
  Folder,
  History,
  Link2,
  Plus,
  Settings,
  Trash2,
  TrendingUp,
  User,
  UserMinus,
  UserPlus,
  XCircle,
} from "lucide-react";
import { useInvestigationStore } from "@/stores/investigationStore";
import type { InvestigationTimelineEventType } from "@/services/types";

// Event type configuration
const eventTypeConfig: Record<
  InvestigationTimelineEventType,
  { label: string; icon: React.ElementType; color: string }
> = {
  created: { label: "Created", icon: Plus, color: "text-green-400" },
  status_changed: { label: "Status Changed", icon: Settings, color: "text-blue-400" },
  entity_added: { label: "Entity Added", icon: Link2, color: "text-purple-400" },
  entity_removed: { label: "Entity Removed", icon: XCircle, color: "text-red-400" },
  note_added: { label: "Note Added", icon: FileText, color: "text-cyan-400" },
  note_edited: { label: "Note Edited", icon: Edit, color: "text-yellow-400" },
  note_deleted: { label: "Note Deleted", icon: Trash2, color: "text-red-400" },
  priority_changed: { label: "Priority Changed", icon: TrendingUp, color: "text-orange-400" },
  details_updated: { label: "Details Updated", icon: Edit, color: "text-gray-400" },
  collaborator_added: { label: "Collaborator Added", icon: UserPlus, color: "text-green-400" },
  collaborator_removed: { label: "Collaborator Removed", icon: UserMinus, color: "text-red-400" },
};

// Group events by date
const groupEventsByDate = (events: import("@/services/types").InvestigationTimelineEvent[]) => {
  const groups: Record<string, import("@/services/types").InvestigationTimelineEvent[]> = {};

  events.forEach((event) => {
    const date = new Date(event.occurredAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    if (!groups[date]) groups[date] = [];
    groups[date].push(event);
  });

  return groups;
};

/**
 * Investigation timeline component showing activity history
 */
const InvestigationTimeline = () => {
  const { activeInvestigation } = useInvestigationStore();

  if (!activeInvestigation) return null;

  const groupedEvents = groupEventsByDate(activeInvestigation.timeline);
  const dateKeys = Object.keys(groupedEvents);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold">Activity Timeline</h2>
        <p className="text-sm text-foreground/60">
          A chronological record of all changes to this investigation
        </p>
      </div>

      {/* Empty state */}
      {activeInvestigation.timeline.length === 0 && (
        <Card className="border-white/10 bg-white/5">
          <CardContent className="p-12 text-center">
            <History className="h-12 w-12 mx-auto text-foreground/30 mb-4" />
            <h3 className="text-lg font-medium text-foreground/80">No activity yet</h3>
            <p className="text-sm text-foreground/50 mt-2">
              Activity will appear here as you work on this investigation
            </p>
          </CardContent>
        </Card>
      )}

      {/* Timeline */}
      {dateKeys.length > 0 && (
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[19px] top-0 bottom-0 w-px bg-white/10" />

          <div className="space-y-8">
            {dateKeys.map((date) => (
              <div key={date} className="space-y-4">
                {/* Date header */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center z-10">
                    <Clock className="h-4 w-4 text-foreground/50" />
                  </div>
                  <span className="text-sm font-medium text-foreground/70">{date}</span>
                </div>

                {/* Events for this date */}
                <div className="ml-5 pl-8 border-l border-white/10 space-y-4">
                  {groupedEvents[date].map((event) => {
                    const config = eventTypeConfig[event.eventType];
                    const Icon = config.icon;
                    const time = new Date(event.occurredAt).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                    return (
                      <div
                        key={event.id}
                        className="relative flex items-start gap-4 group"
                      >
                        {/* Connector dot */}
                        <div
                          className={`absolute -left-[25px] w-3 h-3 rounded-full border-2 border-background ${config.color.replace("text-", "bg-")}`}
                        />

                        {/* Event content */}
                        <Card className="flex-1 border-white/10 bg-white/5 backdrop-blur transition-colors group-hover:bg-white/10">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div
                                className={`p-2 rounded-lg bg-white/5 ${config.color}`}
                              >
                                <Icon className="h-4 w-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-medium text-sm">
                                    {event.description}
                                  </span>
                                </div>

                                {/* Render metadata */}
                                {event.metadata && (
                                  <div className="mt-2 space-y-1">
                                    {event.eventType === "status_changed" && event.metadata.oldStatus && (
                                      <div className="flex items-center gap-2 text-xs text-foreground/60">
                                        <Badge
                                          variant="outline"
                                          className="bg-white/5"
                                        >
                                          {String(event.metadata.oldStatus)}
                                        </Badge>
                                        <span>→</span>
                                        <Badge
                                          variant="outline"
                                          className="bg-white/5"
                                        >
                                          {String(event.metadata.newStatus)}
                                        </Badge>
                                      </div>
                                    )}
                                    {event.eventType === "priority_changed" && event.metadata.oldPriority && (
                                      <div className="flex items-center gap-2 text-xs text-foreground/60">
                                        <Badge
                                          variant="outline"
                                          className="bg-white/5"
                                        >
                                          {String(event.metadata.oldPriority)}
                                        </Badge>
                                        <span>→</span>
                                        <Badge
                                          variant="outline"
                                          className="bg-white/5"
                                        >
                                          {String(event.metadata.newPriority)}
                                        </Badge>
                                      </div>
                                    )}
                                    {event.eventType === "entity_added" && event.metadata.role && (
                                      <div className="flex items-center gap-2 text-xs text-foreground/60">
                                        <Badge variant="outline" className="bg-white/5">
                                          {event.metadata.entityType === "organization" ? (
                                            <Building2 className="h-3 w-3 mr-1" />
                                          ) : (
                                            <User className="h-3 w-3 mr-1" />
                                          )}
                                          {String(event.metadata.role)}
                                        </Badge>
                                      </div>
                                    )}
                                    {event.eventType === "note_added" && event.metadata.entryType && (
                                      <div className="flex items-center gap-2 text-xs text-foreground/60">
                                        <Badge variant="outline" className="bg-white/5">
                                          {String(event.metadata.entryType)}
                                        </Badge>
                                      </div>
                                    )}
                                  </div>
                                )}

                                <p className="text-xs text-foreground/40 mt-2">
                                  {time}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestigationTimeline;
