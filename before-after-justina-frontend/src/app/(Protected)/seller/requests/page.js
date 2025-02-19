import React from "react";
import SellerRequestsTable from "./_components/SellerRequestsTable";
import ResponsiveContainer from "@/components/ResponsiveContainer/ResponsiveContainer";

export default function page() {
  return (
    <ResponsiveContainer>
      <SellerRequestsTable />
    </ResponsiveContainer>
  );
}
