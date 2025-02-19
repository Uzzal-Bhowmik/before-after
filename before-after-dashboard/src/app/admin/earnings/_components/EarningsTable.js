"use client";

import { ConfigProvider, Table } from "antd";
import clsx from "clsx";
import { ArrowRightLeft } from "lucide-react";
import userImage from "@/assets/images/user-avatar-lg.png";
import Image from "next/image";
import { Filter } from "lucide-react";
import { Tooltip } from "antd";
import { Eye } from "lucide-react";
import { useState } from "react";
import { Tag } from "antd";
import EarningModal from "./EarningModal";
import { useAllEarningsQuery } from "@/redux/api/income.api";
import moment from "moment";

export default function EarningsTable() {
  const [showEarningModal, setShowEarningModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const { data: earningsRes, isFetching, isLoading } = useAllEarningsQuery();

  const earningsData = earningsRes?.data || []; 

  // ================== Table Columns ================
  const columns = [
    {
      title: "Serial",
      dataIndex: "key",
      render: (value, _, indexOf) => `#${indexOf + 1}`,
    },
    {
      title: "Name",
      dataIndex: "user",
      render: (value) => (value?.name ? value?.name : "N/A"),
    },
    {
      title: "Email",
      dataIndex: "user",
      render: (value) => (value?.email ? value?.email : "N/A"),
    },
    {
      title: "Contact",
      dataIndex: "user",
      render: (value) => (value?.phoneNumber ? value?.phoneNumber : "N/A"),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      render: (value) => moment(value).format("ll"),
    },
    {
      title: "Pricing Plan",
      dataIndex: "package",
      render: (value) => value.title,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (value) => (
        <Tag color="blue" className="!text-base font-semibold">
          ${value}
        </Tag>
      ),
    },
    {
      title: "Action",
      render: (value) => (
        <Tooltip title="Show Details">
          <button
            onClick={() => {
              setShowEarningModal(true), setModalData(value);
            }}
          >
            <Eye color="#1B70A6" size={22} />
          </button>
        </Tooltip>
      ),
    },
  ];

  // Dummy data
  const earningStats = [
    {
      key: "today",
      title: "Today's Earning",
      amount: earningsData?.todayEarnings,
    },

    {
      key: "total",
      title: "Total Earnings",
      amount: earningsData?.totalEarnings,
    },
  ];
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1B70A6",
          colorInfo: "#1B70A6",
        },
      }}
    >
      {/* Earning stats */}
      <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
        {earningStats?.map((stat) => (
          <div
            key={stat.key}
            className={clsx(
              "text-white text-lg flex-center-start gap-x-4 rounded-lg py-4 px-5",
              stat.key === "today"
                ? "bg-primary-blue"
                : "bg-foundation-accent-800"
            )}
          >
            <ArrowRightLeft size={24} />
            <p>
              {stat.title}
              <span className="font-semibold text-xl pl-3">${stat.amount}</span>
            </p>
          </div>
        ))}
      </section>

      {/* Earning table */}
      <section className="my-10">
        <Table
          loading={isLoading ?? isFetching}
          style={{ overflowX: "auto" }}
          columns={columns}
          dataSource={earningsData?.allData}
          scroll={{ x: "100%" }}
          pagination
        ></Table>
      </section>

      {/* Show earning modal */}
      <EarningModal
        modalData={modalData}
        setModalData={setModalData}
        open={showEarningModal}
        setOpen={setShowEarningModal}
      />
    </ConfigProvider>
  );
}
