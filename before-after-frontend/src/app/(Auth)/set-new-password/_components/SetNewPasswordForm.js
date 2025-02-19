"use client";

import FormWrapper from "@/components/form-components/FormWrapper";
import UInput from "@/components/form-components/UInput";
import { Button } from "@/components/ui/button";
import { authValidationSchema } from "@/schema/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

export default function SetNewPasswordForm() {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = async (data) => {
    console.log(data);
  };

  return (
    <section className="rounded-xl border border-primary-blue/25 p-6 shadow lg:w-[40%]">
      <section className="mb-8 space-y-2">
        <h4 className="text-3xl font-semibold">Set New Password</h4>
        <p className="text-dark-gray">Type in your new password</p>
      </section>

      <FormWrapper
        onSubmit={onSubmit}
        resolver={zodResolver(authValidationSchema.setNewPasswordSchema)}
        className="space-y-5"
      >
        <UInput
          name="newPassword"
          type="password"
          placeholder="New password"
          showPassword={showNewPassword}
          setShowPassword={setShowNewPassword}
        />

        <UInput
          name="confirmPassword"
          type="password"
          placeholder="Confirm new password"
          showPassword={showConfirmPassword}
          setShowPassword={setShowConfirmPassword}
        />

        <Button
          type="submit"
          variant="primary-blue"
          size="custom"
          className="w-full"
        >
          Update Password
        </Button>
      </FormWrapper>
    </section>
  );
}
