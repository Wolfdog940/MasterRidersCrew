import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { useEffect, useState } from "react";
import { NewsCard } from "./newsCard";
import { Navbar } from "./navbar";

export const Noticias = () => {
  const { store, actions } = useContext(Context);

  useEffect(() => {
    actions.setNews();
  }, []);

  console.log(store.newsPage);
  return (
    <div className="container-fluid m-0  ">
      <Navbar />
      <div className="scroll d-flex flex-column align-items-center overflow-auto">
        {store.newsPage
          ? store.newsPage.map((item, i) => <NewsCard key={i} item={item} />)
          : null}
        {store.nextPage ? (
          <button
            className="btn btn-primary p-1"
            onClick={() => {
              actions.setNews();
            }}
          >
            Mas noticias
          </button>
        ) : (
          <div>Ya has leido todas las noticias</div>
        )}
      </div>
    </div>
  );
};
