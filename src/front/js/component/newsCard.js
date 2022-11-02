import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/newsCard.css";

export const NewsCard = ({ item }) => {
  const { store, actions } = useContext(Context);

  const [showmore, setShowmore] = useState(false);

  return (
    <div className="card col-4 bg-white p-3 m-2  myCard">
      <img className="news-img" src={item.image_url} />
      {console.log(item)}
      <div className="card-body">
        <div className="card-text ">
          <a id="link" href={item?.link} target="_blank">
            <h4 className="text-dark link-title">{item?.title}</h4>
          </a>

          {item?.description.length < 400 ? (
            <div className="text-secondary">{item?.description} </div>
          ) : !showmore ? (
            <div className="text-secondary" id="limitado">
              {item?.description.slice(0, 300)}
              <button
                className="border border-1 bg-transparent ms-1"
                onClick={() => setShowmore(!showmore)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-three-dots  border-0"
                  viewBox="0 0 16 16"
                >
                  <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                </svg>
              </button>{" "}
            </div>
          ) : (
            <div className="text-secondary" id="limitado">
              {item?.description}
              <button
                className="border border-1 bg-transparent ms-1"
                onClick={() => setShowmore(!showmore)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-dash "
                  viewBox="0 0 16 16"
                >
                  <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z" />
                </svg>
              </button>{" "}
            </div>
          )}

          <div className="bottom d-flex justify-content-between">
            <div className="text-danger mt-5 ">{item?.source_id}</div>

            <div className="share mt-5"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
