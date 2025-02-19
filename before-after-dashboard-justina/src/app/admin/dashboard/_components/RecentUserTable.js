"use client";

import { ConfigProvider } from "antd";
import { Table } from "antd";
import { UserX } from "lucide-react";
import { Eye } from "lucide-react";
import { Filter } from "lucide-react";
import Image from "next/image";
import userImage from "@/assets/images/user-avatar-lg.png";
import { Tooltip } from "antd";
import { Tag } from "antd";
import { useState } from "react";
import ProfileModal from "@/components/SharedModals/ProfileModal";
import moment from "moment";

// Dummy Data
 

const RecentUserTable = ({ userDetails }) => {
  const [showProfileModal, setShowProfileModal] = useState(false);

  // =============== Table columns ===============
  const columns = [
    {
      title: "SL",
      dataIndex: "key",
      key: "_id",
      render: (value, record, indexOf) => `#${indexOf + 1}`,
    },
    // {
    //   title: "Name",
    //   key: "serial",
    //   dataIndex: "serial",
    //   render: (value, record) => { 
    //     return (
    //       <></>
    //       //   <div className="flex-center-start gap-x-2">
    //       //   <Image
    //       //     src={record.profile}
    //       //     alt="User avatar"
    //       //     width={40}
    //       //     height={40}
    //       //     className="rounded-full aspect-square"
    //       //   />
    //       //   <p className="font-medium">{value}</p>
    //       // </div>
    //     );
    //   },
    // },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Contact",
      dataIndex: "phoneNumber",
      render: (value, record) => (value ? value : "N/A"),
    },
    {
      title: "Join Date",
      dataIndex: "createdAt",
      render: (value) => moment(value).format("LL"),
    },
    {
      title: "Account Type",
      dataIndex: "role",

      filters: [
        {
          text: "Customer",
          value: "user",
        },
        {
          text: "Service Provider",
          value: "service_provider",
        },
      ],
      filterIcon: () => (
        <Filter
          size={18}
          color="#fff"
          className="flex justify-start items-start"
        />
      ),
      onFilter: (value, record) => record.role.indexOf(value) === 0,

      render: (value) => { 
        return (
          <Tag color="cyan" className="!text-sm">
            {value === "user" ? "Customer" : "Service Provider"}
          </Tag>
        );
      },
    },
    // {
    //   title: "Action",
    //   render: () => (
    //     <div className="flex-center-start gap-x-3">
    //       <Tooltip title="Show Details">
    //         <button onClick={() => setShowProfileModal(true)}>
    //           <Eye color="#1B70A6" size={22} />
    //         </button>
    //       </Tooltip>

    //       <Tooltip title="Block User">
    //         <button>
    //           <UserX color="#F16365" size={22} />
    //         </button>
    //       </Tooltip>
    //     </div>
    //   ),
    // },
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
      <h4 className="text-2xl font-semibold">Recently Joined Users</h4>

      <div className="my-5">
        <Table
          style={{ overflowX: "auto" }}
          columns={columns}
          dataSource={userDetails}
          scroll={{ x: "100%" }}
        ></Table>
      </div>

      {/* Profile Modal */}
      <ProfileModal open={showProfileModal} setOpen={setShowProfileModal} />
    </ConfigProvider>
  );
};

export default RecentUserTable;
