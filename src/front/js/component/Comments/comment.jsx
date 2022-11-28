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
    <div className="d-flex flex-row p-3">
      {" "}
      <img
        src={comment.profile_picture}
        width="40"
        height="40"
        className="rounded-circle me-3"
      />
      <div className="w-100">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex flex-row align-items-center">
            {" "}
            <span className="mr-2">{comment.user_name}</span>{" "}
          </div>{" "}
          <small>{comment.creation_date}</small>
        </div>
        <p className="text-justify mb-0">{comment.comment}</p>
      </div>
    </div>
  );
};
