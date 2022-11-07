import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";
import { Navbar } from "../navbar";
import "../../../styles/image.css";

const Images = () => {
  const { store, actions } = useContext(Context);
  const [page, setPage] = useState(1);
  const maxPage = Math.ceil(store.amountUserImage / store.topImagePerPage);

  useEffect(() => {
    actions.getImages(page);
  }, []);

  useEffect(() => {
    console.log(page, "maxPage:", maxPage);
    if (page === 1) {
      let prevButton = document.querySelector("#prevButton");
      prevButton.disabled = true;
    } else if (page >= maxPage) {
      let nextButton = document.querySelector("#nextButton");
      nextButton.disabled = true;
    }
  }, [page]);

  const prevImages = () => {
    actions.getImages(page - 1);
    setPage((page) => page - 1);
    let button = document.querySelector("#prevButton");
    button.disabled = false;
    let nextButton = document.querySelector("#nextButton");
    nextButton.disabled = false;
  };

  const nextImages = async () => {
    if (page < maxPage) {
      actions.getImages(page + 1);
      setPage((page) => page + 1);
      let prevButton = document.querySelector("#prevButton");
      prevButton.disabled = false;
    } else {
      let nextButton = document.querySelector("#nextButton");
      nextButton.disabled = false;
    }
  };

  return (
    <div>
      <Navbar />
      <h1 className="text-center text-white">Tus Imagenes</h1>
      <div className="imageContainer">
        {store.userImages.map((image, index) => {
          return (
            <div key={index} className="myCardImage overflow-hidden">
              <img
                className="myImage"
                src={image.image}
                onClick={() => {
                  actions.updateProfile({ profile_picture: image.id });
                  actions.getProfilePicture(image.id);
                }}
              />
            </div>
          );
        })}
      </div>
      <div className="d-flex justify-content-center my-2">
        <button
          className="btn btn-primary me-2 prevButtonImg"
          id="prevButton"
          onClick={prevImages}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-caret-left-fill"
            viewBox="0 0 16 16"
          >
            <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z" />
          </svg>
        </button>
        <button
          className="btn btn-primary nextButtonImg"
          id="nextButton"
          onClick={nextImages}
        >
          {" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-caret-right-fill"
            viewBox="0 0 16 16"
          >
            <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Images;
