import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, X } from "lucide-react";
import { api } from "@/services/api";
import type {
  Investigation,
  InvestigationPriority,
  InvestigationStatus,
  CreateInvestigationPayload,
  UpdateInvestigationPayload,
} from "@/services/types";
import { toast } from "@/components/ui/use-toast";

interface InvestigationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (investigation: Investigation) => void;
  investigation?: Investigation; // If provided, form is in edit mode
}

/**
 * Dialog form for creating or editing an investigation
 */
const InvestigationForm = ({
  open,
  onOpenChange,
  onSuccess,
  investigation,
}: InvestigationFormProps) => {
  const isEditMode = !!investigation;

  // Form state
  const [title, setTitle] = useState(investigation?.title ?? "");
  const [description, setDescription] = useState(investigation?.description ?? "");
  const [priority, setPriority] = useState<InvestigationPriority>(investigation?.priority ?? "medium");
  const [status, setStatus] = useState<InvestigationStatus>(investigation?.status ?? "draft");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(investigation?.tags ?? []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when dialog opens/closes or investigation changes
  const resetForm = () => {
    setTitle(investigation?.title ?? "");
    setDescription(investigation?.description ?? "");
    setPriority(investigation?.priority ?? "medium");
    setStatus(investigation?.status ?? "draft");
    setTags(investigation?.tags ?? []);
    setTagInput("");
  };

  // Handle dialog open change
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      resetForm();
    }
    onOpenChange(newOpen);
  };

  // Add tag
  const addTag = () => {
    const trimmed = tagInput.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };

  // Remove tag
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // Handle tag input keydown
  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!title.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter an investigation title",
        variant: "destructive",
      });
      return;
    }

    if (!description.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter an investigation description",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let result: Investigation | null;

      if (isEditMode && investigation) {
        // Update existing investigation
        const payload: UpdateInvestigationPayload = {
          title: title.trim(),
          description: description.trim(),
          priority,
          status,
          tags,
        };
        result = await api.updateInvestigation(investigation.id, payload);
      } else {
        // Create new investigation
        const payload: CreateInvestigationPayload = {
          title: title.trim(),
          description: description.trim(),
          priority,
          status,
          tags,
        };
        result = await api.createInvestigation(payload);
      }

      if (result) {
        toast({
          title: isEditMode ? "Investigation Updated" : "Investigation Created",
          description: `${result.caseNumber} has been ${isEditMode ? "updated" : "created"} successfully.`,
        });
        onSuccess(result);
      } else {
        throw new Error("Failed to save investigation");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save investigation",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-background/95 backdrop-blur border-white/10">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Investigation" : "New Investigation"}</DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Update the investigation details below."
                : "Create a new investigation to track your case. You can add notes, entities, and evidence after creation."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Apex Global Ventures - Financial Irregularities"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-white/5 border-white/10"
                maxLength={200}
              />
              <p className="text-xs text-foreground/50">{title.length}/200 characters</p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe the scope and objectives of this investigation..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-white/5 border-white/10 min-h-[120px]"
                maxLength={5000}
              />
              <p className="text-xs text-foreground/50">{description.length}/5000 characters</p>
            </div>

            {/* Priority and Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={priority} onValueChange={(v) => setPriority(v as InvestigationPriority)}>
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as InvestigationStatus)}>
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="on-hold">On Hold</SelectItem>
                    {isEditMode && <SelectItem value="closed">Closed</SelectItem>}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="flex gap-2">
                <Input
                  id="tags"
                  placeholder="Add a tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  className="bg-white/5 border-white/10 flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={addTag}
                  disabled={!tagInput.trim()}
                  className="border-white/10"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-white/10 hover:bg-white/20 gap-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-destructive"
                        aria-label={`Remove tag ${tag}`}
                        title={`Remove tag ${tag}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              <p className="text-xs text-foreground/50">
                Press Enter or click + to add tags. Tags help organize and filter investigations.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting}
              className="border-white/10"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isEditMode ? "Save Changes" : "Create Investigation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InvestigationForm;
