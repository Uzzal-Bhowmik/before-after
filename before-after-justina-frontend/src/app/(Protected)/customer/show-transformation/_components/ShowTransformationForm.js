"use client";
import FormWrapper from "@/components/form-components/FormWrapper";
import UInput from "@/components/form-components/UInput";
import { USearchSelect } from "@/components/form-components/USearchSelect";
import USelect from "@/components/form-components/USelect";
import UTextEditor from "@/components/form-components/UTextEditor";
import UUpload from "@/components/form-components/UUpload";
import { Button } from "@/components/ui/button";
import { SelectItem } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  useGetAllCategoriesQuery,
  useGetSubcategoryByCategoryIdQuery,
} from "@/redux/api/categoryApi";
import { useCreateTransformationPostMutation } from "@/redux/api/customerApi";
import { useGetAllServiceProvidersQuery } from "@/redux/api/serviceProviderApi";
import { shareTransformationSchema } from "@/schema/customerSchema";
import { ErrorModal, SuccessModal } from "@/utils/customModal";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ShowTransformationForm() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const router = useRouter();

  /**
   * GET: Get categories
   */
  const { data: categoriesRes, isLoading: isCategoriesLoading } =
    useGetAllCategoriesQuery();
  const categories = categoriesRes?.data || [];

  /**
   * GET: Get subcategories based on selected category
   */
  const { data: subCategoriesRes, isLoading: isSubcategoriesLoading } =
    useGetSubcategoryByCategoryIdQuery(selectedCategory, {
      skip: !selectedCategory,
    });
  const subCategories = subCategoriesRes?.data || [];

  /**
   * GET: Get service providers
   */
  const { data: serviceProvidersRes } = useGetAllServiceProvidersQuery();
  const serviceProviders = serviceProvidersRes?.data || [];

  /**
   * POST: Create transformation post handler
   */
  const [
    createTransformationPost,
    { isLoading: isCreatingTransformationPost },
  ] = useCreateTransformationPostMutation();

  const onSubmit = async (data) => {
    const { beforeStory, afterStory, ...payload } = data;

    try {
      const formData = new FormData();

      formData.append("data", JSON.stringify(payload));
      formData.append("beforeStory", beforeStory[0]);
      formData.append("afterStory", afterStory[0]);

      const res = await createTransformationPost(formData).unwrap();

      if (res?.success) {
        SuccessModal("Transformation Post Created Successfully");
        router.push(`/success-stories/${res?.data?._id}`);
      }
    } catch (error) {
      ErrorModal(error?.data?.message || error?.message);
    }
  };

  return (
    <div>
      <h4 className="text-center text-3xl font-semibold">
        Share Your Transformation
      </h4>

      <Separator className="mb-8 mt-2 h-[1px] w-full bg-primary-blue" />

      <FormWrapper
        onSubmit={onSubmit}
        resolver={zodResolver(shareTransformationSchema)}
      >
        <div className="space-y-5">
          <USelect
            name="category"
            label="What kind of service it was?"
            selectTrigger="Select Category"
            selectItems={
              categories?.length === 0 ? (
                <SelectItem>No categories found</SelectItem>
              ) : (
                <>
                  {categories?.map((category) => (
                    <SelectItem key={category?._id} value={category?._id}>
                      {category?.name}
                    </SelectItem>
                  ))}
                </>
              )
            }
            onChange={(value) => setSelectedCategory(value)}
          />

          <USelect
            name="subcategory"
            label="Select Subcategory"
            selectTrigger={
              selectedCategory
                ? "Select Subcategory"
                : "Select a category first"
            }
            selectItems={
              subCategories?.length === 0 && selectedCategory ? (
                <SelectItem value="null" disabled>
                  No subcategories found
                </SelectItem>
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
            disabled={!selectedCategory}
          />

          <USearchSelect
            name="serviceProvider"
            label="Who was the service provider?"
            placeholder="Select service provider"
            data={serviceProviders?.map((sp) => ({
              value: sp?._id,
              label: sp?.name || sp?.email,
            }))}
          />

          <UInput
            name="summary"
            label="Summary/Title of your transformation story?"
            info="This helps others easily understand what your transformation story is about."
            placeholder="E.g. I had really bad hair and this is how it looks after transformation..... (max. 100 characters)"
            max="100"
          />

          <UTextEditor
            name="description"
            label="Transformation Description"
            placeholder="Tell us about your transformation story. Note: Share before and after images for others to see."
            required={true}
          />

          <div className="flex gap-5">
            <UUpload
              name="beforeStory"
              label="Before Transformation Image"
              maxFileCount={1}
              maxSize={10}
              className="w-full"
            />

            <UUpload
              name="afterStory"
              label="After Transformation Image"
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
          loading={isCreatingTransformationPost}
        >
          Submit
        </Button>
      </FormWrapper>
    </div>
  );
}
