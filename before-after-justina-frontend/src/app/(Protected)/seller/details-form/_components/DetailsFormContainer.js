"use client";

import Image from "next/image";
import sellerDetailsFormVector from "/public/images/seller/seller-details-1.png";
import FormWrapper from "@/components/form-components/FormWrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import { sellerDetailsSchema } from "@/schema/sellerSchema";
import UInput from "@/components/form-components/UInput";
import UPhoneInput from "@/components/form-components/UPhoneInput";
import { Controller, useFormContext } from "react-hook-form";
import { X } from "lucide-react";
import { Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CloudUpload } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import {
  useGetAllCategoriesQuery,
  useGetSubcategoryByCategoryIdQuery,
} from "@/redux/api/categoryApi";
import { USearchSelect } from "@/components/form-components/USearchSelect";
import UUpload from "@/components/form-components/UUpload";
import GoogleMapContainer from "@/components/GoogleMapContainer/GoogleMapContainer";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "@/redux/api/userApi";
import { ErrorModal, SuccessModal } from "@/utils/customModal";
import CustomLoader from "@/components/CustomLoader/CustomLoader";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/features/authSlice";
import UTextarea from "@/components/form-components/UTextarea";
import UMultiSelect from "@/components/form-components/UMultiSelect";
import USelect from "@/components/form-components/USelect";
import { SelectItem } from "@/components/ui/select";
import { PlusCircle } from "lucide-react";
import CustomTooltip from "@/components/CustomTooltip/CustomTooltip";
import AddSubcategoryModal from "./AddSubcategoryModal";

