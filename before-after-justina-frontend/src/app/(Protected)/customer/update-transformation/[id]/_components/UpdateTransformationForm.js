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
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetAllCategoriesQuery,
  useGetSubcategoryByCategoryIdQuery,
} from "@/redux/api/categoryApi";
import {
  useCreateTransformationPostMutation,
  useEditTransformationPostMutation,
  useGetTransformationPostByIdQuery,
} from "@/redux/api/customerApi";
import {
  editTransformationSchema,
  shareTransformationSchema,
} from "@/schema/customerSchema";
import { ErrorModal, SuccessModal } from "@/utils/customModal";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UpdateTransformationForm({ id }) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const router = useRouter();

  /**
   * GET: Get categories
   */
  const { data: categoriesRes } = useGetAllCategoriesQuery();
  const categories = categoriesRes?.data || [];

  /**
   * GET: Get subcategories based on selected category
   */
  const { data: subCategoriesRes } = useGetSubcategoryByCategoryIdQuery(
    selectedCategory,
    {
      skip: !selectedCategory,
    },
  );
  const subCategories = subCategoriesRes?.data || [];

  /**
   * GET: Get the transformation post
   */
  const { data: transformationPost, isLoading: isTransformationPostLoading } =
    useGetTransformationPostByIdQuery(id, {
      skip: !id,
    });
  console.log(transformationPost);

  /**
   * PATCH: Update transformation post handler
   */
  const [updateTransformationPost, { isLoading: isUpdating }] =
    useEditTransformationPostMutation();

  const onSubmit = async (data) => {
    const { beforeStory, afterStory, ...payload } = data;

    try {
      const formData = new FormData();

      formData.append("data", JSON.stringify(payload));
      formData.append("beforeStory", beforeStory[0]);
      formData.append("afterStory", afterStory[0]);

      const res = await updateTransformationPost({
        id: id,
        data: formData,
      }).unwrap();

      if (res?.success) {
        SuccessModal("Transformation Post Updated Successfully");
        router.push(`/success-stories/${res?.data?._id}`);
      }
    } catch (error) {
      ErrorModal(error?.data?.message || error?.message);
    }
  };

  // Set default values
  const defaultValues = {
    category: transformationPost?.category?._id,
    subcategory: transformationPost?.subcategory?._id,

    summary: transformationPost?.summary,
    description: transformationPost?.description,
    beforeStory: [{ url: transformationPost?.beforeStory }],
    afterStory: [{ url: transformationPost?.afterStory }],
  };

  // set selected category from service post data
  useEffect(() => {
    if (transformationPost?.category?._id) {
      setSelectedCategory(transformationPost?.category?._id);
    }
  }, [transformationPost]);

  // Show loader while fetching transformation post
  if (isTransformationPostLoading) {
    return <CustomLoader />;
  }

  return (
    <div>
      <h4 className="text-center text-3xl font-semibold">
        Update Your Transformation Post
      </h4>

      <Separator className="mb-8 mt-2 h-[1px] w-full bg-primary-blue" />

      <FormWrapper
        onSubmit={onSubmit}
        resolver={zodResolver(editTransformationSchema)}
        defaultValues={defaultValues}
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
                <SelectItem>No subcategories found</SelectItem>
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
            <Check size={18} className="text-primary-blue" />
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
          loading={isUpdating}
        >
          Submit
        </Button>
      </FormWrapper>
    </div>
  );
}
