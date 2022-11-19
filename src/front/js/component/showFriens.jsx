import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/userSearch.css";
import { Link } from "react-router-dom";

export const ShowFriends = (props) => {
  const { item } = props;
  const { store, actions } = useContext(Context);
console.log(item)
  return (
    <div className="finderCard d-flex flex-row aling-items-center ms-2 mt-2 mb-2">
      <div className="me-2 mt-1">
        <img className="search_picture" src={item.profilePicture} />
      </div>
      <div className="me-1 mt-1 text-secondary">{item.friend_name}</div>
      <div className=" me-2 mt-1 text-secondary">{item.friend_last_name}</div>
      <Link to={"/userFavorite/" + item.secondary_friend_id}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="25"
          fill="currentColor"
          className="bi bi-box-arrow-in-right"
          viewBox="0 0 17 15"
        >
          <path
            fillRule="evenodd"
            d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0v-2z"
          />
          <path
            fillRule="evenodd"
            d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"
          />
        </svg>
      </Link>
      <div className=" me-2 mt-1 text-secondary">{item.friend_address}</div>
    </div>
  );
};
