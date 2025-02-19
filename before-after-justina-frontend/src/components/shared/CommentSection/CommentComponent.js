import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThumbsUp } from "lucide-react";
import { MoreVertical } from "lucide-react";
import React, { useId, useState } from "react";
import CommentInput from "./CommentInput";
import generateRandomHexColor from "@/utils/generateRandomHexColor";
import { formatDistanceToNow } from "date-fns";
import { transformNameInitials } from "@/utils/transformNameInitials";
import ModalWrapper from "@/components/ModalWrapper.js/ModalWrapper";
import {
  useDeleteCommentMutation,
  useEditCommentMutation,
} from "@/redux/api/commentApi";
import { zodResolver } from "@hookform/resolvers/zod";
import FormWrapper from "@/components/form-components/FormWrapper";
import UTextarea from "@/components/form-components/UTextarea";
import { z } from "zod";
import { successToast } from "@/utils/customToast";
import { ErrorModal } from "@/utils/customModal";
import { CaretDown, CaretUp } from "@/utils/svgLibrary";

const commentResolver = z.object({
  comment: z.string({ required_error: "Comment is required" }).min(1, {
    message: "Comment is required",
  }),
});

export default function CommentComponent({
  comment = {},
  isExpanded,
  localUser,
  profile,
  postId,
}) {
  const [isReplying, setIsReplying] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  // State to handle view all replies and
  // the object will keep the id of the comment to view replies of
  // so that not all comments's replies are shown!
  const [viewAllReplies, setViewAllReplies] = useState({});

  // Get comment value to edit and set it as default value for the root comment input
  const [commentToEdit, setCommentToEdit] = useState({});

  // When clicked on reply button store that comment in commentToReply state
  const [commentToReply, setCommentToReply] = useState({});

  const [deleteComment] = useDeleteCommentMutation();
  const handleDeleteComment = async (commentId) => {
    if (!commentId) return;

    try {
      await deleteComment(commentId).unwrap();

      successToast("Comment deleted!!");
    } catch (error) {
      ErrorModal(error?.data?.message || error?.message);
    }
  };

  //

  const handleReply = (content) => {
    setIsReplying(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Avatar>
          <AvatarImage src={comment?.user?.profile} className="border" />
          <AvatarFallback
            style={{
              backgroundColor:
                localUser?.profileBackgroundColor || generateRandomHexColor(),
              color: "white",
              fontWeight: "500",
              fontSize: 14,
            }}
          >
            {transformNameInitials(comment?.user?.name || comment?.user?.email)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium">
                {comment?.user?.name || comment?.user?.email}
              </span>
              <span className="text-xs text-gray-400">
                {comment?.createdAt &&
                  formatDistanceToNow(comment?.createdAt, { addSuffix: true })}
              </span>
            </div>

            {/* Edit / Delete buttons */}
            {comment?.user?._id === localUser?.userId && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-gray-400">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => {
                      setShowUpdateModal(true);
                      setCommentToEdit(comment);
                    }}
                  >
                    Edit
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="text-red-500"
                    onClick={() => handleDeleteComment(comment?._id)}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <p className="mt-2 font-dm-sans">{comment?.comment}</p>

          <div className="mt-2 flex items-center gap-4">
            {/* <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <ThumbsUp className="h-4 w-4 mr-1" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <ThumbsDown className="h-4 w-4 mr-1" />
            </Button> */}

            {!comment?.isReply && (
              <>
                <button
                  className="text-xs font-semibold text-gray-500 hover:text-gray-600"
                  onClick={() => {
                    setIsReplying(!isReplying);

                    setCommentToReply(comment);
                  }}
                >
                  Reply
                </button>

                {comment?.reply?.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full text-xs font-semibold text-gray-500 hover:bg-gray-100"
                    onClick={() => {
                      if (viewAllReplies?._id) {
                        return setViewAllReplies({});
                      }
                      setViewAllReplies(comment);
                    }}
                  >
                    View all replies{" "}
                    {viewAllReplies?._id ? <CaretUp /> : <CaretDown />}
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {isReplying && (
        <div className="ml-12">
          <CommentInput
            isReplying={isReplying}
            setIsReplying={setIsReplying}
            commentToReply={commentToReply}
            setCommentToReply={setCommentToReply}
            onSubmit={handleReply}
            profile={profile}
            userId={localUser?.userId}
            postId={postId}
            placeholder="Add a reply..."
          />
        </div>
      )}

      {comment?.reply &&
        viewAllReplies?._id === comment?._id &&
        comment.reply.map((reply) => (
          <div key={reply.id} className="!my-6 ml-12">
            <CommentComponent
              comment={reply}
              isExpanded={isExpanded}
              localUser={localUser}
              profile={reply?.user}
              postId={reply?.post}
            />
          </div>
        ))}

      <UpdateCommentModal
        defaultValues={commentToEdit}
        open={showUpdateModal}
        setOpen={setShowUpdateModal}
      />
    </div>
  );
}

const UpdateCommentModal = ({ defaultValues, open, setOpen }) => {
  const [updateComment, { isLoading: isUpdatingComment }] =
    useEditCommentMutation();

  const handleSubmit = async (data) => {
    if (!data?.comment) return;

    try {
      await updateComment({
        commentId: defaultValues?._id,
        data: {
          model_type: defaultValues?.model_type,
          post: defaultValues?.post?._id,
          comment: data?.comment?.trim(),
        },
      });

      successToast("Comment updated successfully!!");
      setOpen(false);
      successToast("Comment updated successfully!!");
    } catch (error) {
      ErrorModal(error?.data?.message || error?.message);
    }
  };

  return (
    <ModalWrapper open={open} setOpen={setOpen} title="Update Comment">
      {defaultValues?.comment && (
        <FormWrapper
          onSubmit={handleSubmit}
          resolver={zodResolver(commentResolver)}
          defaultValues={defaultValues}
          className="flex flex-col space-y-2"
        >
          <UTextarea name="comment" className="min-h-[80px] bg-transparent" />

          <Button
            type="submit"
            onClick={handleSubmit}
            variant="primary-blue"
            loading={isUpdatingComment}
          >
            Update
          </Button>
        </FormWrapper>
      )}
    </ModalWrapper>
  );
};
