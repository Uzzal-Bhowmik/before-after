import React, { useState } from "react";
import CommentInput from "./CommentInput";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/features/authSlice";
import { useGetProfileQuery } from "@/redux/api/userApi";
import { useGetCommentForPostQuery } from "@/redux/api/commentApi";
import CommentComponent from "./CommentComponent";

export default function CommentSection({ postId }) {
  const localUser = useSelector(selectUser);
  const userId = useSelector(selectUser)?.userId;

  // Get profile
  const { data: profile, isLoading: isProfileLoading } = useGetProfileQuery(
    {},
    { skip: !userId },
  );

  // Get all comments
  const { data: commentsRes, isLoading: isCommentsLoading } =
    useGetCommentForPostQuery(
      { postId, params: { isReply: false } },
      { skip: !postId },
    );

  const comments = commentsRes?.data || [];

  const toggleComments = () => {
    setIsExpanded(!isExpanded);
  };

  if (isCommentsLoading || isProfileLoading) return;
  return (
    <div className="space-y-8">
      <CommentInput userId={userId} profile={profile} postId={postId} />

      <div className="space-y-6">
        {comments?.map((cmnt) => (
          <CommentComponent
            key={cmnt._id}
            comment={cmnt}
            localUser={localUser}
            profile={profile}
            postId={postId}
          />
        ))}
      </div>
    </div>
  );
}