export default function DetailsFormContainer() {
  const [selectedCategory, setSelectedCategory] = useState(""); // Manage selected category
  const router = useRouter();
  const loggedInUser = useSelector(selectUser);
  const [showAddSubcategoryModal, setShowAddSubcategoryModal] = useState(false);

  // States to manage user's location
  const [longitude, setLongitude] = useState(90.4152);
  const [latitude, setLatitude] = useState(23.8041);
  const [address, setAddress] = useState("");

  // Redirect user if role is not seller
  useEffect(() => {
    if (loggedInUser?.role !== "service_provider") {
      ErrorModal("Something went wrong!!");
      return router.push("/");
    }
  }, [loggedInUser]);

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
   * GET: Get user profile for default values
   */
  const { data: profile, isLoading: isProfileLoading } = useGetProfileQuery(
    loggedInUser?.userId,
    {
      skip: !loggedInUser?.userId,
    },
  );

  /**
   * PATCH: Update seller profile to add extra info
   */
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const onSubmit = async (data) => {
    if (!latitude && !longitude) {
      return ErrorModal(
        "Something went wrong with your location.",
        "Please try with a different location.",
      );
    }

    const { profile, banner, documents, services, ...rest } = data;

    // return console.log(data);

    if (!services?.length) return;

    const formdata = new FormData();
    // append profile
    formdata.append("profile", profile[0]);

    // append banner
    formdata.append("banner", banner[0]);

    // append documents
    documents?.forEach((document) => {
      formdata.append("documents", document);
    });

    // append rest along with location coords as data
    formdata.append(
      "data",
      JSON.stringify({
        ...rest,

        services: services?.map((service) => service.value),

        location: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
      }),
    );

    try {
      await updateProfile(formdata).unwrap();

      SuccessModal(
        "Thanks for sharing your details.",
        "Your profile has been updated accordingly.",
      );
      router.push(`/seller/dashboard`);
    } catch (error) {
      ErrorModal(error?.data?.message || error?.message);
    }
  };

  // Set default values
  const defaultValues = {
    name: profile?.name,
    serviceType: profile?.serviceType,
    aboutMe: profile?.aboutMe,
    phoneNumber: profile?.phoneNumber,
    address: profile?.address,
    category: profile?.category?._id,
    serviceCharge: profile?.serviceCharge?.toString(),
    serviceChargeType: profile?.serviceChargeType,

    // services / subcategories
    services:
      profile?.services?.map((service) => ({
        label: service.name,
        value: service._id,
      })) || [],
    profile: profile?.profile ? [{ url: profile?.profile }] : [],
    banner: profile?.banner ? [{ url: profile?.banner }] : [],
    documents: profile?.documents,
  };

  // set selected category from service post data
  useEffect(() => {
    if (profile?.category) {
      setSelectedCategory(profile?.category?._id);
    }
  }, [profile]);

  if (isProfileLoading) {
    return (
      <CustomLoader
        color="var(--primary-blue)"
        size={36}
        className="mx-auto my-[30vh]"
      />
    );
  }

  return (
    <div className="flex-center hide-scroll relative h-[80vh] w-full overflow-auto rounded-xl border border-gray-300 pt-10">
      {/* Form Container */}
      <div className="h-full w-1/2">
        <div className="mb-10 space-y-2 text-center font-dm-sans">
          <h3 className="text-3xl font-semibold">Help us know you better</h3>
          <p className="text-gray-600">
            Please answer these questions to help us get to know you better and
            make you more presentable to the customers
          </p>
        </div>

        {/* Form */}
        {isProfileLoading ? (
          <div className="flex-center my-20">
            <CustomLoader color="var(--primary-blue)" size={36} />
          </div>
        ) : (
          <div className="pb-20 lg:w-full">
            <FormWrapper
              onSubmit={onSubmit}
              resolver={zodResolver(sellerDetailsSchema)}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.preventDefault();
              }}
              defaultValues={defaultValues}
            >
              {/* Inputs */}
              <div className="space-y-6">
                <UInput
                  name="name"
                  label={
                    <div>
                      <p>Full Name</p>
                      <p className="mt-2 font-medium text-gray-500">
                        (Note: It will be visible to customers)
                      </p>
                    </div>
                  }
                  placeholder="Enter your valid name"
                />

                <UInput
                  name="serviceType"
                  label="Profession"
                  placeholder="E.g. Senior Dentist | Oral Health Expert | Patient-Centered Care Advocate"
                />

                <UTextarea
                  name="aboutMe"
                  label="Bio"
                  placeholder="Tell customers about yourself"
                />

                <USearchSelect
                  name="category"
                  label="What kind of service you provide?"
                  placeholder="Select Category"
                  data={categories?.map((category) => ({
                    label: category.name,
                    value: category._id,
                  }))}
                  onChange={(value) => setSelectedCategory(value)}
                />

                <UMultiSelect
                  name={"services"}
                  label={
                    <div className="flex-center-between">
                      <span>Select a Subcategory</span>
                      <CustomTooltip title="Add new subcategory">
                        <button
                          type="button"
                          onClick={() => setShowAddSubcategoryModal(true)}
                        >
                          <PlusCircle
                            className="size-5 text-black/75 hover:text-black"
                            aria-label="Add new subcategory"
                          />
                        </button>
                      </CustomTooltip>
                    </div>
                  }
                  placeholder={
                    selectedCategory
                      ? "Select Subcategory"
                      : "Select a category first"
                  }
                  data={subCategories?.map((subcategory) => ({
                    label: subcategory.name,
                    value: subcategory._id,
                  }))}
                  disabled={!selectedCategory}
                />

                <UPhoneInput
                  label="Contact Number"
                  name="phoneNumber"
                  placeholder="Enter your contact number"
                />

                <div className="grid grid-cols-2 gap-x-5">
                  <UInput
                    name="serviceCharge"
                    type="number"
                    label="Service Charge ($)"
                    placeholder="$"
                    labelClass="!pb-3"
                  />

                  <USelect
                    name="serviceChargeType"
                    label="Service Charge Type"
                    selectTrigger={"Select charge type"}
                    selectItems={[
                      { label: "Hourly", value: "hourly" },
                      { label: "Per Service", value: "fixed" },
                    ].map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item?.label}
                      </SelectItem>
                    ))}
                  />
                </div>

                <UUpload
                  name="profile"
                  label="Your professional portfolio image"
                  maxFileCount={1}
                />

                <UUpload
                  name="banner"
                  label={
                    <div>
                      <span>Profile banner (Optional)</span>
                      <span className="mt-2 block font-medium text-gray-500">
                        (Note: It&apos;s recommended to upload a banner with min
                        height of 300px and min width of 1200px.)
                      </span>
                    </div>
                  }
                  maxFileCount={1}
                />

                <UUpload
                  name="documents"
                  label={
                    <div>
                      <span>
                        Upload Certificates/Professional Excellency Documents
                      </span>

                      <span className="mt-2 block font-medium text-gray-500">
                        (Note: Please don&apos;t share any sensitive documents
                        instead share documents that proves your professional
                        excellence and experience to customers.)
                      </span>
                    </div>
                  }
                  maxFileCount={4}
                />

                <div className="flex flex-col gap-y-3">
                  <Label htmlFor="address">Where are you located? *</Label>
                  <GoogleMapContainer
                    address={address}
                    setAddress={setAddress}
                    latitude={latitude}
                    setLatitude={setLatitude}
                    longitude={longitude}
                    setLongitude={setLongitude}
                  />

                  {/* Address Input box */}
                  <UInput name={"address"} disabled={true} value={address} />
                </div>
              </div>

              {/* Buttons */}
              <Button
                type="submit"
                variant="primary-blue"
                size="custom"
                className="mx-auto mt-10 block w-full font-medium"
                loading={isUpdating}
              >
                Finish
              </Button>
            </FormWrapper>
          </div>
        )}
      </div>

      {/* Add subcategory modal */}
      <AddSubcategoryModal
        open={showAddSubcategoryModal}
        setOpen={setShowAddSubcategoryModal}
      />
    </div>
  );
}
