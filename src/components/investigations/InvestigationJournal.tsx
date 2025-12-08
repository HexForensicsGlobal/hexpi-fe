import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertCircle,
  Brain,
  CheckCircle,
  Compass,
  FileText,
  Lightbulb,
  Loader2,
  MoreVertical,
  Pin,
  PinOff,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useInvestigationStore } from "@/stores/investigationStore";
import { api } from "@/services/api";
import type { InvestigationNote, InvestigationNoteType, CreateInvestigationNotePayload } from "@/services/types";
import { toast } from "@/components/ui/use-toast";

// Note type configuration
const noteTypeConfig: Record<
  InvestigationNoteType,
  { label: string; color: string; icon: React.ElementType; description: string }
> = {
  hypothesis: {
    label: "Hypothesis",
    color: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    icon: Brain,
    description: "A theory or assumption to be tested",
  },
  finding: {
    label: "Finding",
    color: "bg-green-500/10 text-green-400 border-green-500/30",
    icon: CheckCircle,
    description: "Confirmed facts or verified information",
  },
  lead: {
    label: "Lead",
    color: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    icon: Compass,
    description: "Information to follow up on",
  },
  decision: {
    label: "Decision",
    color: "bg-orange-500/10 text-orange-400 border-orange-500/30",
    icon: Lightbulb,
    description: "Key decisions made during the investigation",
  },
  general: {
    label: "General",
    color: "bg-gray-500/10 text-gray-400 border-gray-500/30",
    icon: FileText,
    description: "General notes and observations",
  },
};

/**
 * Investigation journal component for managing notes
 */
