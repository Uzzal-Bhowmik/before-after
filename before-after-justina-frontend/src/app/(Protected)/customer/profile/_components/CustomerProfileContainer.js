"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import userAvatar from "/public/images/customer/profile/Ellipse 437.png";
import FormWrapper from "@/components/form-components/FormWrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import { customerProfileSchema } from "@/schema/customerSchema";
import UInput from "@/components/form-components/UInput";
import UPhoneInput from "@/components/form-components/UPhoneInput";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { EditIcon } from "lucide-react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { removeFromSessionStorage } from "@/utils/sessionStorage";
import {
  useDeleteAccountMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "@/redux/api/userApi";
import { useDispatch } from "react-redux";
import { logout, selectUser } from "@/redux/features/authSlice";
import { ConfirmModal, ErrorModal, SuccessModal } from "@/utils/customModal";
import { transformNameInitials } from "@/utils/transformNameInitials";
import { useEffect } from "react";
import { successToast } from "@/utils/customToast";
import ProfilePicHandler from "./ProfilePicHandler";

export default function CustomerProfileContainer() {
  const dispatch = useDispatch();
  const router = useRouter();

  /**
   * GET: Get customer profile details
   */
  const { data: customerProfile, isLoading } = useGetProfileQuery();

  /**
   * PATCH: Update customer profile
   */
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  /**
   * DELETE: Delete customer account
   */
  const [deleteAccount, { isLoading: isDeleting }] = useDeleteAccountMutation();

  // Handle logout
  const handleLogout = (operation) => {
    if (operation !== "delete") {
      SuccessModal("Logged out successfully");
    }

    dispatch(logout());
    router.refresh();
    router.push("/login");
  };

  // Set default values
  const defaultValues = {
    name: customerProfile?.name || "N/A",
    email: customerProfile?.email,
    phoneNumber: customerProfile?.phoneNumber,
  };

  // Submit handler -- Update customer profile
  const onSubmit = (data) => {
    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify(data));

      updateProfile(formData).unwrap();

      successToast("Profile updated successfully");
    } catch (err) {
      ErrorModal(err?.data?.message || err?.message);
    }
  };

  // Delete account handler
  const handleDeleteAccount = () => {
    ConfirmModal(
      "Delete Account?",
      "Deleting account will remove your account details permanently.",
    ).then(async (res) => {
      if (res?.isConfirmed) {
        try {
          await deleteAccount().unwrap();
          SuccessModal("Account deleted successfully");

          handleLogout("delete");
        } catch (error) {
          ErrorModal(error?.data?.message || error?.message);
        }
      }
    });
  };

  return (
    <div>
      <section>
        <div className="relative">
          <h3 className="mb-10 text-2xl font-semibold md:text-3xl">
            Add Profile Picture
          </h3>

          {/* Logout button */}
          <button
            className="flex-center absolute right-0 top-0 gap-x-2 rounded-full bg-primary-blue px-5 py-[10px] text-sm font-medium text-white"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        <ProfilePicHandler
          customerProfile={customerProfile}
          updateProfile={updateProfile}
          isUpdating={isUpdating}
        />
      </section>

      {/* Profile Form */}
      <section>
        {!isLoading && (
          <FormWrapper
            onSubmit={onSubmit}
            resolver={zodResolver(customerProfileSchema)}
            defaultValues={defaultValues}
            className={"my-10 space-y-12"}
          >
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-3">
              <UInput
                name="name"
                label="Full Name"
                placeholder="Enter your full name"
              />
              <UPhoneInput name="phoneNumber" label="Phone Number" />
              <UInput type="email" name="email" label="Email" disabled={true} />
            </div>

            <div className="flex-center-between gap-x-5">
              <Button
                type="submit"
                variant="primary-blue"
                size="custom"
                className="lg:w-1/4"
                loading={isUpdating}
              >
                <EditIcon size={18} />
                Save Changes
              </Button>

              <Button
                type="button"
                variant="destructive"
                size="custom"
                className="lg:w-1/4"
                onClick={handleDeleteAccount}
              >
                <Trash2 size={18} />
                Delete Account
              </Button>
            </div>
          </FormWrapper>
        )}
      </section>
    </div>
  );
}
