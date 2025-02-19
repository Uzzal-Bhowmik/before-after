import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { transformNameInitials } from "@/utils/transformNameInitials";

export default function DynamicAvatar({ className, src, name }) {
  return (
    <Avatar className={cn("", className)}>
      <AvatarImage src={src} />
      <AvatarFallback>{transformNameInitials(name)}</AvatarFallback>
    </Avatar>
  );
}
