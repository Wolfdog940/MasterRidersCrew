import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import "../../styles/newsCard.css";

export const NewsCard = ({ item }) => {
  const { store, actions } = useContext(Context);

  return (
    <div className="card col-4 bg-white p-3 m-2  myCard">
      <img className="news-img" src={item.image_url} />

      <div className="card-body">
        <div className="card-text ">
          <a id="link" href={item.link} target="_blank">
            <h4 className="text-dark link-title">{item.title}</h4>
          </a>
          {item.description.length < 400 ? (
            <div className="text-secondary" id="limitado">
              {item.description}{" "}
            </div>
          ) : (
            <div className="text-secondary" id="limitado">
              {item.description.slice(0, 300) + "  ......"}{" "}
            </div>
          )}

          <div className="bottom d-flex justify-content-between">
            <div className="text-danger mt-5 ">{item.source_id}</div>

            <div className="share mt-5">
              <button type="button " className="btn btn-light">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-send"
                  viewBox="0 0 16 16"
                >
                  <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
