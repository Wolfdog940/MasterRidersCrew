import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/userSearch.css";

export const ShowFriends = (props) => {
  const { item, index } = props;
  const { store, actions } = useContext(Context);

  return (
    <div className="finderCard d-flex flex-row aling-items-center ms-2 mt-2 mb-2">
      <div className="me-2 mt-1">
        <img className="search_picture" src={item.profilePicture} />
      </div>
      {console.log(item)}
      <div className="me-1 mt-1 text-secondary">{item.friend_name}</div>
      <div className=" me-2 mt-1 text-secondary">{item.friend_last_name}</div>
      <div className=" me-2 mt-1 text-secondary">{item.friend_address}</div>
    </div>
  );
};
