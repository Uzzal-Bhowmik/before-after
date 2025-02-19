import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import userAvatar from "/public/images/seller/leads/user-avatar.png";
import { transformNameInitials } from "@/utils/transformNameInitials";
import { Mail } from "lucide-react";
import { BellRing } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { Phone } from "lucide-react";
import Preview from "@/components/Preview/Preview";
import { useState } from "react";
import ImagePreviewer from "@/components/ui/image-previewer";
import { PlusCircle } from "lucide-react";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper";
import SendRequestModal from "./SendRequestModal";
import { useRejectRequestForServiceMutation } from "@/redux/api/serviceProviderApi";
import { ConfirmModal, ErrorModal, SuccessModal } from "@/utils/customModal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import EmptyContainer from "@/components/EmptyContainer/EmptyContainer";
import { DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

// Dummy data
const lead = {
  img: userAvatar,
  name: "Emily Johnson",
  serviceType: "in-person service",
  title: "Wedding Makeup & Skincare Preparation Needed",
  eventDate: "November 15, 2024",
  email: "emily.johnson@example.com",
  isOnline: true,
  lastOnline: "4h ago",
  urgency: "Urgent",
};

export default function LeadDetails({
  selectedLeadPost,
  setSelectedLeadPost,
  leads,
  refetch,
}) {
  // Dummy data
  const isAccepted = useSearchParams().get("accepted");

  // Lightbox image previewer index
  const [imagePreviewIndex, setImagePreviewIndex] = useState(-1);

  const [sendRequestModalOpen, setSendRequestModalOpen] = useState(false);
  const [rejectRequest] = useRejectRequestForServiceMutation();

  // Reject request handler
  const handleRejectRequest = async () => {
    ConfirmModal(
      "Reject Request?",
      "This request will removed from your list permanently?",
    ).then(async (res) => {
      if (res?.isConfirmed) {
        try {
          await rejectRequest(selectedLeadPost?._id).unwrap();

          SuccessModal("Request Declined Successfully");

          refetch();

          setSelectedLeadPost({});
        } catch (error) {
          ErrorModal(error?.data?.message || error?.message);
        }
      }
    });
  };

  // Show empty container if no lead is selected or no leads found
  if (leads?.length === 0) {
    return (
      <section
        className={cn(
          "flex-center h-full w-full flex-col rounded-bl-lg rounded-tl-lg border border-r-0 lg:flex lg:w-[60%] xl:w-[67%] 2xl:w-3/4",
          selectedLeadPost?._id ? "block" : "hidden",
        )}
      >
        <EmptyContainer message={null} className="my-4" />

        <div className="space-y-1 text-center">
          <p>No leads found!!</p>
          <p>
            Try updating your{" "}
            <Link
              href="/seller/dashboard"
              className="text-primary-blue underline"
            >
              profile
            </Link>{" "}
            to get more leads from customers
          </p>
        </div>
      </section>
    );
  }

  if (!selectedLeadPost) {
    return (
      <section
        className={cn(
          "flex-center order-r-0 h-full w-full rounded-bl-lg rounded-tl-lg border text-center lg:flex lg:w-[60%] xl:w-[67%] 2xl:w-3/4",
          selectedLeadPost?._id ? "block" : "hidden",
        )}
      >
        <div className="flex flex-col items-center justify-center gap-x-3 gap-y-4 font-general-sans text-xl font-medium">
          <PlusCircle size={36} />
          <h2>
            Select a lead from the list and start interacting with the customers
          </h2>
        </div>
      </section>
    );
  }

  return (
    <>
      <ScrollArea
        className={cn(
          "mask-gradient h-full w-full rounded-bl-lg rounded-tl-lg border-r-0 p-5 lg:block lg:w-[60%] lg:border xl:w-[67%] 2xl:w-3/4",
          selectedLeadPost?._id ? "block" : "hidden",
        )}
        data-top-bottom-scroll="true"
      >
        {/* Show go back button on smaller devices */}

        {selectedLeadPost?._id && (
          <Button
            variant="ghost"
            className="mb-5 inline-flex lg:hidden"
            onClick={() => setSelectedLeadPost({})}
          >
            <ArrowLeft /> Go back
          </Button>
        )}
        <section className="">
          {/* Profile Picture */}
          <div className="flex items-center gap-x-4">
            <Avatar className="relative h-14 w-14 border border-primary-blue font-medium">
              <AvatarImage src={selectedLeadPost?.user?.profile} />
              <AvatarFallback>
                {transformNameInitials(selectedLeadPost?.user?.name)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-start-between w-full">
              <h4 className="text-lg font-semibold">
                {selectedLeadPost?.user?.name || "Anonymous"}
              </h4>

              <p className="text-gray-500">
                {selectedLeadPost?.createdAt &&
                  format(selectedLeadPost?.createdAt, "dd MMM yyyy, hh:mm a")}
              </p>
            </div>
          </div>

          {/* Lead Heading */}
          <div className="mt-8">
            <h2 className="text-3xl font-semibold">
              {selectedLeadPost?.title}
            </h2>

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-x-2 font-medium text-primary-blue">
                <Mail size={18} />
                <p>{selectedLeadPost?.user?.email}</p>
              </div>

              {selectedLeadPost?.user?.phoneNumber && (
                <div className="flex items-center gap-x-2 font-medium text-primary-blue">
                  <Phone size={18} />
                  <p>{selectedLeadPost?.user?.phoneNumber}</p>
                </div>
              )}

              <div className="mt-1 flex items-center gap-x-2 font-medium text-accent-green">
                <BellRing size={18} />
                <p>{selectedLeadPost?.consultationType}</p>
              </div>

              <div className="mt-1 flex items-center gap-x-2 font-medium text-secondary-1">
                <DollarSign size={18} />
                <p>
                  {selectedLeadPost?.isFree
                    ? "Free of Cost"
                    : "Requesting Quote"}
                </p>
              </div>
            </div>
          </div>

          {/* Contact buttons */}
          <div className="flex-center-start mb-10 mt-8 gap-x-5">
            {isAccepted ? (
              <Button
                asChild
                variant="primary-blue"
                size="custom"
                className="w-[200px]"
              >
                <Link href="/messages">Message</Link>
              </Button>
            ) : (
              <>
                <Button
                  variant="primary-blue"
                  size="custom"
                  className="w-[200px]"
                  onClick={() => setSendRequestModalOpen(true)}
                >
                  Send Request for Service
                </Button>

                <TooltipProvider delayDuration={0.2}>
                  <Tooltip>
                    <TooltipTrigger>
                      <Button
                        variant="secondary"
                        size="custom"
                        className="w-[150px]"
                        onClick={handleRejectRequest}
                      >
                        Not Interested
                      </Button>
                    </TooltipTrigger>

                    <TooltipContent>Reject Request</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </>
            )}
          </div>

          {/* Lead Content */}
          <section className="space-y-4 pb-10">
            {/* Images gallery */}
            <div className="flex-center-start flex-wrap gap-4">
              {selectedLeadPost?.images?.map((img, idx) => (
                <Preview
                  key={idx}
                  className="max-w-1/4 h-[200px] w-auto rounded-lg"
                  onClick={() => setImagePreviewIndex(idx)}
                >
                  <Image
                    src={img?.url}
                    alt="Document"
                    height={1200}
                    width={1200}
                    className="h-full w-full rounded-lg"
                  />
                </Preview>
              ))}

              <ImagePreviewer
                imageUrls={selectedLeadPost?.images?.map((img) => img.url)}
                previewImgIndex={imagePreviewIndex}
                setPreviewImgIndex={setImagePreviewIndex}
              />
            </div>

            <div>
              <ContentWrapper content={selectedLeadPost?.description} />
            </div>
          </section>
        </section>

        <ScrollBar />
      </ScrollArea>

      <SendRequestModal
        open={sendRequestModalOpen}
        setOpen={setSendRequestModalOpen}
        servicePostData={selectedLeadPost}
        refetch={refetch}
      />
    </>
  );
}
