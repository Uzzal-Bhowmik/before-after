"use client";

import { Suspense, useEffect, useState } from "react";
import LeadDetails from "./LeadDetails";
import LeadsList from "./LeadsList";
import {
  useGetMyLeadsQuery,
  useGetMySubscriptionQuery,
} from "@/redux/api/serviceProviderApi";
import { useGetProfileQuery } from "@/redux/api/userApi";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/features/authSlice";
import { useSearchParams } from "next/navigation";
import EmptyContainer from "@/components/EmptyContainer/EmptyContainer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import AnimatedArrow from "@/components/AnimatedArrow/AnimatedArrow";
import CustomLoader from "@/components/CustomLoader/CustomLoader";

export default function LeadsPageContainer() {
  // local states
  const [selectedLeadPost, setSelectedLeadPost] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const userId = useSelector(selectUser)?.userId;
  const userRole = useSelector(selectUser)?.role;

  // Get seller services
  const { data: profile, isLoading: isProfileLoading } = useGetProfileQuery(
    {},
    { skip: !userId },
  );

  // Check if seller has active subscription
  // TODO: Get subscription details if client wants
  // const { data: subscription, isLoading: isSubscriptionLoading } =
  //   useGetMySubscriptionQuery(
  //     {},
  //     { skip: !userId || userRole !== "service_provider" },
  //   );

  const query = {};
  query["subcategory"] = profile?.services
    ?.map((service) => service?._id)
    ?.join("||");
  query["sort"] = "-createdAt";
  query["searchTerm"] = searchTerm;

  // Get seller leads
  const {
    data: leadsRes,
    isLoading: isLeadsLoading,
    refetch,
  } = useGetMyLeadsQuery(query, {
    skip: !userId || !profile?._id || userRole !== "service_provider",
    // !subscription ||
    // isSubscriptionLoading,
  });

  const leads = leadsRes?.data || [];

  // if (isSubscriptionLoading) {
  //   return (
  //     <div className="flex-center h-[65vh]">
  //       <CustomLoader color="var(--primary-blue)" size={36} />
  //     </div>
  //   );
  // }

  if (isLeadsLoading || isProfileLoading) {
    return (
      <div className="flex-center h-[65vh]">
        <CustomLoader color="var(--primary-blue)" size={36} />
      </div>
    );
  }

  return (
    <div className="flex h-[55vh] items-start justify-between gap-x-4 rounded-xl border border-slate-300 p-5 font-dm-sans shadow lg:h-[60vh] xl:h-[65vh] 2xl:h-[75vh]">
      <LeadsList
        leads={leads}
        selectedLeadPost={selectedLeadPost}
        setSelectedLeadPost={setSelectedLeadPost}
        setSearchTerm={setSearchTerm}
        isLeadsLoading={isLeadsLoading}
      />
      <Suspense>
        <LeadDetails
          selectedLeadPost={selectedLeadPost}
          setSelectedLeadPost={setSelectedLeadPost}
          leads={leads}
          refetch={refetch}
        />
      </Suspense>
    </div>
  );
}
