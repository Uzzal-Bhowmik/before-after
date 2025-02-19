"use client";
import FormWrapper from "@/components/form-components/FormWrapper";
import UInput from "@/components/form-components/UInput";
import UPhoneInput from "@/components/form-components/UPhoneInput";
import UTextarea from "@/components/form-components/UTextarea";
import ResponsiveContainer from "@/components/ResponsiveContainer/ResponsiveContainer";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { Trash } from "lucide-react";
import { removeFromSessionStorage } from "@/utils/sessionStorage";
import { Edit } from "lucide-react";
import { useGetProfileQuery } from "@/redux/api/userApi";
import BeatLoader from "@/components/loaders/BeatLoader";
import CustomAvatar from "@/components/CustomAvatar/CustomAvatar";
import { Eye } from "lucide-react";
import CustomLoader from "@/components/CustomLoader/CustomLoader";
import {
  useGetActivityByIdQuery,
  useGetAllActivitiesQuery,
  useGetMyActivitiesQuery,
  useGetSingleServiceProviderQuery,
  useGetSubscriptionBySellerIdQuery,
} from "@/redux/api/serviceProviderApi";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/features/authSlice";
import EmptyContainer from "@/components/EmptyContainer/EmptyContainer";
import SellerActivityCard from "../../[id]/_components/SellerActivityCard";
import placeholderImg from "/public/images/placeholder-img.svg";
import { useRouter } from "next/navigation";
import { LucideMapPin } from "lucide-react";
import { PhoneCall } from "lucide-react";
import CustomStarRating from "@/components/CustomStarRating/CustomStarRating";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import AnimatedArrow from "@/components/AnimatedArrow/AnimatedArrow";
import Preview from "@/components/Preview/Preview";
import ImagePreviewer from "@/components/ui/image-previewer";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Mail } from "lucide-react";
import { useGetServiceProviderReviews } from "@/redux/api/reviewApi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { transformNameInitials } from "@/utils/transformNameInitials";
import { formatDistanceToNow } from "date-fns";

export default function ProfileDashboard({ id }) {
  const [documentImgPreviewIndex, setDocumentImgPreviewIndex] = useState(-1);

  /**
   * GET: Get seller profile details
   */
  const { data: profile, isLoading: isProfileLoading } =
    useGetSingleServiceProviderQuery(id, { skip: !id });

  /**
   * GET: Get seller activities
   */
  const { data: sellerActivitiesRes, isLoading: isActivitiesLoading } =
    useGetAllActivitiesQuery({ author: id }, { skip: !id });
  const sellerActivities = sellerActivitiesRes?.data;

  // check if seller is subscribed
  const { data: sellerSubscriptions, isLoading: isSubscriptionLoading } =
    useGetSubscriptionBySellerIdQuery(id, {
      skip: !id,
    });

  return (
    <div>
      {/* Banner */}
      <section
        className={cn(
          "relative h-[70vh] w-full",
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
          className="absolute -top-24 h-48 w-48 border-primary-blue text-2xl font-semibold shadow-lg ring-2 ring-white ring-offset-2 ring-offset-white"
        />

        {/* Placeholder div for absolute profile pic div */}
        <div className="h-32"></div>

        {/* ======================== Personal Info ======================== */}
        <section className="font-dm-sans">
          <h3 className="mb-1 font-general-sans text-4xl font-semibold">
            {profile?.name}
          </h3>
          <p className="text-lg font-medium text-gray-600">
            {profile?.serviceType || <span>N/A</span>}
          </p>

          <div className="flex-center-start mt-3 gap-x-7 font-medium text-gray-600">
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

          <div className="mt-4">
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

          {isSubscriptionLoading ? (
            <Skeleton className="mt-8 h-14 w-[250px] rounded-lg" />
          ) : (
            <Button
              variant="primary-blue"
              size="custom"
              className="group mt-8"
              asChild
            >
              <Link href={`/messages?user=${id}`}>
                Book Appointment <AnimatedArrow />
              </Link>
            </Button>
          )}
        </section>

        {/* ======================== Services > Subcategories ============================ */}
        <section className="my-16">
          <h2 className="mb-8 text-3xl font-semibold">Services Offered</h2>
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
                      <CheckCircle2 className="absolute right-4 top-4 text-green-400" />

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
          <div className="flex-center-between mb-8">
            <h2 className="text-3xl font-semibold">Activities</h2>
          </div>

          {isActivitiesLoading ? (
            <div className="flex-center my-16">
              <CustomLoader color="var(--primary-blue)" size={35} />
            </div>
          ) : sellerActivities?.length === 0 ? (
            <EmptyContainer />
          ) : (
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {sellerActivities?.map((activity) => (
                <SellerActivityCard key={activity?._id} data={activity} />
              ))}
            </div>
          )}
        </section>

        {/* Documents */}
        <section className="my-20">
          <h2 className="mb-8 text-3xl font-semibold">Documents</h2>

          {/* Images gallery */}
          {profile?.documents?.length === 0 ? (
            <EmptyContainer />
          ) : (
            <div className="flex-center-start flex-wrap gap-4">
              {profile?.documents?.map((img, idx) => (
                <Preview
                  key={idx}
                  className="max-w-1/4 h-[250px] w-auto rounded-lg"
                  onClick={() => setDocumentImgPreviewIndex(idx)}
                >
                  <Image
                    src={img?.url}
                    alt="Document"
                    height={1200}
                    width={1200}
                    className="h-full w-full rounded-lg"
                  />
                </Preview>
              ))}

              <ImagePreviewer
                imageUrls={profile?.documents?.map((img) => img.url)}
                previewImgIndex={documentImgPreviewIndex}
                setPreviewImgIndex={setDocumentImgPreviewIndex}
              />
            </div>
          )}
        </section>

        {/* Reviews */}
        <section>
          <h2 className="mb-8 text-3xl font-semibold">Reviews</h2>

          {profile?.reviews?.length > 0 ? (
            <div className="space-y-6">
              {profile?.reviews?.map((review, idx) => (
                <div key={idx} className="flex-start-start gap-x-4">
                  <Avatar className="size-14">
                    <AvatarImage src={review.user?.profile} />
                    <AvatarFallback>
                      {transformNameInitials(review.user?.name)}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <h5 className="text-lg font-medium">
                      {review?.user?.name}
                    </h5>

                    <div className="flex-center-start mb-3 gap-x-4">
                      <CustomStarRating rating={review.rating} />

                      <p className="mt-1 font-medium text-gray-500">
                        {review.rating}
                      </p>
                    </div>

                    <p className="font-dm-sans">{review.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyContainer message="No reviews yet" className="!my-0" />
          )}
        </section>
      </ResponsiveContainer>
    </div>
  );
}
