"use client";
import ResponsiveContainer from "@/components/ResponsiveContainer/ResponsiveContainer";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { Trash } from "lucide-react";
import { Edit } from "lucide-react";
import {
  useDeleteAccountMutation,
  useGetProfileQuery,
} from "@/redux/api/userApi";
import BeatLoader from "@/components/loaders/BeatLoader";
import CustomAvatar from "@/components/CustomAvatar/CustomAvatar";
import { Eye } from "lucide-react";
import CustomLoader from "@/components/CustomLoader/CustomLoader";
import { useGetMyActivitiesQuery } from "@/redux/api/serviceProviderApi";
import { useSelector } from "react-redux";
import { logout, selectUser } from "@/redux/features/authSlice";
import EmptyContainer from "@/components/EmptyContainer/EmptyContainer";
import SellerActivityCard from "../../[id]/_components/SellerActivityCard";
import placeholderImg from "/public/images/placeholder-img.svg";
import { useRouter } from "next/navigation";
import { LucideMapPin } from "lucide-react";
import { PhoneCall } from "lucide-react";
import { Star } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Preview from "@/components/Preview/Preview";
import ImagePreviewer from "@/components/ui/image-previewer";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Mail } from "lucide-react";
import { successToast } from "@/utils/customToast";
import { ConfirmModal, ErrorModal, SuccessModal } from "@/utils/customModal";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { transformNameInitials } from "@/utils/transformNameInitials";
import CustomStarRating from "@/components/CustomStarRating/CustomStarRating";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function ProfileDashboard() {
  const userId = useSelector(selectUser);
  const router = useRouter();
  const [documentImgPreviewIndex, setDocumentImgPreviewIndex] = useState(-1);
  const dispatch = useDispatch();

  /**
   * GET: Get seller profile details
   */
  const { data: profile, isLoading: isProfileLoading } = useGetProfileQuery();

  /**
   * GET: Get my activities
   */
  const { data: myActivitiesRes, isLoading: isActivitiesLoading } =
    useGetMyActivitiesQuery(null, { skip: !userId });
  const myActivities = myActivitiesRes?.data;

  // TODO: Get my subscription once client confirm
  // const { data: mySubscription } = useGetMySubscriptionQuery(userId, {
  //   skip: !userId,
  // });

  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
    successToast("Logged out successfully");
    router.refresh();
    router.push("/login");
  };

  // Delete account
  const [deleteAccount, { isLoading: isDeleting }] = useDeleteAccountMutation();
  const handleDeleteAccount = () => {
    ConfirmModal(
      "Delete Account?",
      "Caution: All your account details will be permanently deleted!!",
    ).then(async (res) => {
      if (res?.isConfirmed) {
        try {
          await deleteAccount().unwrap();

          SuccessModal("Account deleted successfully");
          handleLogout();
        } catch (error) {
          ErrorModal(error?.message || error?.error);
        }
      }
    });
  };

  return (
    <div>
      {/* Banner */}
      <section
        className={cn(
          "relative h-[20vh] w-full lg:h-[70vh]",
          !profile?.banner && "bg-placeholder-background",
        )}
      >
        {isProfileLoading ? (
          <div className="flex-center h-full">
            <BeatLoader />
          </div>
        ) : (
          <>
            {profile?.banner ? (
              <div
                style={{
                  backgroundImage: `url('${profile?.banner}')`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPositionY: "10%",
                }}
                className="h-full w-full"
              ></div>
            ) : (
              <Image
                src={placeholderImg}
                alt="Seller profile placeholder banner"
                height={3600}
                width={3600}
                className={cn(
                  "h-full w-full",
                  profile?.banner ? "object-cover" : "object-contain",
                )}
              />
            )}
          </>
        )}
      </section>

      <ResponsiveContainer classes={"relative w-full"}>
        {/* ======================== Profile Picture ======================== */}
        <CustomAvatar
          img={profile?.profile}
          name={profile?.name}
          className="absolute -top-24 left-1/2 h-24 w-24 -translate-x-1/2 border-primary-blue text-2xl font-semibold shadow-lg ring-2 ring-white ring-offset-2 ring-offset-white md:h-32 md:w-32 lg:left-0 lg:h-48 lg:w-48 lg:-translate-x-0"
        />

        {/* Placeholder div for absolute profile pic div */}
        <div className="lg:justify-end-end hide-scroll mt-10 flex h-20 items-start justify-start gap-3 overflow-auto py-5 md:h-24 lg:mt-0 lg:h-36 lg:flex-nowrap lg:justify-end">
          <Button
            className="rounded-3xl"
            variant="primary-blue"
            size="custom-md"
            asChild
          >
            <Link href={`/seller/details-form`}>
              <Edit size={16} />
              Update Profile
            </Link>
          </Button>

          <Button
            title="See how your profile looks to customers"
            className="rounded-3xl"
            variant="primary-blue"
            size="custom-md"
            asChild
          >
            <Link href={`/seller/${profile?._id}`}>
              <Eye size={16} />
              Preview
            </Link>
          </Button>

          <Button
            className="rounded-3xl"
            variant="primary-blue"
            size="custom-md"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            Logout
          </Button>

          <Button
            variant="destructive"
            size="custom-md"
            className="rounded-3xl"
            onClick={handleDeleteAccount}
            loading={isDeleting}
          >
            <Trash size={18} />
            Delete account
          </Button>
        </div>

        {/* ======================== Personal Info ======================== */}
        <section className="font-dm-sans">
          <h3 className="mb-1 font-general-sans text-4xl font-semibold">
            {profile?.name}
          </h3>
          <p className="text-lg font-medium text-gray-600">
            {profile?.serviceType || <span>N/A</span>}
          </p>

          <div className="flex-center-start mt-3 flex-wrap gap-x-7 gap-y-3 font-medium text-gray-600">
            <div className="flex-center-start gap-x-2">
              <LucideMapPin size={18} />
              <p>{profile?.address}</p>
            </div>

            <div className="flex-center-start gap-x-2">
              <PhoneCall size={18} />
              <p>{profile?.phoneNumber}</p>
            </div>

            <div className="flex-center-start gap-x-2">
              <Mail size={18} />
              <p>{profile?.email}</p>
            </div>

            <div className="flex-center-start gap-x-2 rounded-full">
              <Star size={18} />
              <p>{profile?.avgRating}</p>
            </div>
          </div>

          <div className="flex-center-start mt-4">
            <h4 className="font-general-sans text-3xl font-bold">
              ${profile?.serviceCharge}
              {profile?.serviceChargeType === "hourly" ? (
                <span className="font-dm-sans text-sm font-medium text-muted">
                  /hr
                </span>
              ) : (
                <span className="font-dm-sans text-sm font-medium text-muted">
                  /service
                </span>
              )}
            </h4>
          </div>

          <Separator className="my-4 w-full" />

          <div className="space-y-2">
            <p className="font-general-sans text-lg font-semibold">About Me</p>
            <p className="w-[85%] font-dm-sans">{profile?.aboutMe}</p>
          </div>

          {/* TODO: Enable subscription once client is ready */}
          {/* <div className="mt-8">
            {mySubscription?.isPaid ? (
              <Badge className="gap-x-1 rounded-full bg-green-700 px-5 py-2 text-base font-medium text-white">
                <Check size={20} /> Subscription active till{" "}
                {mySubscription?.expiredAt &&
                  format(mySubscription?.expiredAt, "dd MMM yyyy")}
              </Badge>
            ) : (
              <div className="flex-center-start gap-x-2">
                <Badge
                  variant="cancelled"
                  className="h-[43px] gap-x-2 rounded-full px-4 text-sm font-medium text-white"
                >
                  <CircleAlert size={18} /> Not Subscribed
                </Badge>

                <HoverCard openDelay={0}>
                  <HoverCardTrigger>
                    <Button
                      variant="primary-blue"
                      className="group h-[43px] rounded-full px-6 text-sm"
                      asChild
                    >
                      <Link href={"/seller/pricing"}>
                        Subscribe Now <AnimatedArrow />
                      </Link>
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent>
                    Subscribe to let customers book appointments with you and
                    get access to all our exciting services.{" "}
                  </HoverCardContent>
                </HoverCard>
              </div>
            )}
          </div> */}
        </section>
        {/* ======================== Services > Subcategories ============================ */}
        <section className="my-16">
          <h2 className="mb-8 text-3xl font-semibold">My Services</h2>
          {isProfileLoading ? (
            <div className="flex-center my-16">
              <CustomLoader color="var(--primary-blue)" size={35} />
            </div>
          ) : (
            <>
              {profile?.services?.length === 0 ? (
                <EmptyContainer />
              ) : (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
                  {profile?.services?.map((service) => (
                    <Link
                      href={`/experts?service=${service?._id}`}
                      key={service._id}
                      className={`relative cursor-pointer rounded-xl bg-gradient-to-br from-primary-blue to-primary-blue/80 p-2.5 text-white transition-colors duration-200`}
                    >
                      <Image
                        src={service.banner || placeholderImg}
                        alt={"Image of " + service.name}
                        width={500}
                        height={500}
                        className="h-[140px] w-full rounded-lg"
                      />

                      <p className="mt-2 font-medium">{service.name}</p>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </section>

        {/* ======================= Activities ============================= */}
        <section className="my-20">
          <div className="mb-8 flex flex-col gap-y-3 md:flex-row md:items-center md:justify-between">
            <h2 className="text-3xl font-semibold">My Activities</h2>
            {profile?.isFreeServiceGiven && (
              <Button
                asChild
                variant="primary-blue"
                size="custom"
                className="w-max"
              >
                <Link href="/seller/add-activity">Create activity post</Link>
              </Button>
            )}
          </div>

          {isActivitiesLoading ? (
            <div className="flex-center my-16">
              <CustomLoader color="var(--primary-blue)" size={35} />
            </div>
          ) : myActivities?.length === 0 ? (
            <div className="flex flex-col items-center gap-y-2 font-dm-sans font-medium">
              <EmptyContainer className="!my-0" />
              {profile?.isFreeServiceGiven ? (
                <p className="text-center text-green-600">
                  Oh Great! You&apos;ve provided free of cost services. Now, you
                  can post your activities for promotion.
                </p>
              ) : (
                <p className="text-center text-danger">
                  You&apos;ll need to provide at least one free of cost service
                  to post your activities!!
                </p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {myActivities?.map((activity) => (
                <SellerActivityCard key={activity?._id} data={activity} />
              ))}
            </div>
          )}
        </section>

        {/* Documents */}
        <section className="my-20">
          <h2 className="mb-8 text-3xl font-semibold">Documents</h2>

          {/* Images gallery */}
          {/* <div className=" gap-4 overflow-auto"> */}

          <ScrollArea className="whitespace-nowrap">
            <div className="flex-center-start w-full gap-x-5 pb-5">
              {profile?.documents?.map((img, idx) => (
                <Preview
                  key={idx}
                  className="h-[200px] w-max rounded-lg"
                  onClick={() => setDocumentImgPreviewIndex(idx)}
                >
                  <Image
                    src={img?.url}
                    alt="Document"
                    height={1200}
                    width={1200}
                    className="h-full w-max rounded-lg"
                  />
                </Preview>
              ))}
            </div>

            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          <ImagePreviewer
            imageUrls={profile?.documents?.map((img) => img.url)}
            previewImgIndex={documentImgPreviewIndex}
            setPreviewImgIndex={setDocumentImgPreviewIndex}
          />
        </section>

        {/* Reviews */}
        {profile?.reviews?.length > 0 && (
          <section>
            <h2 className="mb-8 text-3xl font-semibold">Reviews</h2>

            {profile?.reviews?.length > 0 ? (
              <div className="space-y-6">
                {profile?.reviews?.map((review, idx) => (
                  <div key={idx} className="flex-start-start gap-x-4">
                    <Avatar className="size-14">
                      <AvatarImage src={review.user?.profile} />
                      <AvatarFallback className="font-medium">
                        {transformNameInitials(review.user?.name)}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <div className="flex-center-start gap-x-5">
                        <h5 className="text-lg font-medium">
                          {review.user?.name}
                        </h5>

                        <div className="flex-center-start gap-x-4">
                          <CustomStarRating rating={review.rating} />

                          <p className="mt-1 font-medium text-gray-500">
                            {review.rating}
                          </p>
                        </div>
                      </div>

                      <p className="mt-2 font-dm-sans">{review.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyContainer className="!my-0" />
            )}
          </section>
        )}
      </ResponsiveContainer>
    </div>
  );
}
