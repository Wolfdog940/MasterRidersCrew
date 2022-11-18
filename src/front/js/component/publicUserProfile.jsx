import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { Link, useParams } from "react-router-dom";
import "../../styles/publicUserProfile.css";
import { object } from "prop-types";

export const PublicUserProfile = () => {
  const { store, actions } = useContext(Context);

  const { posicion } = useParams();
  let object = store.findFriends[parseInt(posicion)];

  return (
    <div>
      <div className="text">
        <h2 className="text-white mt-5 pt-5 ">Agrega un Amigo</h2>
      </div>
      <div className="userContainer">
        <div className="userBackground"></div>
        <div className="userPhoto">
          <img src={object?.image} className="picture" />
        </div>
        <div className="userData">
          <div className="userDescription d-flex justify-content-between">
            <div className="ms-4">
              <h3 className="text-secondary">{`${object?.name} ${object?.last_name}`}</h3>
              <p className="text-secondary">{object?.address}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-center">
        <Link to={"/userHome"}>
          <button className="btn btn-danger me-5 ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-backspace"
              viewBox="0 0 16 16"
            >
              <path d="M5.83 5.146a.5.5 0 0 0 0 .708L7.975 8l-2.147 2.146a.5.5 0 0 0 .707.708l2.147-2.147 2.146 2.147a.5.5 0 0 0 .707-.708L9.39 8l2.146-2.146a.5.5 0 0 0-.707-.708L8.683 7.293 6.536 5.146a.5.5 0 0 0-.707 0z" />
              <path d="M13.683 1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-7.08a2 2 0 0 1-1.519-.698L.241 8.65a1 1 0 0 1 0-1.302L5.084 1.7A2 2 0 0 1 6.603 1h7.08zm-7.08 1a1 1 0 0 0-.76.35L1 8l4.844 5.65a1 1 0 0 0 .759.35h7.08a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1h-7.08z" />
            </svg>
          </button>
        </Link>
        <Link to={"/userHome"}>
          <button
            className="btn btn-success"
            onClick={() => {
              actions.postFriend(object.user_id);
            }}
          >
            Agregar
          </button>
        </Link>
      </div>
    </div>
  );
};
