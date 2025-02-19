import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ErrorModal } from "@/utils/customModal";
import { successToast } from "@/utils/customToast";
import { transformNameInitials } from "@/utils/transformNameInitials";
import { X } from "lucide-react";
import { Camera } from "lucide-react";
import React, { useState } from "react";

export default function ProfilePicHandler({
  updateProfile,
  isUpdating,
  customerProfile,
}) {
  const [profilePicInput, setProfilePicInput] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState(null);

  // Change and show profile pic locally
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setProfilePicInput(file);
      setProfilePicUrl(URL.createObjectURL(file));
    }
  };

  // Change Profile Picture api handler
  const handleChangeProfilePic = async (e) => {
    e.preventDefault();

    if (!profilePicInput) {
      ErrorModal("Profile picture not found!");
      return;
    }

    // Check if file size is greater than 5mb
    if (profilePicInput?.size > 5 * 1024 * 1024) {
      ErrorModal(" File size should be less than 5mb");
      return;
    }

    const formData = new FormData();

    formData.append("profile", profilePicInput);

    try {
      const res = await updateProfile(formData).unwrap();
      if (res?.success) {
        successToast("Profile picture updated successfully");

        setProfilePicUrl(null);
        setProfilePicInput(null);
        document.getElementById("profilePicInput").value = null;
      }
    } catch (error) {
      ErrorModal(error?.data?.message);
    }
  };

  return (
    <div className="flex-center-start gap-x-10">
      <div>
        {profilePicUrl ? (
          <div className="relative">
            <Avatar className="h-[150px] w-[150px] border-2 border-primary-blue lg:h-[180px] lg:w-[180px]">
              <AvatarImage src={profilePicUrl} />
            </Avatar>

            {/* show close button if profile pic url is present */}
            <button
              className="absolute right-4 top-4 rounded-full bg-black p-[4px] text-danger"
              onClick={() => {
                document.getElementById("profilePicInput").value = null;
                setProfilePicInput(null);
                setProfilePicUrl(null);
              }}
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="group relative">
            <Avatar className="h-[150px] w-[150px] border-2 border-primary-blue lg:h-[180px] lg:w-[180px]">
              <AvatarImage src={customerProfile?.profile} />
              <AvatarFallback className="text-4xl font-semibold">
                {transformNameInitials(
                  customerProfile?.name || customerProfile?.email,
                )}
              </AvatarFallback>
            </Avatar>

            {!profilePicInput && (
              <button
                className="absolute bottom-2 right-2 rounded-full border bg-primary-blue p-2 text-white"
                onClick={() =>
                  document.getElementById("profilePicInput").click()
                }
                title="Change profile picture"
              >
                <Camera size={16} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        id="profilePicInput"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="w-max">
        <p className="font-medium text-dark-gray">
          Maximum size 5 MB. Format jpg, jpeg & png.
        </p>

        <Button
          variant="primary-blue"
          size="custom"
          className="mx-auto mt-4 block w-full lg:w-[250px]"
          disabled={isUpdating || !profilePicUrl}
          loading={isUpdating}
          onClick={handleChangeProfilePic}
        >
          Change Picture
        </Button>
      </div>
    </div>
  );
}
