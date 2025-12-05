import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
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
    <div className="flex items-start gap-3 py-2.5 px-3 rounded-lg hover:bg-white/5 transition-colors">
      <Icon className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-foreground/50 uppercase tracking-wider mb-0.5">{label}</p>
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

type OrgTab = "overview" | "contact" | "details";

export const OrganizationDetail = ({ organization, open, onOpenChange }: OrganizationDetailProps) => {
  const [activeTab, setActiveTab] = useState<OrgTab>("overview");

  if (!organization) return null;
  
  const name = organization.approvedName?.trim() || organization.rcNumber || "Unregistered organization";

  const tabs: { id: OrgTab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "contact", label: "Contact" },
    { id: "details", label: "Details" },
  ];
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] p-0 border-white/10 bg-background/95 backdrop-blur-xl">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2 text-primary mb-2">
            <Building2 className="h-4 w-4" />
            <span className="text-xs uppercase tracking-wider font-medium">Organization</span>
          </div>
          <DialogTitle className="text-xl font-semibold">{name}</DialogTitle>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <Badge variant="outline" className="border-white/20 bg-white/5 text-xs">
              {organization.status || "Status unavailable"}
            </Badge>
            {organization.rcNumber && (
              <Badge variant="outline" className="border-white/20 bg-white/5 text-xs">
                RC {organization.rcNumber}
              </Badge>
            )}
            {typeof organization.match_score === "number" && (
              <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                <Sparkles className="h-3 w-3 mr-1" />
                Score: {organization.match_score}
              </Badge>
            )}
          </div>
        </DialogHeader>

        {/* Tabs */}
        <div className="px-6 py-2 border-b border-white/10">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/60 hover:text-foreground hover:bg-white/5"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="max-h-[50vh]">
          <div className="px-6 py-4">
            {activeTab === "overview" && (
              <div className="space-y-1">
                <DetailItem icon={Hash} label="RC Number" value={organization.rcNumber} />
                <DetailItem icon={Calendar} label="Registration Date" value={organization.registrationDate} />
                <DetailItem icon={FileText} label="Status" value={organization.status} />
                <DetailItem icon={MapPin} label="Location" value={[organization.city, organization.state].filter(Boolean).join(", ") || null} />
              </div>
            )}

            {activeTab === "contact" && (
              <div className="space-y-1">
                <DetailItem icon={MapPin} label="Address" value={organization.address} />
                <DetailItem icon={Globe} label="City" value={organization.city} />
                <DetailItem icon={Globe} label="State" value={organization.state} />
                <DetailItem icon={Mail} label="Email" value={organization.email} />
                {!organization.address && !organization.city && !organization.state && !organization.email && (
                  <p className="text-sm text-foreground/50 italic py-4 text-center">No contact information available</p>
                )}
              </div>
            )}

            {activeTab === "details" && (
              <div className="space-y-1">
                {organization.objectives ? (
                  <div className="py-2.5 px-3 rounded-lg bg-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <Briefcase className="h-4 w-4 text-primary" />
                      <p className="text-[10px] text-foreground/50 uppercase tracking-wider">Business Objectives</p>
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed">{organization.objectives}</p>
                  </div>
                ) : (
                  <p className="text-sm text-foreground/50 italic py-4 text-center">No additional details available</p>
                )}
              </div>
            )}
          </div>
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

type AffTab = "overview" | "contact" | "professional";

export const AffiliateDetail = ({ affiliate, open, onOpenChange }: AffiliateDetailProps) => {
  const [activeTab, setActiveTab] = useState<AffTab>("overview");

  if (!affiliate) return null;
  
  const name = [affiliate.firstname, affiliate.otherName, affiliate.surname]
    .filter(Boolean)
    .join(" ")
    .trim() || affiliate.email || affiliate.phoneNumber || "Unidentified affiliate";

  const tabs: { id: AffTab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "contact", label: "Contact" },
    { id: "professional", label: "Professional" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] p-0 border-white/10 bg-background/95 backdrop-blur-xl">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2 text-primary mb-2">
            <User className="h-4 w-4" />
            <span className="text-xs uppercase tracking-wider font-medium">Affiliate</span>
          </div>
          <DialogTitle className="text-xl font-semibold">{name}</DialogTitle>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {affiliate.affiliate_type && (
              <Badge variant="outline" className="border-white/20 bg-white/5 text-xs">
                {affiliate.affiliate_type}
              </Badge>
            )}
            {affiliate.occupation && (
              <Badge variant="outline" className="border-white/20 bg-white/5 text-xs">
                {affiliate.occupation}
              </Badge>
            )}
            {typeof affiliate.match_score === "number" && (
              <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                <Sparkles className="h-3 w-3 mr-1" />
                Score: {affiliate.match_score}
              </Badge>
            )}
          </div>
        </DialogHeader>

        {/* Tabs */}
        <div className="px-6 py-2 border-b border-white/10">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/60 hover:text-foreground hover:bg-white/5"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="max-h-[50vh]">
          <div className="px-6 py-4">
            {activeTab === "overview" && (
              <div className="space-y-1">
                <DetailItem icon={User} label="First Name" value={affiliate.firstname} />
                <DetailItem icon={User} label="Other Name" value={affiliate.otherName} />
                <DetailItem icon={User} label="Surname" value={affiliate.surname} />
                <DetailItem icon={Users} label="Gender" value={affiliate.gender} />
                <DetailItem icon={Calendar} label="Date of Birth" value={affiliate.date_of_birth} />
                <DetailItem icon={Globe} label="Nationality" value={affiliate.nationality} />
              </div>
            )}

            {activeTab === "contact" && (
              <div className="space-y-1">
                <DetailItem icon={Mail} label="Email" value={affiliate.email} />
                <DetailItem icon={Phone} label="Phone" value={affiliate.phoneNumber} />
                <DetailItem icon={MapPin} label="City" value={affiliate.city} />
                <DetailItem icon={Globe} label="State" value={affiliate.state} />
                {!affiliate.email && !affiliate.phoneNumber && !affiliate.city && !affiliate.state && (
                  <p className="text-sm text-foreground/50 italic py-4 text-center">No contact information available</p>
                )}
              </div>
            )}

            {activeTab === "professional" && (
              <div className="space-y-1">
                <DetailItem icon={Briefcase} label="Occupation" value={affiliate.occupation} />
                <DetailItem icon={CreditCard} label="Identity Number" value={affiliate.identity_number} />
                <DetailItem icon={Hash} label="Organization ID" value={affiliate.organization_id?.toString()} />
                {(affiliate.shares_allotted || affiliate.share_type) && (
                  <>
                    <div className="my-3 border-t border-white/10" />
                    <p className="text-[10px] text-foreground/50 uppercase tracking-wider px-3 mb-2">Shareholding</p>
                    <DetailItem icon={FileText} label="Shares Allotted" value={affiliate.shares_allotted} />
                    <DetailItem icon={FileText} label="Share Type" value={affiliate.share_type} />
                  </>
                )}
                {!affiliate.occupation && !affiliate.identity_number && !affiliate.organization_id && !affiliate.shares_allotted && (
                  <p className="text-sm text-foreground/50 italic py-4 text-center">No professional details available</p>
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
