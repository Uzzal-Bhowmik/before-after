"use client";
import Image from "next/image";
import logo from "/public/logos/Logo 1.png";
import placeholderUserAvatar from "/public/images/navbar/placeholder-user-avatar.png";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MessageSquareText } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";
import { motion } from "motion/react";
import { AnimatePresence } from "motion/react";
import { useGetAllCategoriesQuery } from "@/redux/api/categoryApi";
import { Skeleton } from "@/components/ui/skeleton";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/features/authSlice";
import { transformNameInitials } from "@/utils/transformNameInitials";
import { useGetProfileQuery } from "@/redux/api/userApi";
import { useSocket } from "@/context/SocketContextApi";
import useRefetchOnMessage from "../../../hooks/useRefetchOnMessage";
import { toast } from "sonner";
import { tagTypes } from "@/redux/tagtypes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { slideDownVariant } from "@/utils/sharedMotionVariants";

const listParentVariant = {
  initial: {
    opacity: 0,
    y: -10,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      stiffness: 280,
      damping: 30,
      staggerChildren: 0.04,
      when: "beforeChildren",
    },
  },

  exit: {
    opacity: 0,
    y: 5,
  },
};

const listItemVariant = {
  initial: {
    opacity: 0,
    y: -5,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
};

// Navigation Links
const customerLinks = [
  {
    id: 1,
    label: "Find an Expert",
    route: "/experts",
  },
  {
    id: 2,
    label: "My Posts",
    route: "/customer/place-request",
  },
  {
    id: 3,
    label: "Request From Sellers",
    route: "/customer/view-responses",
  },
];

const sellerLinks = [
  {
    id: 1,
    label: "My Leads",
    route: "/seller/leads",
  },
  {
    id: 2,
    label: "My Requests",
    route: "/seller/requests",
  },
  // {
  //   id: 3,
  //   label: "Pricing",
  //   route: "/seller/pricing",
  // },
];

export default function Navbar({ navBgColor }) {
  const user = useSelector(selectUser);
  const userId = user?.userId;
  const role = user?.role;
  const { socket } = useSocket();
  const [isUnreadMessageFound, setIsUnreadMessageFound] = useState(false);
  const [isUnreadNotificationFound, setIsUnreadNotificationFound] =
    useState(false);
  const { handleInvalidateTags } = useRefetchOnMessage();
  const router = useRouter();

  // Explore dropdown list handler
  const [expandExploreList, setExpandExploreList] = useState(false);
  const exploreDropdownRef = useRef(null);

  // Get current pathname for creating active link
  const currentPath = usePathname();

  // If single seller link is active, set that link to 'bold' and others thin
  // If no single seller link is active, set all links to 'normal'
  const isAnySellerLinkActive = sellerLinks.some(
    (link) => link.route === currentPath,
  );

  const isAnyCustomerLinkActive = customerLinks.some(
    (link) => link.route === currentPath,
  );

  // Click outside handlers
  useOnClickOutside(exploreDropdownRef, () => setExpandExploreList(false));

  /**
   * GET: Get my profile
   * Note: using this instead token decode, to get updated profile pic and name
   */
  const { data: myProfile, isLoading: isGettingProfile } = useGetProfileQuery(
    null,
    { skip: !userId },
  );

  // Listening to message notifications
  const handleNewMessageNotification = async (unreadMessageCount) => {
    if (currentPath === "/messages") {
      setIsUnreadMessageFound(false);
    }

    if (unreadMessageCount > 0) {
      setIsUnreadMessageFound(true);
    }
  };

  useEffect(() => {
    if (socket && userId) {
      socket.on(`new-notifications::${userId}`, handleNewMessageNotification);
    }

    return () => {
      socket?.off(`new-notifications::${userId}`, handleNewMessageNotification);
    };
  }, [socket, userId]);

  useEffect(() => {
    if (socket && userId) {
      socket.emit("message-notification", {});
    }
  }, [socket, userId]);

  useEffect(() => {
    if (currentPath === "/messages") {
      setIsUnreadMessageFound(false);
    }
  }, [currentPath]);

  // Listen for all notification
  const handleNotification = async (res) => {
    if (res) {
      setIsUnreadNotificationFound(true);

      toast.info(res?.message, {
        duration: 2200,
        position: "top-center",
        action: {
          label: "See Details",
          onClick: () => router.push("/notification"),
        },
      });

      // This function will invalidate all get apis
      // that needs to be updated on notification receive
      handleInvalidateTags([
        tagTypes.notifications,
        tagTypes.sellerLeads,
        tagTypes.sellerSentRequests,
        tagTypes.servicePosts,
        tagTypes.requestsForPost,
      ]);
    }
  };
  useEffect(() => {
    if (socket && userId) {
      socket.on(`notification::${userId}`, handleNotification);
    }

    return () => {
      socket?.off(`notification::${userId}`, handleNotification);
    };
  }, [socket, userId]);

  useEffect(() => {
    if (currentPath === "/notification") {
      setIsUnreadNotificationFound(false);
    }
  }, [currentPath]);

  return (
    <nav
      className={cn(
        "absolute left-1/2 top-0 z-[999] h-[90px] w-full -translate-x-1/2 px-5 md:px-10 lg:top-8 lg:w-[90%] lg:rounded-xl lg:px-8 2xl:w-[85%] 3xl:w-[80%]",
        navBgColor,
      )}
    >
      <motion.div
        variants={slideDownVariant()}
        initial="initial"
        animate="animate"
        className="flex h-full flex-row items-center justify-between"
      >
        {/* Left - Logo */}
        <Link href="/" className="w-[45%] md:w-1/4 2xl:w-1/5">
          <Image
            src={logo}
            alt="Logo of Before After"
            height={1200}
            width={1200}
            className="h-auto w-full"
          />
        </Link>

        {/* Right - Links/Buttons */}
        <section className="lg:w-3/4">
          {!userId ? (
            // Links for unauthenticated users
            <div className="flex-stretch-end gap-x-5">
              {/* Explore Dropdown List */}
              <div
                className="relative hidden md:block"
                ref={exploreDropdownRef}
              >
                <button
                  className={cn(
                    "flex-center-start h-full gap-x-1.5 rounded-lg font-medium",
                  )}
                  onClick={() => setExpandExploreList(!expandExploreList)}
                >
                  Explore
                  <ChevronDown
                    size={16}
                    className={cn(
                      "rotate-0 transition-all duration-300 ease-in-out",
                      expandExploreList && "-rotate-180",
                    )}
                  />
                </button>

                <AnimatePresence>
                  {expandExploreList && (
                    <ExploreDropdownList
                      expandExploreList={expandExploreList}
                      setExpandExploreList={setExpandExploreList}
                    />
                  )}
                </AnimatePresence>
              </div>

              <Button
                variant="secondary"
                className="hidden h-12 border border-primary-blue bg-transparent px-7 shadow-none md:inline-flex"
                asChild
              >
                <Link href="/sign-up">Join our network</Link>
              </Button>

              <Button variant="primary-blue" className="h-12 px-7" asChild>
                <Link href="/login">Log In</Link>
              </Button>
            </div>
          ) : role === "user" ? (
            // Links for customers
            <div className="flex-center-end gap-x-8">
              {/* Explore Dropdown List */}
              <div className="relative" ref={exploreDropdownRef}>
                <button
                  className={cn(
                    "hidden items-center justify-start gap-x-1.5 font-medium md:flex",
                    (isAnyCustomerLinkActive || isAnySellerLinkActive) &&
                      "text-gray-500",
                  )}
                  onClick={() => setExpandExploreList(!expandExploreList)}
                >
                  Explore
                  <ChevronDown
                    size={16}
                    className={cn(
                      "rotate-0 transition-all duration-300 ease-in-out",
                      expandExploreList && "-rotate-180",
                    )}
                  />
                </button>

                <AnimatePresence>
                  {expandExploreList && (
                    <ExploreDropdownList
                      expandExploreList={expandExploreList}
                      setExpandExploreList={setExpandExploreList}
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* Links */}
              {customerLinks?.map((item) => (
                <Link
                  key={item.id}
                  href={item.route}
                  className={cn(
                    "hidden text-lg font-medium text-black transition-all duration-300 ease-in-out xl:block",
                    isAnyCustomerLinkActive && currentPath === item.route
                      ? "font-medium"
                      : isAnyCustomerLinkActive && "text-gray-500",
                  )}
                >
                  {item.label}
                </Link>
              ))}

              <div className="flex-center-start gap-x-4 lg:gap-x-6">
                {/* Notification */}
                <Link href="/notification" className="relative pt-1">
                  {isUnreadNotificationFound && (
                    <Badge className="ping absolute -right-1 top-0 aspect-square !h-3 !w-3 rounded-full bg-primary-red !p-0" />
                  )}
                  <Bell className="size-5 md:size-6" />
                </Link>

                {/* Message */}
                <Link href="/messages" className="relative pt-1">
                  {isUnreadMessageFound && (
                    <Badge className="ping absolute -right-1 top-0 aspect-square !h-3 !w-3 rounded-full bg-primary-red !p-0" />
                  )}
                  <MessageSquareText className="size-5 md:size-6" />
                </Link>

                {/* User Profile */}
                <Link href="/customer/profile" className="hidden xl:block">
                  <UserAvatar myProfile={myProfile} />
                </Link>

                <ProfileDropdownList
                  links={customerLinks}
                  trigger={<UserAvatar myProfile={myProfile} />}
                  dashboardLink={"/customer/profile"}
                  className="!z-[9999] block xl:hidden"
                />
              </div>
            </div>
          ) : (
            // Links for sellers
            <div className="flex-center-end gap-x-8">
              {sellerLinks?.map((item) => (
                <Link
                  key={item.id}
                  href={item.route}
                  className={cn(
                    "hidden text-lg font-medium text-black transition-all duration-300 ease-in-out lg:inline-block",
                    isAnySellerLinkActive && currentPath === item.route
                      ? "font-medium"
                      : isAnySellerLinkActive && "text-gray-500",
                  )}
                >
                  {item.label}
                </Link>
              ))}

              <div className="flex-center-start gap-x-4 md:gap-x-6">
                {/* Notification */}
                <Link href="/notification" className="relative pt-1">
                  {isUnreadNotificationFound && (
                    <Badge className="ping absolute -right-1 top-0 aspect-square !h-3 !w-3 rounded-full bg-primary-red !p-0" />
                  )}
                  <Bell className="size-5 md:size-6" />
                </Link>

                {/* Message */}
                <Link href="/messages" className="relative pt-1">
                  {isUnreadMessageFound && (
                    <Badge className="ping absolute -right-1 top-0 aspect-square !h-3 !w-3 rounded-full bg-primary-red !p-0" />
                  )}
                  <MessageSquareText className="size-5 md:size-6" />
                </Link>

                {/* User Profile */}
                <Link href="/seller/dashboard" className="hidden lg:block">
                  <UserAvatar myProfile={myProfile} />
                </Link>

                <ProfileDropdownList
                  links={sellerLinks}
                  trigger={<UserAvatar myProfile={myProfile} />}
                  dashboardLink={"/seller/dashboard"}
                  className="!z-[9999] block lg:hidden"
                />
              </div>
            </div>
          )}
        </section>
      </motion.div>
    </nav>
  );
}

// Explore Dropdown list
const ExploreDropdownList = ({ setExpandExploreList }) => {
  const router = useRouter();

  // Get categories
  const { data: categoriesRes, isLoading: isCategoryLoading } =
    useGetAllCategoriesQuery();
  const categories = categoriesRes?.data || [];

  return (
    <div>
      <motion.div
        className="absolute -left-10 top-[58px] !z-[999] h-fit max-h-[70vh] w-[300px] overflow-auto rounded-lg border-[2px] border-primary-blue bg-white py-2 shadow-lg scrollbar-thin scrollbar-track-slate-300 scrollbar-track-rounded-full scrollbar-thumb-rounded-full"
        variants={listParentVariant}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {isCategoryLoading ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 10 }).map((_, idx) => (
              <Skeleton key={idx} className="h-3 rounded-lg bg-slate-300" />
            ))}
          </div>
        ) : (
          <>
            {categories?.map((item) => (
              <motion.button
                key={item?._id}
                variants={listItemVariant}
                className="block w-full rounded-lg px-5 py-2.5 text-left text-base font-[500] transition-all duration-300 ease-in-out hover:bg-primary-blue/10"
                onClick={() => {
                  setExpandExploreList(false);
                  router.push("/services?" + `category=${item?._id}`); // use hash Id to scroll to specific section
                }}
              >
                {item.name}
              </motion.button>
            ))}
          </>
        )}
      </motion.div>
    </div>
  );
};

// Profile Dropdown list for mobile devices
const ProfileDropdownList = ({ links, trigger, dashboardLink, className }) => {
  return (
    <DropdownMenu className="!z-[9999]">
      <DropdownMenuTrigger className={className}>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="!z-[9999] border border-primary-blue font-dm-sans"
      >
        <DropdownMenuItem asChild>
          <Link href={dashboardLink}>My Dashboard</Link>
        </DropdownMenuItem>

        {links?.map((link) => (
          <DropdownMenuItem key={link.route} asChild>
            <Link href={link.route}>{link.label}</Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// User avatar

const UserAvatar = ({ myProfile }) => {
  return myProfile?.profile || myProfile?.name ? (
    <Avatar className="bg-primary-blue ring-2 ring-primary-green transition-all duration-300 ease-in-out hover:scale-[0.95] hover:ring-offset-2">
      <AvatarImage src={myProfile?.profile} />
      <AvatarFallback className="text-sm font-medium">
        {transformNameInitials(myProfile?.name)}
      </AvatarFallback>
    </Avatar>
  ) : (
    <Avatar className="border border-primary-blue p-0.5">
      <AvatarImage src={placeholderUserAvatar?.src} />
    </Avatar>
  );
};
