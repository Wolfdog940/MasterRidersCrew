import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/myFriends.css";
import { ShowFriends } from "./showFriens.jsx";

export const MyFriends = () => {
  const { store, actions } = useContext(Context);
  const [favorite, setFavorite] = useState(null);

  const asyncEff = async () => setFavorite(await actions.getFriends());
  const asyncEff2 = async () => setList(await store.friends);
  useEffect(() => {
    asyncEff();
  }, []);

  return (
    <div className="friends text-center mt-2">
      <div className="accordion " id="accordionExample">
        <div className="accordion-item bg-transparent">
          <h2 className="accordion-header" id="headingOne">
            <button
              className="accordion-button bg-transparent text-white btn btn-light"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseOne"
              aria-expanded="true"
              aria-controls="collapseOne"
            >
              <h3>Favoritos</h3>
            </button>
          </h2>
          <div
            id="collapseOne"
            className="accordion-collapse collapse show"
            aria-labelledby="headingOne"
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body finder">
              {favorite?.map((item, i) => (
                <ShowFriends item={item} key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
