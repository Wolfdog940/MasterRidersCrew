import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";
import { Navbar } from "../navbar";
import "../../../styles/image.css";
import { useNavigate } from "react-router-dom";

const Images = () => {
  const { store, actions } = useContext(Context);
  const [page, setPage] = useState(1);
  const [bool, setBool] = useState(false);
  const maxPage = Math.ceil(store.amountUserImage / store.topImagePerPage);
  let navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
    }
    actions.getImages(page);
  }, [, bool]);

  useEffect(() => {
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
      <h2 className="text-center text-white m-auto mt-2">Tus Imagenes</h2>
      <div className="imageContainer">
        {store.userImages.map((image, index) => {
          return (
            <div key={image.id} className="myCardImage overflow-hidden">
              <img
                className="myImage"
                src={image.image}
                onClick={() => {
                  actions.updateProfile({ profile_picture: image.id });
                  actions.getProfilePicture(image.id);
                }}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="bi bi-trash myTrashImage myPositionImageTrash text-danger"
                onClick={async () => {
                  await actions.deleteImage(image.id);
                  if (image.id === store.userData.profile_picture) {
                    actions.setProfilePicture();
                  }
                  setBool((prev) => !prev);
                }}
                viewBox="0 0 16 16"
              >
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                <path
                  fillRule="evenodd"
                  d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                />
              </svg>
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
