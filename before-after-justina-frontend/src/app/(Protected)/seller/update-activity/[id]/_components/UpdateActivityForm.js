"use client";

import CustomLoader from "@/components/CustomLoader/CustomLoader";
import FormWrapper from "@/components/form-components/FormWrapper";
import UInput from "@/components/form-components/UInput";
import USelect from "@/components/form-components/USelect";
import UTextEditor from "@/components/form-components/UTextEditor";
import UUpload from "@/components/form-components/UUpload";
import { Button } from "@/components/ui/button";
import { SelectItem } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useGetSubcategoryByCategoryIdQuery } from "@/redux/api/categoryApi";
import {
  useCreateActivityPostMutation,
  useEditActivityPostMutation,
  useGetActivityByIdQuery,
} from "@/redux/api/serviceProviderApi";
import { useGetProfileQuery } from "@/redux/api/userApi";
import { selectUser } from "@/redux/features/authSlice";
import {
  sellerCreateActivitySchema,
  sellerUpdateActivitySchema,
} from "@/schema/sellerSchema";
import { ErrorModal, SuccessModal } from "@/utils/customModal";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function UpdateActivityForm({ id }) {
  const router = useRouter();
  const userId = useSelector(selectUser);

  // Get profile
  const { data: profile } = useGetProfileQuery({}, { skip: !userId });

  // Get subcategories
  const { data: subCategoriesRes } = useGetSubcategoryByCategoryIdQuery(
    profile?.category?._id,
    {
      skip: !profile?.category?._id,
    },
  );
  const subCategories = subCategoriesRes?.data || [];

  // Get activity post
  const { data: activity, isLoading: isActivityLoading } =
    useGetActivityByIdQuery(id, { skip: !id });

  // update activity post handler
  const [updateActivityPost, { isLoading: isUpdatingActivity }] =
    useEditActivityPostMutation();

  const onSubmit = async (data) => {
    const { beforeStory, afterStory, ...payload } = data;

    try {
      const formData = new FormData();

      formData.append("data", JSON.stringify(payload));

      if (beforeStory.length > 0) {
        if (!beforeStory[0]?.url) {
          formData.append("beforeStory", beforeStory[0]);
        }
      }

      if (afterStory.length > 0) {
        if (!afterStory[0]?.url) {
          formData.append("afterStory", afterStory[0]);
        }
      }

      const res = await updateActivityPost({ id: id, data: formData }).unwrap();

      if (res?.success) {
        SuccessModal("Activity Post Updated Successfully");
        router.push(`/success-stories/${res?.data?._id}?type=seller`);
        // router.push(`/seller/dashboard`);
      }
    } catch (error) {
      ErrorModal(error?.data?.message || error?.message);
    }
  };

  // Set default values
  const defaultValues = {
    category: activity?.category?._id,
    subcategory: activity?.subcategory?._id,
    customer: activity?.customer,
    title: activity?.title,
    description: activity?.description,
    beforeStory: [{ url: activity?.beforeStory }],
    afterStory: [{ url: activity?.afterStory }],
  };

  return (
    <div>
      <h3 className="text-center text-3xl font-semibold">
        Update Activity Post
      </h3>

      <Separator className="mb-8 mt-2 h-[1px] w-full bg-primary-blue" />

      {isActivityLoading ? (
        <div className="flex-center my-20">
          <CustomLoader color="var(--primary-blue)" size={35} />
        </div>
      ) : (
        <FormWrapper
          onSubmit={onSubmit}
          resolver={zodResolver(sellerUpdateActivitySchema)}
          defaultValues={defaultValues}
        >
          <div className="space-y-5">
            <USelect
              name="subcategory"
              label="Which service it was?"
              selectTrigger={subCategories?.length > 0 && "Select the service"}
              selectItems={
                subCategories?.length === 0 ? (
                  <SelectItem>No services found</SelectItem>
                ) : (
                  <>
                    {subCategories?.map((subCategory) => (
                      <SelectItem
                        key={subCategory?._id}
                        value={subCategory?._id}
                      >
                        {subCategory?.name}
                      </SelectItem>
                    ))}
                  </>
                )
              }
            />

            <UInput
              name="customer"
              label="Customer Name (optional)"
              placeholder="E.g. Sarrah Miller"
              max="100"
            />

            <UInput
              name="title"
              label="Summary/Title of your service"
              info="This helps others easily understand what service it was about."
              placeholder="E.g. Sarah came to us for a professional hair cut and here is her final look (max. 100 characters)"
              max="100"
            />

            <UTextEditor
              name="description"
              label="Service Description"
              placeholder="Note: Tell customers about the whole service. Also, you can use this post to promote your business. So, we highly recommend you to be as detailed as possible. Share before and after images for increased credibility and better reach..."
              required={true}
            />

            <div className="flex gap-5">
              <UUpload
                name="beforeStory"
                label="Before Service Image"
                maxFileCount={1}
                maxSize={10}
                className="w-full"
              />

              <UUpload
                name="afterStory"
                label="After Service Image"
                maxFileCount={1}
                maxSize={10}
                className="w-full"
              />
            </div>
          </div>

          <p className="mb-8 mt-5 flex items-center gap-x-2">
            <div className="rounded border border-primary-blue">
              <Check size={18} />
            </div>
            Your information is always protected under our{" "}
            <Link
              href="/privacy-policy"
              className="font-medium text-primary-blue underline"
            >
              privacy policy
            </Link>
          </p>

          <Button
            type="submit"
            variant="primary-blue"
            size="custom"
            className="block w-1/4"
            loading={isUpdatingActivity}
          >
            Submit
          </Button>
        </FormWrapper>
      )}
    </div>
  );
}
