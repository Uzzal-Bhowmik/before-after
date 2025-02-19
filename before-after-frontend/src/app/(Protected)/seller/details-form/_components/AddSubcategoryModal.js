"use client";

import FormWrapper from "@/components/form-components/FormWrapper";
import USelect from "@/components/form-components/USelect";
import ModalWrapper from "@/components/ModalWrapper.js/ModalWrapper";
import { useGetAllCategoriesQuery } from "@/redux/api/categoryApi";

export default function AddSubcategoryModal({ open, setOpen }) {
  // Get all categories
  const { data: categoryRes, isLoading: isCategoryLoading } =
    useGetAllCategoriesQuery();
  console.log(categoryRes);

  return (
    <ModalWrapper open={open} setOpen={setOpen} title="Add a new subcategory">
      <FormWrapper>
        <USelect
          name="category"
          label="Category"
          selectTrigger="Select a category"
          selectItems={[]}
        />
      </FormWrapper>
    </ModalWrapper>
  );
}
