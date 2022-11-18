import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/myFriends.css";
import { ShowFriends } from "./showFriens.jsx";

export const MyFriends = () => {
  const { store, actions } = useContext(Context);
  const [favorite, setFavorite] = useState(null);

  const asyncEff = async () => setFavorite(await actions.getFriends());

  useEffect(() => {
    asyncEff();
  }, []);

  return (
    <div className="friends text-center mt-2">
      <span className="text-secondary fs-4">Favoritos</span>
      <div className="finder ">
        {favorite?.map((item, i) => (
          <ShowFriends item={item} key={i} />
        ))}
      </div>
    </div>
  );
};
