import React, { useContext } from "react";
import { Context } from "../store/appContext";

export const NewsCard = ({ item }) => {
  const { store, actions } = useContext(Context);

  return (
    <div className="card col-4 bg-white p-3 m-2 ">
      <img className="news-img" src={item.image_url} />

      <div className="card-body">
        <div className="card-text ">
          <a href={item.link} target="_blank">
            <h4 className="text-dark link-title">{item.title}</h4>
          </a>
          <div className="text-dark">{item.description} </div>
          <div className="text-danger mt-5 mb-1">{item.source_id}</div>
        </div>
      </div>
    </div>
  );
};
