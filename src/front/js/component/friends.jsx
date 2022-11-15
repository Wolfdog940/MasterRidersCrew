import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/friends.css";
import { FriendsFinder } from "./friendsFinder.jsx";

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
    <div className="find ">
      <div className="searchbox mt-2 d-flex justify-content-evenly ">
        {" "}
        <button
          className="button me-2 ms-2  rounded-pill bg-transparent  text-center"
          onClick={() => actions.getFriend(name)}
        >
          <input
            id="name"
            className="input-search me-2 ms-2 w-50 rounded-pill bg-transparent  text-center  "
            placeholder="Buscar amigos"
            onChange={handleInputChange}
            autoComplete="off"
          />
          {console.log(store.findFriends)}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-search  icono"
            viewBox="0 0 16 16"
            color="gray"
          >
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
          </svg>
        </button>
      </div>
      <div className="d-flex flex-column">
        {store.findFriends.map((item, i) => (
          <FriendsFinder key={i} item={item} index={i} />
        ))}
      </div>
    </div>
  );
};
