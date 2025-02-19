"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { transformNameInitials } from "@/utils/transformNameInitials";

export default function CustomAvatar({ img, name, className }) {
  return (
    <Avatar className={cn("", className)}>
      <AvatarImage src={img?.src || img} />
      <AvatarFallback>{transformNameInitials(name)}</AvatarFallback>
    </Avatar>
  );
}
