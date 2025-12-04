import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Building2,
  User,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  Globe,
  FileText,
  Hash,
  CreditCard,
  Users,
  Sparkles,
} from "lucide-react";
import type { AffiliateResult, OrganizationResult } from "@/services/types";

interface DetailItemProps {
  icon: React.ElementType;
  label: string;
  value: string | null | undefined;
}

const DetailItem = ({ icon: Icon, label, value }: DetailItemProps) => {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-2">
      <Icon className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
      <div>
        <p className="text-xs text-foreground/60 uppercase tracking-wider">{label}</p>
        <p className="text-sm text-foreground">{value}</p>
      </div>
    </div>
  );
};

interface OrganizationDetailProps {
  organization: OrganizationResult | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const OrganizationDetail = ({ organization, open, onOpenChange }: OrganizationDetailProps) => {
  if (!organization) return null;
  
  const name = organization.approvedName?.trim() || organization.rcNumber || "Unregistered organization";
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-2 text-primary">
            <Building2 className="h-5 w-5" />
            <span className="text-xs uppercase tracking-wider">Organization Profile</span>
          </div>
          <DialogTitle className="text-xl">{name}</DialogTitle>
          <DialogDescription asChild>
            <div>
              <Badge variant="outline" className="mt-1">
                {organization.status || "Status unavailable"}
              </Badge>
            </div>
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] px-6 pb-6">
          <div className="space-y-1">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground/60 mb-3">
              Registration Details
            </h4>
            <DetailItem icon={Hash} label="RC Number" value={organization.rcNumber} />
            <DetailItem icon={Calendar} label="Registration Date" value={organization.registrationDate} />
            <DetailItem icon={FileText} label="Status" value={organization.status} />
          </div>

          <Separator className="my-4" />

          <div className="space-y-1">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground/60 mb-3">
              Location & Contact
            </h4>
            <DetailItem icon={MapPin} label="Address" value={organization.address} />
            <DetailItem icon={Globe} label="City" value={organization.city} />
            <DetailItem icon={Globe} label="State" value={organization.state} />
            <DetailItem icon={Mail} label="Email" value={organization.email} />
          </div>

          <Separator className="my-4" />

          <div className="space-y-1">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground/60 mb-3">
              Business Information
            </h4>
            {organization.objectives ? (
              <div className="py-2">
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase className="h-4 w-4 text-primary" />
                  <p className="text-xs text-foreground/60 uppercase tracking-wider">Objectives</p>
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed">{organization.objectives}</p>
              </div>
            ) : (
              <p className="text-sm text-foreground/50 italic">No business objectives on file</p>
            )}
          </div>

          {typeof organization.match_score === "number" && (
            <>
              <Separator className="my-4" />
              <div className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 p-3">
                <Sparkles className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-xs text-primary uppercase tracking-wider">Match Score</p>
                  <p className="text-lg font-semibold text-primary">{organization.match_score}</p>
                </div>
              </div>
            </>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

interface AffiliateDetailProps {
  affiliate: AffiliateResult | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AffiliateDetail = ({ affiliate, open, onOpenChange }: AffiliateDetailProps) => {
  if (!affiliate) return null;
  
  const name = [affiliate.firstname, affiliate.otherName, affiliate.surname]
    .filter(Boolean)
    .join(" ")
    .trim() || affiliate.email || affiliate.phoneNumber || "Unidentified affiliate";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-2 text-primary">
            <User className="h-5 w-5" />
            <span className="text-xs uppercase tracking-wider">Affiliate Profile</span>
          </div>
          <DialogTitle className="text-xl">{name}</DialogTitle>
          <DialogDescription asChild>
            <div>
              {affiliate.affiliate_type && (
                <Badge variant="outline" className="mt-1">
                  {affiliate.affiliate_type}
                </Badge>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] px-6 pb-6">
          <div className="space-y-1">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground/60 mb-3">
              Personal Information
            </h4>
            <DetailItem icon={User} label="First Name" value={affiliate.firstname} />
            <DetailItem icon={User} label="Other Name" value={affiliate.otherName} />
            <DetailItem icon={User} label="Surname" value={affiliate.surname} />
            <DetailItem icon={Users} label="Gender" value={affiliate.gender} />
            <DetailItem icon={Calendar} label="Date of Birth" value={affiliate.date_of_birth} />
            <DetailItem icon={Globe} label="Nationality" value={affiliate.nationality} />
          </div>

          <Separator className="my-4" />

          <div className="space-y-1">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground/60 mb-3">
              Contact & Location
            </h4>
            <DetailItem icon={Mail} label="Email" value={affiliate.email} />
            <DetailItem icon={Phone} label="Phone" value={affiliate.phoneNumber} />
            <DetailItem icon={MapPin} label="City" value={affiliate.city} />
            <DetailItem icon={Globe} label="State" value={affiliate.state} />
          </div>

          <Separator className="my-4" />

          <div className="space-y-1">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground/60 mb-3">
              Professional Details
            </h4>
            <DetailItem icon={Briefcase} label="Occupation" value={affiliate.occupation} />
            <DetailItem icon={CreditCard} label="Identity Number" value={affiliate.identity_number} />
            <DetailItem icon={Hash} label="Organization ID" value={affiliate.organization_id?.toString()} />
          </div>

          {(affiliate.shares_allotted || affiliate.share_type) && (
            <>
              <Separator className="my-4" />
              <div className="space-y-1">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground/60 mb-3">
                  Shareholding
                </h4>
                <DetailItem icon={FileText} label="Shares Allotted" value={affiliate.shares_allotted} />
                <DetailItem icon={FileText} label="Share Type" value={affiliate.share_type} />
              </div>
            </>
          )}

          {typeof affiliate.match_score === "number" && (
            <>
              <Separator className="my-4" />
              <div className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 p-3">
                <Sparkles className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-xs text-primary uppercase tracking-wider">Match Score</p>
                  <p className="text-lg font-semibold text-primary">{affiliate.match_score}</p>
                </div>
              </div>
            </>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
