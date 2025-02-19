"use client";

import FormWrapper from "@/components/form-components/FormWrapper";
import UInput from "@/components/form-components/UInput";
import { Button } from "@/components/ui/button";
import { authValidationSchema } from "@/schema/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const onSubmit = async (data) => {
    console.log(data);

    router.push("/otp-verification");
  };

  return (
    <div className="rounded-xl border border-primary-blue/25 p-6 shadow">
      <section className="mb-8 space-y-2">
        <h4 className="text-3xl font-semibold">Forgot Password</h4>
        <p className="text-dark-gray">
          Enter your email below to request an OTP for account password reset.
        </p>
      </section>

      <FormWrapper
        onSubmit={onSubmit}
        resolver={zodResolver(authValidationSchema.forgotPasswordSchema)}
        className="space-y-5"
      >
        <UInput name="email" type="email" placeholder="Email" />

        <Button
          type="submit"
          variant="primary-blue"
          size="custom"
          className="w-full"
        >
          Submit
        </Button>
      </FormWrapper>
    </div>
  );
}
