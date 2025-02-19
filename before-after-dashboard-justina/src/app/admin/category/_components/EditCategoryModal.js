import React from "react";
import FormWrapper from "@/components/Form/FormWrapper";
import UInput from "@/components/Form/UInput";
import { Button, Modal } from "antd";
import { Loader, Plus } from "lucide-react";
import UUpload from "@/components/Form/UUpload";
import UseImageUpload from "@/lib/useImageUpload";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} from "@/redux/api/categoryApi";
import { ErrorModal, SuccessModal } from "@/utils/modalHook";
import toast from "react-hot-toast";

export default function EditCategoryModal({
  open,
  setOpen,
  modalData,
  setModalData,
}) {
  const [updateFn, { isLoading }] = useUpdateCategoryMutation();

  const handelSubmit = async (data) => {
    const { image, ...payload } = data;

    const formData = new FormData();
    if (image?.fileList[0]?.originFileObj) {
      formData.append("banner", image?.fileList[0]?.originFileObj);
    }
    

    if (payload) formData.append("data", JSON.stringify(payload));
    try {
      const res = await updateFn({
        id: modalData?._id,
        data: formData,
      }).unwrap();
      SuccessModal(res?.message);
      if (res?.success) {
        setFile(null);
        setModalData(null);
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
        setModalData(null);
      }}
      title="Edit Category"
    >
      <FormWrapper
        onSubmit={handelSubmit}
        defaultValues={{ name: modalData?.name }}
      >
        <UUpload
          uploadTitle={"Upload category imag"}
          listType={"picture"}
          name={"image"}
          required={false}
          max={1}
        />
        <UInput
          type="text"
          name="name"
          label="Category Name"
          placeholder={"Enter category name"}
        />

        {isLoading ? (
          <Button disabled className="!h-10 w-full !font-semibold">
            <Loader className="w-5 h-5 mr-2 animate-spin" />
            Updating in...
          </Button>
        ) : (
          <Button
            htmlType="submit"
            type="primary"
            size="large"
            className="w-full"
          >
            Update
          </Button>
        )}
      </FormWrapper>
    </Modal>
  );
}
