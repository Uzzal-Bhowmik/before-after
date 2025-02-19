import { Input } from "@/components/ui/input";
import { transformNameInitials } from "@/utils/transformNameInitials";
import { Search } from "lucide-react";
import userAvatar from "/public/images/seller/leads/user-avatar.png";
import { BellRing } from "lucide-react";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import textTruncate from "@/utils/textTruncate";
import CustomAvatar from "@/components/CustomAvatar/CustomAvatar";
import { formatDistanceToNow } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import LeadsListLoading from "./LeadsListLoading";
import { DollarSign } from "lucide-react";

export default function LeadsList({
  leads,
  selectedLeadPost,
  setSelectedLeadPost,
  setSearchTerm,
  isLeadsLoading,
}) {
  return (
    <ScrollArea
      className={cn(
        "h-full w-full lg:block lg:w-[40%] xl:w-1/3 2xl:w-1/4",
        selectedLeadPost?._id ? "hidden" : "block",
      )}
    >
      {/* Search box */}
      <div className="relative w-[85%] p-1 lg:w-full">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2"
          size={20}
        />
        <Input
          className="w-full rounded-xl border bg-transparent px-10 py-6 text-lg"
          placeholder="Keywords Search"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Leads count */}
      <p className="mt-2 px-1 text-gray-700">
        {leads?.length} matching leads 🌟
      </p>

      {/* Leads List */}
      <div className="mt-5 space-y-4">
        {isLeadsLoading ? (
          <LeadsListLoading />
        ) : (
          leads?.map((lead) => {
            // if (!lead?.user) return;

            return (
              <div
                key={lead?._id}
                className={cn(
                  "rounded-lg border border-primary-blue/50 p-3 transition-all duration-300 ease-in-out lg:block",
                  selectedLeadPost?._id === lead?._id
                    ? "bg-primary-blue text-white"
                    : "hover:bg-gray-50",
                )}
                role="button"
                onClick={() => {
                  if (selectedLeadPost?._id === lead?._id)
                    setSelectedLeadPost({});
                  setSelectedLeadPost(lead);
                }}
              >
                <div className="flex-start-start w-full gap-x-3">
                  <CustomAvatar
                    name={transformNameInitials(
                      lead?.user?.name || lead?.user?.email,
                    )}
                    img={lead?.user?.profile}
                    className={"h-14 w-14 font-semibold text-black"}
                  />

                  <div className="w-full">
                    <h4 className="text-lg font-medium leading-none">
                      {lead?.user?.name || "Anonymous"}
                    </h4>

                    <p
                      className={cn(
                        "mt-1 break-all text-sm text-primary-blue",
                        selectedLeadPost?._id === lead?._id && "text-white/75",
                      )}
                    >
                      {lead?.user?.email}
                    </p>

                    <p
                      className={cn(
                        "mt-1 text-xs text-gray-500",
                        selectedLeadPost?._id === lead?._id && "text-white/75",
                      )}
                    >
                      {formatDistanceToNow(lead?.createdAt, {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>

                <h5 className="mb-3 mt-2 text-lg font-semibold">
                  {textTruncate(lead?.title, 100)}
                </h5>

                <div className="flex-center-between text-sm">
                  <div className="flex-center-start gap-x-2 font-medium text-accent-green">
                    <BellRing size={16} className="mt-0.5" />
                    <p>{lead?.consultationType}</p>
                  </div>

                  <div className="flex-center-start gap-x-2 font-medium text-secondary-1">
                    <DollarSign size={16} className="mt-0.5" />
                    <p>{lead?.isFree ? "Free of Cost" : "Requesting Quote"}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </ScrollArea>
  );
}
