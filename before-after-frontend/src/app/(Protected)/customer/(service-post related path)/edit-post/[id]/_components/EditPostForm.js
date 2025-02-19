"use client";
import FormWrapper from "@/components/form-components/FormWrapper";
import UInput from "@/components/form-components/UInput";
import URadioGroup from "@/components/form-components/URadioGroup";
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
import {
  useEditServicePostMutation,
  useGetSingleServicePostQuery,
} from "@/redux/api/customerApi";
import { customerCreatePostSchema } from "@/schema/customerSchema";
import { ErrorModal, SuccessModal } from "@/utils/customModal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditPostForm({ postId }) {
  const [selectedCategory, setSelectedCategory] = useState(""); // Manage selected category
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
  const { data: subCategoriesRes, isLoading: isSubCategoriesLoading } =
    useGetSubcategoryByCategoryIdQuery(selectedCategory, {
      skip: !selectedCategory,
    });
  const subCategories = subCategoriesRes?.data || [];

  /**
   * GET: Get service post by id
   */
  const { data: servicePost, isLoading: isServicePostLoading } =
    useGetSingleServicePostQuery(postId, {
      skip: !postId,
    });

  /**
   * Create service post handler
   */
  const [editServicePost, { isLoading: isEditingServicePost }] =
    useEditServicePostMutation();

  const onSubmit = async (data) => {
    const { images, ...payload } = data;

    try {
      const formData = new FormData();

      formData.append("data", JSON.stringify(payload));

      // append images in formdata
      if (images) {
        images.forEach((image) => {
          formData.append("images", image);
        });
      }

      await editServicePost({ id: postId, data: formData }).unwrap();

      SuccessModal("Post Edited Successfully");
      router.push(`/customer/view-request/${postId}`);
    } catch (error) {
      ErrorModal(error?.data?.message || error?.message);
    }
  };

  // Set default values
  const defaultValues = {
    title: servicePost?.title,
    category: servicePost?.category?._id,
    subcategory: servicePost?.subcategory?._id,
    isFree: servicePost?.isFree ? "free" : "notFree",
    images: servicePost?.images,
    description: servicePost?.description,
    consultationType: servicePost?.consultationType,
  };

  // set selected category from service post data
  useEffect(() => {
    if (servicePost?.category?._id) {
      setSelectedCategory(servicePost?.category?._id);
    }
  }, [servicePost]);

  if (isServicePostLoading || isSubCategoriesLoading || isCategoriesLoading) {
    return;
  }

  console.log(defaultValues);

  return (
    <div>
      <h4 className="text-center text-3xl font-semibold">Edit Post</h4>

      <Separator className="mb-8 mt-2 h-[1px] w-full bg-primary-blue" />

      <FormWrapper
        className="space-y-8 font-dm-sans"
        onSubmit={onSubmit}
        resolver={zodResolver(customerCreatePostSchema)}
        defaultValues={defaultValues}
      >
        <UInput
          type="text"
          name="title"
          label="What is the title of your post?"
          placeholder="E.g Looking for a professional bridal makeup artist for my wedding"
        />

        <USelect
          name="category"
          label="What kind of service are you looking for?"
          selectTrigger="Select Category"
          selectItems={categories?.map((category) => (
            <SelectItem key={category?._id} value={category?._id}>
              {category?.name}
            </SelectItem>
          ))}
          onChange={(value) => setSelectedCategory(value)}
        />

        {defaultValues?.category && defaultValues?.subcategory && (
          <USelect
            name="subcategory"
            label="Select a Subcategory"
            selectTrigger={
              selectedCategory
                ? "Select Subcategory"
                : "Select a category first"
            }
            selectItems={subCategories?.map((subCategory) => (
              <SelectItem key={subCategory?._id} value={subCategory?._id}>
                {subCategory?.name}
              </SelectItem>
            ))}
            disabled={!selectedCategory}
          />
        )}

        <USelect
          name="isFree"
          label="Select request cost type"
          selectTrigger="Costing"
          selectItems={
            <>
              <SelectItem value={"free"}>Free of Cost</SelectItem>

              <SelectItem value={"notFree"}>Request Quote</SelectItem>
            </>
          }
        />

        <UInput
          name="consultationType"
          label="Preferred Timeline *"
          placeholder="E.g. 3 days"
        />

        <UUpload name="images" label="Add Images" />

        <UTextEditor
          name="description"
          label="Description"
          placeholder="Note: Describe in detail, the kind of service you need. Add concise description with images/videos or bullet points to get faster response"
        />

        <Button
          type="submit"
          variant="primary-blue"
          className="w-full"
          size="custom"
          loading={isEditingServicePost}
        >
          Edit Post
        </Button>
      </FormWrapper>
    </div>
  );
}
