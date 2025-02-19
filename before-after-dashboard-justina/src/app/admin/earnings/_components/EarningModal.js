"use client";

import { Modal } from "antd";
import Image from "next/image";
import userImage from "@/assets/images/user-avatar-lg.png";
import { Tag } from "antd";
import moment from "moment";

export default function EarningModal({
  open,
  setOpen,
  modalData,
  setModalData,
}) { 
  return (
    <Modal
      centered
      open={open}
      setOpen={setOpen}
      footer={null}
      onCancel={() => {
        setOpen(false);
        setModalData(null);
      }}
      title="Transaction Details"
    >
      <div className="flex-center-between gap-4 rounded-xl bg-demin-primary-50 p-3 px-5">
        <div className="flex-center-start gap-x-2">
          {modalData?.user?.profile ? (
            <Image
              src={modalData?.user?.profile}
              alt="user image"
              height={2400}
              width={2400}
              className="w-14 h-auto rounded-full aspect-square"
            />
          ) : (
            <div className="flex items-center justify-center w-[100px] h-[100px] rounded-full bg-white font-500">
              <p className="text-2xl">
                {modalData?.user?.email?.slice(0, 2)?.toUpperCase()}
              </p>
            </div>
          )}

          <h4 className="font-semibold text-lg">
            {modalData?.user?.name ? modalData?.user?.name
 : "N/A"}
          </h4>
        </div>

        <p className="text-xl font-semibold">${modalData?.amount}</p>
      </div>

      <section className="text-lg font-medium space-y-5 px-4 my-4">
        <div className="flex-center-between">
          <span>Status :</span>
          {modalData?.isPaid === true ? (
            <Tag color="green" className="!m-0!text-sm">
              Successful
            </Tag>
          ) : (
            <Tag color="orange" className="!m-0!text-sm">
              Pending
            </Tag>
          )}
        </div>

        <div className="flex-center-between">
          <span>Plan :</span>
          <Tag className="!m-0 !text-sm" color="blue">
            {modalData?.package?.title ?? modalData?.package?.title}
          </Tag>
        </div>

        <div className="flex-center-between">
          <span>Transaction ID :</span>
          <span>{modalData?.tranId ?? modalData?.tranId}</span>
        </div>
        {/* <div className="flex-center-between">
          <span>Transaction type :</span>
          <span>Credit Card</span>
        </div>
        <div className="flex-center-between">
          <span>A/C number :</span>
          <span>*** **** **** *545</span>
        </div> */}
        <div className="flex-center-between">
          <span>Date :</span>
          <span>{moment(modalData?.updatedAt).format("ll")}</span>
        </div>
      </section>
    </Modal>
  );
}
