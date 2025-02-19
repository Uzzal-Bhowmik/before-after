import PricingContainer from "@/app/(Protected)/seller/pricing/_components/PricingContainer";
import ResponsiveContainer from "@/components/ResponsiveContainer/ResponsiveContainer";
import React from "react";

export default function Pricing() {
  return (
    <div className="bg-demin-primary-50 py-10">
      <ResponsiveContainer>
        <section>
          <h1 className="primary-title text-center">Subscription Plans</h1>

          <p className="mb-16 mt-3 text-center text-xl text-dark-gray">
            Do you want to be an{" "}
            <span className="font-medium">service provider</span> on our
            platform and offer your services? Our subscription plans are
            designed to meet your needs.
          </p>
        </section>
        <PricingContainer />
      </ResponsiveContainer>
    </div>
  );
}
