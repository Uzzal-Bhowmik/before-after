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
import ShowResDetails from "@/app/(Protected)/customer/(service-post related path)/view-responses/_components/ShowResDetails";
import TableLoaderWithEmpty from "@/components/TableLoaderWithEmpty/TableLoaderWithEmpty";
import { format } from "date-fns";
import {
  useDeleteRequestMutation,
  useGetSellerSentRequestsQuery,
} from "@/redux/api/serviceProviderApi";
import textTruncate from "@/utils/textTruncate";
import { constants } from "@/constants/constants";
import { Trash2 } from "lucide-react";
import { successToast } from "@/utils/customToast";
import { ConfirmModal, ErrorModal } from "@/utils/customModal";
import CustomTooltip from "@/components/CustomTooltip/CustomTooltip";
import { MessagesSquare } from "lucide-react";

const TABLE_HEADERS = [
  "Service Title",
  "Customer",
  "Responded At",
  "Request Status",
  "Service Status",
  "Action",
];

export default function SellerRequestsTable() {
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showResponseDetailModal, setShowResponseDetailModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState({});

  // Get seller requests
  const { data: myRequestsRes, isLoading: isSellerRequestsLoading } =
    useGetSellerSentRequestsQuery({ limit: 999999, status: selectedStatus });
  const myRequests = myRequestsRes?.data || [];

  // delete cancelled request
  const [deleteRequest, { isLoading: isDeleting }] = useDeleteRequestMutation();
  const handleDeleteRequest = async (requestId) => {
    ConfirmModal(
      "Delete request?",
      "Are you sure you want to delete this request?",
    ).then(async (res) => {
      if (res?.isConfirmed) {
        try {
          await deleteRequest(requestId).unwrap();

          successToast("Request deleted successfully");
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
            <TableRow className="bg-lightGray hover:bg-lightGray font-general-sans">
              {TABLE_HEADERS.map((header) => (
                <TableHead
                  key={header}
                  className="text-primary-black whitespace-nowrap text-lg font-semibold"
                  style={{ paddingBlock: "14px" }}
                >
                  {header !== "Request Status" &&
                    header !== "Service Status" &&
                    header}

                  {header === "Request Status" && (
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex-center-start gap-x-3">
                        Request Status <ChevronsUpDown size={16} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="font-medium">
                        {constants.REQUEST_STATUS.map((status) => (
                          <DropdownMenuItem
                            key={status}
                            className="flex-center-between"
                            onClick={() => {
                              if (selectedStatus === status)
                                return setSelectedStatus("");
                              setSelectedStatus(status);
                            }}
                          >
                            <button className="capitalize">{status}</button>

                            {selectedStatus === status && <Check size={16} />}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}

                  {header === "Service Status" && (
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex-center-start gap-x-3">
                        Service Status <ChevronsUpDown size={16} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="font-medium">
                        {constants.SERVICE_POST_STATUS.map((status) => (
                          <DropdownMenuItem
                            key={status}
                            className="flex-center-between"
                            onClick={() => {
                              if (selectedStatus === status)
                                return setSelectedStatus("");
                              setSelectedStatus(status);
                            }}
                          >
                            <button className="capitalize">{status}</button>

                            {selectedStatus === status && <Check size={16} />}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody
            style={{ padding: "10px", borderSpacing: "0 1em" }}
            className="font-dm-sans text-base"
          >
            <TableLoaderWithEmpty
              isLoading={isSellerRequestsLoading}
              data={myRequests}
            />

            {!isSellerRequestsLoading &&
              myRequests?.length > 0 &&
              myRequests?.map((myRequest) => (
                <TableRow
                  key={myRequest?._id}
                  className="border-primary-black/15 h-20 border-b font-dm-sans"
                >
                  <TableCell className="whitespace-nowrap lg:max-w-72 lg:whitespace-normal">
                    <p>{textTruncate(myRequest?.servicePost?.title, 250)}</p>
                  </TableCell>

                  <TableCell>
                    <div className="flex-center-start gap-x-3">
                      <CustomAvatar
                        img={myRequest?.author?.profile}
                        name={myRequest?.author?.name}
                        className="h-12 w-12"
                      />

                      <div>
                        <p>{myRequest?.author?.name || "Anonymous"}</p>
                        <p className="text-sm text-primary-blue">
                          {myRequest?.author?.email ||
                            myRequest?.author?.phoneNumber}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="text-base">
                    {myRequest?.createdAt &&
                      format(myRequest?.createdAt, "dd MMM yyyy, HH:mm a")}
                  </TableCell>

                  <TableCell className="text-base">
                    <Badge variant={myRequest?.status} className="capitalize">
                      {myRequest?.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-base">
                    <Badge
                      variant={myRequest?.servicePost?.status}
                      className="capitalize"
                    >
                      {myRequest?.servicePost?.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="w-[100px] gap-x-2 text-base">
                    <div className="flex-center gap-x-2">
                      {/* Show action based on request status */}

                      {(myRequest?.status !== "approved" ||
                        myRequest?.servicePost?.status !== "completed") && (
                        <CustomTooltip title="View Details">
                          <Button
                            className="flex"
                            variant="primary-blue"
                            size="sm"
                            onClick={() => {
                              setSelectedRequest(myRequest);
                              setShowResponseDetailModal(true);
                            }}
                          >
                            <Eye size={16} />
                          </Button>
                        </CustomTooltip>
                      )}

                      {myRequest?.status === "approved" && (
                        <CustomTooltip title="Contact Customer">
                          <Button
                            className="flex"
                            variant="primary-blue"
                            size="sm"
                            asChild
                          >
                            <Link
                              href={`/messages?user=${myRequest?.author?._id}`}
                            >
                              <MessagesSquare size={16} />
                            </Link>
                          </Button>
                        </CustomTooltip>
                      )}

                      {/* Show action based on request's service post  status */}
                      {myRequest?.servicePost?.status === "completed" &&
                        myRequest?.status === "approved" && (
                          <CustomTooltip title="Remove Request">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() =>
                                handleDeleteRequest(myRequest?._id)
                              }
                              disabled={isDeleting}
                            >
                              <Trash2 />
                            </Button>
                          </CustomTooltip>
                        )}
                    </div>
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
        from="seller"
      />
    </>
  );
}
