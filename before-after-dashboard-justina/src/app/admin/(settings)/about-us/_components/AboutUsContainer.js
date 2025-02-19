"use client";

import FormWrapper from "@/components/Form/FormWrapper";
import {
  useGetContentsQuery,
  useUpdateContentMutation,
} from "@/redux/api/contentApi";
import { ErrorModal, SuccessModal } from "@/utils/modalHook";
import { Button } from "antd";
import { Edit, Loader } from "lucide-react";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
});

export default function AboutUsContainer() {
  const [content, setContent] = useState("");
  const editor = useRef(null);
  const { data: data, isSuccess } = useGetContentsQuery();
  const [updateFn, { isLoading }] = useUpdateContentMutation();
  const aboutUs = data?.data?.data[0]?.aboutUs || "";

  console.log(content);
  const onSubmit = async () => {
    try {
      const res = await updateFn({
        aboutUs: content,
      }).unwrap();
      if (res?.success) {
        SuccessModal("AboutUs is updated");
      }
    } catch (error) {
      ErrorModal("Error updating AboutUs");
    } finally {
      toast.dismiss("content");
    }
  };
  return (
    <section>
      <h3 className="mb-6 text-2xl font-semibold">About Us</h3>

      <FormWrapper>
        <JoditEditor
          ref={editor}
          value={aboutUs}
          config={{
            //@ts-ignore
            uploader: { insertImageAsBase64URI: true },
          }}
          onBlur={(newContent) => {
            setContent(newContent);
          }}
        />
        <div className="mt-5">
          {isLoading ? (
            <Button disabled className="!h-10 w-full !font-semibold">
              <Loader className="w-5 h-5 mr-2 animate-spin" />
              Updating in...
            </Button>
          ) : (
            <Button
              type="primary"
              size="large"
              onClick={onSubmit}
              className="w-full rounded-xl"
              icon={<Edit size={18} />}
            >
              Save Changes
            </Button>
          )}
        </div>
      </FormWrapper>
    </section>
  );
}
