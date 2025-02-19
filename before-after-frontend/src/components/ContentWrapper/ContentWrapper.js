import { cn } from "@/lib/utils";
import DOMPurify from "dompurify";
import React, { useEffect, useState } from "react";

export default function ContentWrapper({ content, className }) {
  const [sanitizedContent, setSanitizedContent] = useState("");

  useEffect(() => {
    if (content) {
      setSanitizedContent(DOMPurify.sanitize(content));
    }
  }, [content]);

  return (
    <>
      {sanitizedContent ? (
        <div
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          className={cn("content-wrapper", className)}
          style={{ fontFamily: "var(--font-dm-sans) !important" }}
        />
      ) : (
        <></>
      )}
    </>
  );
}
