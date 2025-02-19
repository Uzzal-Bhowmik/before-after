"use client";

import ContentWrapper from "@/components/ContentWrapper/ContentWrapper";
import { useGetContentQuery } from "@/redux/api/contentApi";

export default function PrivacyPolicyContainer() {
  const { data: privacyPolicyRes } = useGetContentQuery();

  const privacyPolicy =
    privacyPolicyRes?.data?.data?.length > 0
      ? privacyPolicyRes?.data?.data[0]?.privacyPolicy
      : "";

  return <ContentWrapper content={privacyPolicy} />;
}
