"use client";

import FormWrapper from "@/components/form-components/FormWrapper";
import UCheckbox from "@/components/form-components/UCheckbox";
import UInput from "@/components/form-components/UInput";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSetGeoLocation } from "@/hooks/useSetGeoLocation";
import { cn } from "@/lib/utils";
import { useSignUpMutation } from "@/redux/api/authApi";
import { authValidationSchema } from "@/schema/authSchema";
import { ErrorModal, SuccessModal } from "@/utils/customModal";
import { setToSessionStorage } from "@/utils/sessionStorage";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUpForm() {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("Customer");
  const router = useRouter();
  const setGeoLocationToStore = useSetGeoLocation();

  /**
   * POST: Sign up handler
   */
  const [signUp, { isLoading: isSigningUp }] = useSignUpMutation();

  const onSubmit = async (data) => {
    // Ask for user's geo-location
    // If permitted then use, else set this dummy location as default: "latitude": 0,
    // customer location is gotten here, seller location will be gotten from seller-details-form

    let location = {
      type: "Point",
      coordinates: [0, 0],
    };
    if (selectedRole === "Customer") {
      location = await setGeoLocationToStore();
    }

    try {
      const res = await signUp({
        location,
        role: selectedRole === "Customer" ? "user" : "service_provider",
        ...data,
      }).unwrap();

      SuccessModal("Sign up successful", "Please verify your email.");

      // Store user role in session storage for after otp verification navigation
      setToSessionStorage(
        "before-after-story-sign-up-role",
        selectedRole === "Customer" ? "user" : "service_provider",
      );

      // Store temp signUpToken for otp verification
      setToSessionStorage(
        "before-after-story-signUp-token",
        res?.data?.otpToken?.token,
      );

      router.push("/otp-verification");
    } catch (error) {
      ErrorModal(error?.data?.message || error?.message);
    }
  };

  return (
    <div className="rounded-xl border border-primary-blue p-6 shadow">
      <section className="space-y-2">
        <h4 className="text-3xl font-semibold">Create Account</h4>
        <p className="text-dark-gray">
          Enter your necessary info to create your account
        </p>
      </section>

      {/* Role Selector */}
      <div className="mb-3 mt-6 space-x-2">
        {["Customer", "Service Provider"].map((role) => (
          <button
            key={role}
            className={cn(
              "h-9 w-32 rounded-2xl text-sm font-medium transition-all duration-300 ease-in-out",
              role === selectedRole
                ? "border border-transparent bg-primary-blue text-white"
                : "border border-black/50 bg-transparent text-black",
            )}
            onClick={() => setSelectedRole(role)}
          >
            {role}
          </button>
        ))}
      </div>

      <FormWrapper
        onSubmit={onSubmit}
        resolver={zodResolver(authValidationSchema.signUpSchema)}
      >
        {/* Input Fields */}
        <div className="space-y-3">
          <UInput name="name" type="text" placeholder="Full name" />

          <UInput name="email" type="email" placeholder="Email" />

          <UInput
            name="password"
            type="password"
            placeholder="Password"
            showPassword={showNewPassword}
            setShowPassword={setShowNewPassword}
          />

          <UInput
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            showPassword={showConfirmPassword}
            setShowPassword={setShowConfirmPassword}
          />
        </div>

        <div className="mb-8 mt-5">
          <UCheckbox
            name={"termsCheckbox"}
            label={
              <p className="text-gray-700">
                I agree with{" "}
                <Link href="/terms-conditions" className="underline">
                  terms and conditions
                </Link>{" "}
                of <span>Before After Story</span>
              </p>
            }
          />
        </div>

        <Button
          type="submit"
          variant="primary-blue"
          size="custom"
          className="w-full"
          loading={isSigningUp}
        >
          Sign Up
        </Button>

        <p className="mt-4 text-center text-sm text-[#666]">
          Already have an account?{" "}
          <Link href="/login" className="text-[#1A1A1A] underline">
            Login
          </Link>
        </p>

        {/* Other Login Options Divider */}
        {/* <div className="flex-center mb-4 mt-7 w-full gap-x-3">
          <Separator className="w-1/3 bg-dark-gray" />
          <p className="w-max whitespace-nowrap text-center text-sm text-dark-gray">
            Or, continue with
          </p>
          <Separator className="w-1/3 bg-dark-gray" />
        </div> */}

        {/* TODO: Google */}
        {/* <button className="flex-center-between w-full rounded-lg border px-3 py-2 hover:bg-gray-100">
          <div className="w-1/3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1.3em"
              height="1.3em"
              viewBox="0 0 128 128"
            >
              <path
                fill="#fff"
                d="M44.59 4.21a63.28 63.28 0 0 0 4.33 120.9a67.6 67.6 0 0 0 32.36.35a57.13 57.13 0 0 0 25.9-13.46a57.44 57.44 0 0 0 16-26.26a74.3 74.3 0 0 0 1.61-33.58H65.27v24.69h34.47a29.72 29.72 0 0 1-12.66 19.52a36.2 36.2 0 0 1-13.93 5.5a41.3 41.3 0 0 1-15.1 0A37.2 37.2 0 0 1 44 95.74a39.3 39.3 0 0 1-14.5-19.42a38.3 38.3 0 0 1 0-24.63a39.25 39.25 0 0 1 9.18-14.91A37.17 37.17 0 0 1 76.13 27a34.3 34.3 0 0 1 13.64 8q5.83-5.8 11.64-11.63c2-2.09 4.18-4.08 6.15-6.22A61.2 61.2 0 0 0 87.2 4.59a64 64 0 0 0-42.61-.38"
              ></path>
              <path
                fill="#e33629"
                d="M44.59 4.21a64 64 0 0 1 42.61.37a61.2 61.2 0 0 1 20.35 12.62c-2 2.14-4.11 4.14-6.15 6.22Q95.58 29.23 89.77 35a34.3 34.3 0 0 0-13.64-8a37.17 37.17 0 0 0-37.46 9.74a39.25 39.25 0 0 0-9.18 14.91L8.76 35.6A63.53 63.53 0 0 1 44.59 4.21"
              ></path>
              <path
                fill="#f8bd00"
                d="M3.26 51.5a63 63 0 0 1 5.5-15.9l20.73 16.09a38.3 38.3 0 0 0 0 24.63q-10.36 8-20.73 16.08a63.33 63.33 0 0 1-5.5-40.9"
              ></path>
              <path
                fill="#587dbd"
                d="M65.27 52.15h59.52a74.3 74.3 0 0 1-1.61 33.58a57.44 57.44 0 0 1-16 26.26c-6.69-5.22-13.41-10.4-20.1-15.62a29.72 29.72 0 0 0 12.66-19.54H65.27c-.01-8.22 0-16.45 0-24.68"
              ></path>
              <path
                fill="#319f43"
                d="M8.75 92.4q10.37-8 20.73-16.08A39.3 39.3 0 0 0 44 95.74a37.2 37.2 0 0 0 14.08 6.08a41.3 41.3 0 0 0 15.1 0a36.2 36.2 0 0 0 13.93-5.5c6.69 5.22 13.41 10.4 20.1 15.62a57.13 57.13 0 0 1-25.9 13.47a67.6 67.6 0 0 1-32.36-.35a63 63 0 0 1-23-11.59A63.7 63.7 0 0 1 8.75 92.4"
              ></path>
            </svg>
          </div>

          <p className="flex-grow whitespace-nowrap text-center font-medium">
            Continue with Google
          </p>

          <div className="w-1/3" />
        </button> */}
      </FormWrapper>
    </div>
  );
}
