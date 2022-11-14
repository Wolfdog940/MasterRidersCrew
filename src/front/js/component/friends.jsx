import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/friends.css";
export const Friends = () => {
  const { store, actions } = useContext(Context);
  const [name, setName] = useState();

  const handleInputChange = (event) => {
    setName({
      ...name,
      [event.target.id]: event.target.value.trim(),
    });
    console.log(name);
  };

  return (
    <div className="find">
      <input id="name" onChange={handleInputChange} />
      <button onClick={() => actions.getFriend(name)}>x</button>
    </div>
  );
};
