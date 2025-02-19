import DynamicAvatar from "@/components/DynamicAvatar/DynamicAvatar";
import Image from "next/image";
import React from "react";

export default function TestimonialCard({ testimonial }) {
  return (
    <div className="group h-[500px] rounded-xl border p-3">
      <Image
        src={testimonial.thumbImg}
        alt={testimonial.name}
        height={1200}
        width={1200}
        className="h-[300px] w-full rounded-lg transition-all duration-300 ease-in-out group-hover:scale-[1.02]"
      />

      <div className="flex-center-start mb-3 mt-5 gap-x-3">
        <DynamicAvatar
          src={testimonial.userImg.src}
          name={testimonial.name}
          className="h-12 w-12"
        />
        <h4 className="text-xl font-semibold">{testimonial.name}</h4>
      </div>

      <p>{testimonial.comment}</p>
    </div>
  );
}
