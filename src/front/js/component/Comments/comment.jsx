import React, { useEffect, useState } from "react";

export const Comment = (props) => {
  const [comment, setComment] = useState([]);
  useEffect(() => {
    setComment(props.item);
  }, [, props.item]);
  try {
    let language = `${navigator.language}-${navigator.language.toUpperCase()}`;
    let date = new Date(comment.creation_date);
    let dateTransformation = new Intl.DateTimeFormat(language, {
      dateStyle: "full",
      timeStyle: "medium",
    }).format(date);
    comment.creation_date = dateTransformation;
  } catch {}
  return (
    <div class="d-flex flex-row p-3">
      {" "}
      <img
        src={comment.profile_picture}
        width="40"
        height="40"
        class="rounded-circle mr-3"
      />
      <div class="w-100">
        <div class="d-flex justify-content-between align-items-center">
          <div class="d-flex flex-row align-items-center">
            {" "}
            <span class="mr-2">{comment.user_name}</span>{" "}
          </div>{" "}
          <small>{comment.creation_date}</small>
        </div>
        <p class="text-justify mb-0">{comment.comment}</p>
      </div>
    </div>
  );
};
