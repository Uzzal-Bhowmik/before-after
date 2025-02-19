"use client";

import Image from "next/image";
import Link from "next/link";

export default function ServiceCard({ service }) {
  return (
    <Link
      href={`/experts?category=${service?.category?._id}&subcategory=${service?._id}&subcategoryName=${service?.name}`}
      scroll={false}
      className="group block overflow-hidden"
    >
      <Image
        src={service?.banner}
        alt={service?.banner}
        height={1200}
        width={1200}
        className="h-[220px] w-full overflow-hidden object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.03]"
      />

      <p className="mt-2 font-dm-sans text-lg transition-colors duration-300 ease-in-out group-hover:text-primary-blue">
        {service?.name}
      </p>
    </Link>
  );
}
