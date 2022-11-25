import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/friends.css";
import { FriendsFinder } from "./friendsFinder.jsx";
import { Link } from "react-router-dom";

export const Friends = () => {
  const { store, actions } = useContext(Context);
  const [name, setName] = useState();

  const handleInputChange = (event) => {
    setName({
      ...name,
      [event.target.id]: event.target.value.trim(),
    });
  };
  
  return (
    <div className="find  col-1  ">
      <div className="searchbox mt-2 d-flex justify-content-evenly ">
        {" "}
        <button
          className="button   rounded-pill bg-transparent  text-end mb-2"
        >
          <input
            id="name"
            className="input-search me-2 ms-2   bg-transparent   border-end text-center "
            placeholder="Buscar Raiders "
            onChange={handleInputChange}
            autoComplete="off"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-search  icono"
            viewBox="0 0 16 16"
            color="gray"
            onClick={() => {
              actions.getFriend(name);
              let input = document.getElementById("name");
              input.value = "";
            }}
          >
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
          </svg>
        </button>
      </div>

      <div className="finder ">
        {store.findFriends.map((item, i) => (
          <Link key={item.id} to={/publicUserProfile/ + i}>
            <FriendsFinder item={item} />
          </Link>
        ))}
      </div>
    </div>
  );
};
