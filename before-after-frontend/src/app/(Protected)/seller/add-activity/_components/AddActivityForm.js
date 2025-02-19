"use client";

import FormWrapper from "@/components/form-components/FormWrapper";
import UInput from "@/components/form-components/UInput";
import USelect from "@/components/form-components/USelect";
import UTextEditor from "@/components/form-components/UTextEditor";
import UUpload from "@/components/form-components/UUpload";
import { Button } from "@/components/ui/button";
import { SelectItem } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useGetSubcategoryByCategoryIdQuery } from "@/redux/api/categoryApi";
import { useCreateActivityPostMutation } from "@/redux/api/serviceProviderApi";
import { useGetProfileQuery } from "@/redux/api/userApi";
import { selectUser } from "@/redux/features/authSlice";
import { sellerCreateActivitySchema } from "@/schema/sellerSchema";
import { ErrorModal, SuccessModal } from "@/utils/customModal";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function AddActivityForm() {
  const router = useRouter();
  const userId = useSelector(selectUser);

  // Get profile
  const { data: profile } = useGetProfileQuery({}, { skip: !userId });

  // Get subcategories(services) based on selected category
  const { data: subCategoriesRes } = useGetSubcategoryByCategoryIdQuery(
    profile?.category?._id,
    {
      skip: !profile?.category?._id,
    },
  );
  const subCategories = subCategoriesRes?.data || [];

  // Create activity post handler
  const [createActivityPost, { isLoading: isCreatingActivity }] =
    useCreateActivityPostMutation();

  const onSubmit = async (data) => {
    const { beforeStory, afterStory, ...payload } = data;

    try {
      const formData = new FormData();

      formData.append(
        "data",
        JSON.stringify({ category: profile?.category?._id, ...payload }),
      );
      formData.append("beforeStory", beforeStory[0]);
      formData.append("afterStory", afterStory[0]);

      const res = await createActivityPost(formData).unwrap();

      if (res?.success) {
        SuccessModal("Activity Post Created Successfully");
        router.push(`/success-stories/${res?.data?._id}?type=seller`);
        // router.push(`/seller/dashboard`);
      }
    } catch (error) {
      ErrorModal(error?.data?.message || error?.message);
    }
  };

  return (
    <div>
      <h3 className="text-center text-3xl font-semibold">Add Activity</h3>

      <Separator className="mb-8 mt-2 h-[1px] w-full bg-primary-blue" />

      <FormWrapper
        onSubmit={onSubmit}
        resolver={zodResolver(sellerCreateActivitySchema)}
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
                    <SelectItem key={subCategory?._id} value={subCategory?._id}>
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
          loading={isCreatingActivity}
        >
          Submit
        </Button>
      </FormWrapper>
    </div>
  );
}