const InvestigationJournal = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterType, setFilterType] = useState<InvestigationNoteType | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Form state
  const [noteType, setNoteType] = useState<InvestigationNoteType>("general");
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [notePinned, setNotePinned] = useState(false);

  const {
    activeInvestigation,
    addNoteToActive,
    updateNoteInActive,
    removeNoteFromActive,
  } = useInvestigationStore();

  if (!activeInvestigation) return null;

  // Filter and search notes
  const filteredNotes = activeInvestigation.notes
    .filter((note) => filterType === "all" || note.entryType === filterType)
    .filter(
      (note) =>
        !searchQuery ||
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      // Pinned notes first, then by date
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  // Reset form
  const resetForm = () => {
    setNoteType("general");
    setNoteTitle("");
    setNoteContent("");
    setNotePinned(false);
  };

  // Handle add note
  const handleAddNote = async () => {
    if (!noteTitle.trim() || !noteContent.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a title and content for your note",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: CreateInvestigationNotePayload = {
        entryType: noteType,
        title: noteTitle.trim(),
        content: noteContent.trim(),
        isPinned: notePinned,
      };

      const newNote = await api.addInvestigationNote(activeInvestigation.id, payload);
      if (newNote) {
        addNoteToActive(newNote);
        toast({
          title: "Note Added",
          description: `${noteTypeConfig[noteType].label} "${noteTitle}" has been added to the journal.`,
        });
        setIsAddDialogOpen(false);
        resetForm();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add note",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle toggle pin
  const handleTogglePin = async (note: InvestigationNote) => {
    try {
      const updated = await api.updateInvestigationNote(activeInvestigation.id, note.id, {
        isPinned: !note.isPinned,
      });
      if (updated) {
        updateNoteInActive(note.id, { isPinned: updated.isPinned });
        toast({
          title: updated.isPinned ? "Note Pinned" : "Note Unpinned",
          description: `"${note.title}" has been ${updated.isPinned ? "pinned" : "unpinned"}.`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update note",
        variant: "destructive",
      });
    }
  };

  // Handle delete note
  const handleDeleteNote = async (note: InvestigationNote) => {
    try {
      const success = await api.deleteInvestigationNote(activeInvestigation.id, note.id);
      if (success) {
        removeNoteFromActive(note.id);
        toast({
          title: "Note Deleted",
          description: `"${note.title}" has been deleted from the journal.`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Investigation Journal</h2>
          <p className="text-sm text-foreground/60">
            Track hypotheses, findings, leads, and decisions
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Entry
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50" />
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/5 border-white/10"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge
            variant="outline"
            className={`cursor-pointer transition-colors ${
              filterType === "all" ? "bg-primary/20 border-primary" : "hover:bg-white/10"
            }`}
            onClick={() => setFilterType("all")}
          >
            All ({activeInvestigation.notes.length})
          </Badge>
          {(Object.keys(noteTypeConfig) as InvestigationNoteType[]).map((type) => {
            const config = noteTypeConfig[type];
            const count = activeInvestigation.notes.filter((n) => n.entryType === type).length;
            return (
              <Badge
                key={type}
                variant="outline"
                className={`cursor-pointer transition-colors ${
                  filterType === type ? config.color : "hover:bg-white/10"
                }`}
                onClick={() => setFilterType(filterType === type ? "all" : type)}
              >
                {config.label} ({count})
              </Badge>
            );
          })}
        </div>
      </div>

      {/* Notes list */}
      <div className="space-y-4">
        {filteredNotes.length === 0 && (
          <Card className="border-white/10 bg-white/5">
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 mx-auto text-foreground/30 mb-4" />
              <h3 className="text-lg font-medium text-foreground/80">No notes yet</h3>
              <p className="text-sm text-foreground/50 mt-2">
                {searchQuery || filterType !== "all"
                  ? "Try adjusting your search or filters"
                  : "Start documenting your investigation by adding a journal entry"}
              </p>
            </CardContent>
          </Card>
        )}

        {filteredNotes.map((note) => {
          const config = noteTypeConfig[note.entryType];
          const Icon = config.icon;

          return (
            <Card key={note.id} className="border-white/10 bg-white/5 backdrop-blur">
              <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${config.color.split(" ")[0]}`}>
                      <Icon className={`h-4 w-4 ${config.color.split(" ")[1]}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{note.title}</h3>
                        {note.isPinned && <Pin className="h-3 w-3 text-primary" />}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className={config.color}>
                          {config.label}
                        </Badge>
                        <span className="text-xs text-foreground/50">
                          {new Date(note.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleTogglePin(note)}>
                        {note.isPinned ? (
                          <>
                            <PinOff className="h-4 w-4 mr-2" />
                            Unpin
                          </>
                        ) : (
                          <>
                            <Pin className="h-4 w-4 mr-2" />
                            Pin to top
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteNote(note)}
                        className="text-red-400 focus:text-red-400"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Content */}
                <div className="prose prose-invert prose-sm max-w-none text-foreground/80">
                  {note.content.split("\n").map((paragraph, idx) => (
                    <p key={idx} className="mb-2 last:mb-0 whitespace-pre-wrap">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {note.updatedAt !== note.createdAt && (
                  <p className="text-xs text-foreground/40 mt-4">
                    Edited {new Date(note.updatedAt).toLocaleDateString()}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add Note Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-background/95 backdrop-blur border-white/10">
          <DialogHeader>
            <DialogTitle>Add Journal Entry</DialogTitle>
            <DialogDescription>
              Document your findings, hypotheses, leads, or decisions.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            {/* Entry Type */}
            <div className="space-y-2">
              <Label>Entry Type</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {(Object.keys(noteTypeConfig) as InvestigationNoteType[]).map((type) => {
                  const config = noteTypeConfig[type];
                  const Icon = config.icon;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setNoteType(type)}
                      className={`p-3 rounded-lg border text-left transition-colors ${
                        noteType === type
                          ? `${config.color} border-current`
                          : "border-white/10 hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="h-4 w-4" />
                        <span className="text-sm font-medium">{config.label}</span>
                      </div>
                      <p className="text-xs text-foreground/50">{config.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="note-title">Title *</Label>
              <Input
                id="note-title"
                placeholder="Brief summary of this entry..."
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                className="bg-white/5 border-white/10"
                maxLength={200}
              />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="note-content">Content *</Label>
              <Textarea
                id="note-content"
                placeholder="Write your notes here... Markdown formatting is supported."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="bg-white/5 border-white/10 min-h-[200px]"
              />
            </div>

            {/* Pin checkbox */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={notePinned}
                onChange={(e) => setNotePinned(e.target.checked)}
                className="rounded border-white/20 bg-white/5"
              />
              <span className="text-sm">Pin this entry to the top of the journal</span>
            </label>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddDialogOpen(false);
                resetForm();
              }}
              disabled={isSubmitting}
              className="border-white/10"
            >
              Cancel
            </Button>
            <Button onClick={handleAddNote} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Add Entry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InvestigationJournal;
