import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { useEffect, useState } from "react";
import { NewsCard } from "./newsCard";
import { Navbar } from "./navbar";
import { useNavigate } from "react-router-dom";

export const Noticias = () => {
  const { store, actions } = useContext(Context);
  let navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")){
      navigate("/")
    }
    actions.setNews();
  }, []);

  return (
    <div className="container-fluid m-0  ">
      <Navbar />
      <div className="scroll d-flex flex-column align-items-center overflow-auto">
        {store.newsPage
          ? store.newsPage.map((item, i) => <NewsCard key={i} item={item} />)
          : null}
        {store.nextPage ? (
          <button
            className="btn   moreInfo"
            onClick={() => {
              actions.setNews();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              fill="currentColor"
              className="bi bi-arrow-down-circle "
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z"
              />
            </svg>
          </button>
        ) : (
          <div>Ya has leido todas las noticias</div>
        )}
      </div>
    </div>
  );
};
