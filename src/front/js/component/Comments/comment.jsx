import React from "react";

export const Comment = (props) => {
  try {
    let language = `${navigator.language}-${navigator.language.toUpperCase()}`;
    let date = new Date(props.item.creation_date);
    let dateTransformation = new Intl.DateTimeFormat(language, {
      dateStyle: "full",
      timeStyle: "medium",
    }).format(date);
    props.item.creation_date = dateTransformation;
  } catch {}
  return (
    <div class="d-flex flex-row p-3">
      {" "}
      <img
        src={props.item.profile_picture}
        width="40"
        height="40"
        class="rounded-circle mr-3"
      />
      <div class="w-100">
        <div class="d-flex justify-content-between align-items-center">
          <div class="d-flex flex-row align-items-center">
            {" "}
            <span class="mr-2">{props.item.user_name}</span>{" "}
          </div>{" "}
          <small>{props.item.creation_date}</small>
        </div>
        <p class="text-justify mb-0">{props.item.comment}</p>
      </div>
    </div>
  );
};
