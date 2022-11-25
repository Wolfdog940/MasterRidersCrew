import React from "react";
import "../../styles/userSearch.css";

export const FriendsFinder = (props) => {
  const { item } = props;

  return (
    <div className="finderCard d-flex flex-row aling-items-center ms-2 mt-2 mb-2">
      <div className="me-2 mt-1">
        <img className="search_picture" src={item.image} />
      </div>
      <div className="me-1 mt-1 text-secondary">{item.name}</div>
      <div className=" me-2 mt-1 text-secondary">{item.last_name}</div>
    </div>
  );
};
