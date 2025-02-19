"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check } from "lucide-react";
import { ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import CustomAvatar from "@/components/CustomAvatar/CustomAvatar";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import ShowResDetails from "./ShowResDetails";
import { useGetRequestsForPostQuery } from "@/redux/api/customerApi";
import { useSearchParams } from "next/navigation";
import TableLoaderWithEmpty from "@/components/TableLoaderWithEmpty/TableLoaderWithEmpty";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { useDeleteRequestMutation } from "@/redux/api/serviceProviderApi";
import { successToast } from "@/utils/customToast";
import { ConfirmModal, ErrorModal } from "@/utils/customModal";
import { Star } from "lucide-react";

const TABLE_HEADERS = [
  "Professional Details",
  "Post Title",
  "Responded At",
  "Post Status",
  "Service Status",
  "Action",
];

const RESPONSE_STATUS = ["Pending", "Approved", "Cancelled"];

export default function ResponseTable() {
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showResponseDetailModal, setShowResponseDetailModal] = useState(false);
  const query = {};
  query["status"] = selectedStatus;

  // Reminder: What is called "Response" in the frontend, is similar to backend's "Request by service provider"
  const [selectedRequest, setSelectedRequest] = useState({});

  // Check if post id exists of a post:
  // If exists, then get service provider requests for this post
  // else, show all requests
  const servicePostId = useSearchParams().get("postId") || "";
  query["servicePost"] = servicePostId;

  // GET: Get service provider requests for this post
  const { data: serviceProviderRequestsRes, isLoading } =
    useGetRequestsForPostQuery(query);
  const serviceProviderRequests = serviceProviderRequestsRes?.data || [];

  console.log(serviceProviderRequests);

  // Delete response
  const [deleteResponse] = useDeleteRequestMutation();
  const handleDeleteResponse = async (id) => {
    ConfirmModal(
      "Delete response?",
      "This response will be permanently deleted",
    ).then(async (res) => {
      if (res?.isConfirmed) {
        try {
          await deleteResponse(id).unwrap();

          successToast("Response deleted successfully");
        } catch (error) {
          ErrorModal(error?.data?.message || error?.message);
        }
      }
    });
  };

  return (
    <>
      <div
        className="my-8 rounded-xl px-10 py-5"
        style={{ boxShadow: "0px 0px 5px lightGray" }}
      >
        <Table style={{ borderSpacing: "0 1em" }}>
          <TableHeader>
            <TableRow className="bg-lightGray hover:bg-lightGray font-dm-sans">
              {TABLE_HEADERS.map((header) => (
                <TableHead
                  key={header}
                  className="text-primary-black whitespace-nowrap text-lg font-semibold"
                  style={{ paddingBlock: "14px" }}
                >
                  {header !== "Post Status" && header}

                  {header === "Post Status" && (
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex-center-start gap-x-3">
                        Post Status <ChevronsUpDown size={16} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="font-medium">
                        {RESPONSE_STATUS.map((status) => (
                          <DropdownMenuItem
                            key={status}
                            onClick={() => {
                              if (selectedStatus === status?.toLowerCase()) {
                                return setSelectedStatus("");
                              }
                              setSelectedStatus(status?.toLowerCase());
                            }}
                            className="flex-center-between"
                          >
                            <button>{status}</button>

                            {selectedStatus === status?.toLowerCase() && (
                              <Check size={16} />
                            )}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody style={{ padding: "10px", borderSpacing: "0 1em" }}>
            <TableLoaderWithEmpty
              isLoading={isLoading}
              data={serviceProviderRequests}
            />

            {!isLoading &&
              serviceProviderRequests?.length > 0 &&
              serviceProviderRequests?.map((serviceProviderRequest) => (
                <TableRow
                  key={serviceProviderRequest?._id}
                  className="border-primary-black/15 h-20 border-b font-dm-sans text-base"
                >
                  <TableCell>
                    <div className="flex-center-start gap-x-3">
                      <CustomAvatar
                        img={serviceProviderRequest?.user?.profile}
                        name={serviceProviderRequest?.user?.name}
                        className="h-12 w-12"
                      />

                      <div>
                        <Link
                          href={`/seller/${serviceProviderRequest?.user?._id}`}
                          className="block text-lg font-semibold"
                        >
                          {serviceProviderRequest?.user?.name}
                        </Link>
                        <Link
                          href="/categories?service=1"
                          className="block font-medium text-black/60"
                        >
                          {serviceProviderRequest?.serviceType}
                        </Link>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="whitespace-nowrap lg:max-w-96 lg:whitespace-normal">
                    {serviceProviderRequest?.servicePost?.title}
                  </TableCell>

                  <TableCell className="text-base">
                    {format(
                      serviceProviderRequest?.createdAt,
                      "dd MMM yyyy, HH:mm a",
                    )}
                  </TableCell>

                  <TableCell className="text-base">
                    <Badge
                      variant={serviceProviderRequest?.status?.toLowerCase()}
                      className="capitalize"
                    >
                      {serviceProviderRequest?.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-base">
                    <Badge
                      variant={serviceProviderRequest?.servicePost?.status?.toLowerCase()}
                      className="capitalize"
                    >
                      {serviceProviderRequest?.servicePost?.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="w-[100px] text-base">
                    {serviceProviderRequest?.status === "cancelled" ? (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleDeleteResponse}
                      >
                        <Trash2 />

                        <div className="sr-only">Delete Response</div>
                      </Button>
                    ) : (
                      <Button
                        className="flex"
                        variant="primary-blue"
                        onClick={() => {
                          setSelectedRequest(serviceProviderRequest);
                          setShowResponseDetailModal(true);
                        }}
                      >
                        {serviceProviderRequest?.servicePost?.status !==
                        "completed" ? (
                          <>
                            View Details <Eye size={16} />
                          </>
                        ) : (
                          <>
                            Share Review <Star size={16} />
                          </>
                        )}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {/* Response Details Modal */}
      <ShowResDetails
        open={showResponseDetailModal}
        setOpen={setShowResponseDetailModal}
        data={selectedRequest}
      />
    </>
  );
}
