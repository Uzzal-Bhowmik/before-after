import FormWrapper from "@/components/form-components/FormWrapper";
import UTextarea from "@/components/form-components/UTextarea";
import ModalWrapper from "@/components/ModalWrapper.js/ModalWrapper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useCreateCommentMutation } from "@/redux/api/commentApi";
import { ErrorModal } from "@/utils/customModal";
import { successToast } from "@/utils/customToast";
import { transformNameInitials } from "@/utils/transformNameInitials";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import placeholderUserAvatar from "/public/images/navbar/placeholder-user-avatar.png";
import { z } from "zod";
import { useRef } from "react";

const commentResolver = z.object({
  comment: z.string({ required_error: "Comment is required" }).min(1, {
    message: "Comment is required",
  }),
});

export default function CommentInput({
  isReplying,
  setIsReplying,
  commentToReply,
  setCommentToReply,
  userId,
  profile,
  postId,
  placeholder = "Add your comment...",
}) {
  const router = useRouter();
  const currentPath = usePathname();
  const searchParams = useSearchParams().get("type");

  const [addComment, { isLoading: isAddingComment }] =
    useCreateCommentMutation();

  const handleSubmit = async (data) => {
    if (!userId) {
      return router.push(
        `/login?from-href=${currentPath}?type=${searchParams}`,
      );
    }

    if (!data?.comment) return;

    // Add reply to a comment
    if (isReplying && commentToReply?._id) {
      try {
        await addComment({
          model_type:
            searchParams === "seller" ? "Activity" : "TransformationPost",
          post: postId,
          comment: data?.comment?.trim(),
          isReply: true,
          replyRef: commentToReply?._id,
        });

        successToast("Reply added successfully!!");
        setIsReplying(false);
        setCommentToReply({});

        return;
      } catch (error) {
        return ErrorModal(error?.data?.message || error?.message);
      }
    }

    // Add comment to post
    try {
      await addComment({
        model_type:
          searchParams === "seller" ? "Activity" : "TransformationPost",
        post: postId,
        comment: data?.comment?.trim(),
      });

      successToast("Comment added successfully!!");
    } catch (error) {
      ErrorModal(error?.data?.message || error?.message);
    }
  };

  return (
    <div className="flex gap-4">
      <Avatar className="border">
        <AvatarImage src={userId ? profile?.profile : placeholderUserAvatar} />
        <AvatarFallback className="bg-primary-blue text-sm font-medium text-white">
          {transformNameInitials(profile?.name || profile?.email)}
        </AvatarFallback>
      </Avatar>

      <FormWrapper
        onSubmit={handleSubmit}
        resolver={zodResolver(commentResolver)}
        className="flex flex-col space-y-2"
      >
        <UTextarea
          name="comment"
          placeholder={userId ? placeholder : "Login or sign up to comment"}
          className="min-h-[80px] bg-transparent"
          disabled={!userId}
        />

        <div className="flex-center-start gap-x-2">
          {isReplying && (
            <Button
              onClick={() => {
                setIsReplying(false);
                setCommentToReply({});
              }}
              variant="secondary"
            >
              Cancel
            </Button>
          )}

          <Button
            type="submit"
            onClick={handleSubmit}
            variant="primary-blue"
            loading={isAddingComment}
          >
            {!userId
              ? "Login or sign up to comment"
              : isReplying
                ? "Reply"
                : "Comment"}
          </Button>
        </div>
      </FormWrapper>
    </div>
  );
}
