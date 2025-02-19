"use client";

import FormWrapper from "@/components/Form/FormWrapper";
import UInput from "@/components/Form/UInput";
import UUpload from "@/components/Form/UUpload";
import UseImageUpload from "@/lib/useImageUpload";
import { useCreateCategoryMutation } from "@/redux/api/categoryApi";
import { ErrorModal, SuccessModal } from "@/utils/modalHook";
import { Button, Modal } from "antd";
import { Loader } from "lucide-react";
import { useState } from "react";
import { set, useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function CreateCategoryModal({ open, setOpen }) {
  // const { setFile, imageFile, imageUrl } = UseImageUpload();
  const [createFn, { isLoading }] = useCreateCategoryMutation();

  const form = useForm();
  const handelSubmit = async (data) => {
    const { image, ...payload } = data;

    if (!image?.fileList[0]?.originFileObj) {
      ErrorModal("Please Select a banner");
      return;
    }
    const formData = new FormData();
    formData.append("banner", image?.fileList[0]?.originFileObj);
    formData.append("data", JSON.stringify(payload));
    try {
      delete data.image;
      const res = await createFn(formData).unwrap();

      SuccessModal(res?.message);
      if (res?.success) {
        form.reset();
        setOpen(false);
      }
    } catch (error) {
      console.log(error);
      ErrorModal(error?.message || error?.data?.message);
    } finally {
      toast.dismiss("category");
    }
  };
  return (
    <Modal
      centered
      open={open}
      setOpen={setOpen}
      footer={null}
      onCancel={() => {
        setOpen(false);
      }}
      title="Create Category"
    >
      <FormWrapper onSubmit={handelSubmit} {...form}>
        <UUpload
          uploadTitle={"Upload category imag"}
          listType={"picture"}
          name={"image"}
          max={1}
        />

        <UInput
          type="text"
          name="name"
          label="Category Name"
          required={true}
          placeholder="Enter category name"
        />
        {isLoading ? (
          <Button disabled className="!h-10 w-full !font-semibold">
            <Loader className="mr-2 h-5 w-5 animate-spin" />
            Creating in...
          </Button>
        ) : (
          <Button
            htmlType="submit"
            type="primary"
            size="large"
            className="w-full"
          >
            Submit
          </Button>
        )}
      </FormWrapper>
    </Modal>
  );
}
