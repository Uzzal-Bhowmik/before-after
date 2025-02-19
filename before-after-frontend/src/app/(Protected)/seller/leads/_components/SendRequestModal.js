import FormWrapper from "@/components/form-components/FormWrapper";
import UInput from "@/components/form-components/UInput";
import UTextEditor from "@/components/form-components/UTextEditor";
import ModalWrapper from "@/components/ModalWrapper.js/ModalWrapper";
import { Button } from "@/components/ui/button";
import { useSendRequestForServiceMutation } from "@/redux/api/serviceProviderApi";
import { ErrorModal, SuccessModal } from "@/utils/customModal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React from "react";
import { z } from "zod";

const sendRequestFormResolver = z.object({
  title: z.string({}),
  name: z.string({}),
  servicePost: z.string(),
  comment: z.string({ required_error: "Comment is required" }).min(1, {
    message:
      "Comment increases customer interactivity. Please write your comment.",
  }),
});

export default function SendRequestModal({
  open,
  setOpen,
  servicePostData,
  refetch,
}) {
  const router = useRouter();
  const defaultValues = {
    title: servicePostData?.title,
    name: servicePostData?.user?.name || "Anonymous",
    servicePost: servicePostData?._id,
  };

  const [sendRequest, { isLoading: isSendingRequest }] =
    useSendRequestForServiceMutation();

  const onSubmit = async (data) => {
    try {
      await sendRequest({
        servicePost: data?.servicePost,
        comment: data?.comment,
      }).unwrap();

      setOpen(false);

      SuccessModal("Request Sent Successfully");
      router.push("/seller/requests");
      refetch();
    } catch (error) {
      ErrorModal(error?.data?.message || error?.message);
    }
  };
  return (
    <ModalWrapper
      open={open}
      setOpen={setOpen}
      className={`2xl:max-w-1/2 h-[85vh] max-h-screen w-1/2 pb-0`}
    >
      <FormWrapper
        onSubmit={onSubmit}
        resolver={zodResolver(sendRequestFormResolver)}
        defaultValues={defaultValues}
      >
        <div className="space-y-5">
          <UInput name="title" label="Title" readOnly={true} />
          <UInput name="name" label="Customer Name" readOnly={true} />
          <UTextEditor
            name="comment"
            label="Your Comment"
            placeholder="Note: Comment increases customer interactivity. Please write an elaborate comment about how you are a fit for the job."
          />

          <Button
            type="submit"
            variant="primary-blue"
            size="custom"
            className="w-full"
            loading={isSendingRequest}
          >
            Send Request
          </Button>
        </div>
      </FormWrapper>
    </ModalWrapper>
  );
}
