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
      <div className="searchbox mt-2 ">
        {" "}
        <input
          id="name"
          className="input-search me-2 ms-2 w-50 rounded-pill bg-transparent  text-center "
          placeholder="Buscar amigos"
          onChange={handleInputChange}
        />
        <button onClick={() => actions.getFriend(name)}>
          {console.log(store.findFriends)}
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
