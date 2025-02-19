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
import { useCreateServicePostMutation } from "@/redux/api/customerApi";
import { customerCreatePostSchema } from "@/schema/customerSchema";
import { ErrorModal, SuccessModal } from "@/utils/customModal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CreatePostForm() {
  const [selectedCategory, setSelectedCategory] = useState(""); // Manage selected category
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
   * Create service post handler
   */
  const [createServicePost, { isLoading: isCreatingServicePost }] =
    useCreateServicePostMutation();
  const onSubmit = async (data) => {
    const { images, ...payload } = data;

    try {
      const formData = new FormData();

      formData.append("data", JSON.stringify(payload));

      // append images in formdata
      if (images) {
        images?.forEach((image) => {
          formData.append("images", image);
        });
      }

      await createServicePost(formData).unwrap();

      SuccessModal("Post Created Successfully");
      router.push("/customer/place-request");
    } catch (error) {
      ErrorModal(error?.data?.message || error?.message);
    }
  };

  return (
    <div>
      <h4 className="text-center text-3xl font-semibold">
        Post Request for Service
      </h4>

      <Separator className="mb-8 mt-2 h-[1px] w-full bg-primary-blue" />

      <FormWrapper
        className="space-y-8 font-dm-sans"
        onSubmit={onSubmit}
        resolver={zodResolver(customerCreatePostSchema)}
      >
        <UInput
          type="text"
          name="title"
          label="What is the title/subject of your post?"
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

        <USelect
          name="subcategory"
          label="Select a Subcategory"
          selectTrigger={
            selectedCategory ? "Select Subcategory" : "Select a category first"
          }
          selectItems={subCategories?.map((subCategory) => (
            <SelectItem key={subCategory?._id} value={subCategory?._id}>
              {subCategory?.name}
            </SelectItem>
          ))}
          disabled={!selectedCategory}
        />

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

        {/* <URadioGroup
          name="consultationType"
          label="Timeline *"
          items={["Urgent", "Flexible", "Within a month", "Others"].map(
            (item) => {
              return { value: item, label: item };
            },
          )}
        /> */}

        <Button
          type="submit"
          variant="primary-blue"
          className="w-full"
          size="custom"
          loading={isCreatingServicePost}
        >
          Post Request
        </Button>
      </FormWrapper>
    </div>
  );
}
