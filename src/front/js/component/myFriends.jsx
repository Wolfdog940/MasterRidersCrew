import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/myFriends.css";

export const MyFriends = () => {
  const { store, actions } = useContext(Context);
  const [friend, setFriends] = useState();

  useEffect(() => {
    setFriends(store.friends);
    console.log(store.friends);
  }, []);

  return (
    <div className="friends text-center mt-2">
      <span className="text-secondary fs-4">Amigos</span>
    </div>
  );
};
