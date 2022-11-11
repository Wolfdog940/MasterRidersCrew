import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../../store/appContext";

export const ShowPost = () => {
  const { store, actions } = useContext(Context);
  const [form, setForm] = useState();
  const [page, setPage] = useState(1);
  const [imageToStore, setImageToStore] = useState();
  const formToEdit = useRef();
  const maxPage = 5;
  let navigate = useNavigate();
  const maxPageControl = Math.ceil(store.amountAllPosts / maxPage);
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
    }
    getAllPosts(page, maxPage);
  }, []);

  useEffect(() => {
    let prevButton = document.querySelector("#prevButtonPost");
    let nextButton = document.querySelector("#nextButtonPost");
    if (page === 1) {
      prevButton.disabled = true;
    } else if (page >= maxPageControl) {
      nextButton.disabled = true;
      prevButton.disabled = false;
    }
  }, [page]);

  const getAllPosts = async (page, maxPage) => {
    await actions.getPosts(page, maxPage);
  };

  const prevImages = async () => {
    let nextButton = document.querySelector("#nextButtonPost");
    await actions.getPosts(page - 1, maxPage);
    await actions.updateMaxPosts();
    setPage(page - 1);
    nextButton.disabled = false;
  };

  const nextImages = async () => {
    if (page < maxPageControl) {
      await actions.getPosts(page + 1, maxPage);
      setPage((page) => page + 1);
      let prevButton = document.querySelector("#prevButton");
      prevButton.disabled = false;
    } else {
      let nextButton = document.querySelector("#nextButton");
      nextButton.disabled = false;
    }
  };

  const handleUpdate = async () => {
    const postId = formToEdit.current.id;
    const postToUpdate = {
      text: form.textarea,
      image: form.image,
      id: postId,
    };
    await actions.updatePost(postToUpdate);
    await getAllPosts(page, maxPage);
  };

  const getEditForm = async (post) => {
    formToEdit.current = post;
    const textarea = document.getElementById("exampleFormControlTextareaEdit1");
    textarea.value = formToEdit.current.text;
  };

  const handleDelete = async (post_id) => {
    const postToDelete = {
      id: post_id,
    };
    await actions.deletePost(postToDelete);
    await getAllPosts(page, maxPage);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //subo la imagen a la tabla Image
    let id = null;
    id = await actions.uploadImage(imageToStore);
    let postToCreate = null;
    postToCreate = {
      text: document.getElementById("exampleFormControlTextarea1").value,
      image: id,
    };
    await actions.createPost(postToCreate);
    await getAllPosts(page, maxPage);
    document.getElementById("exampleFormControlTextarea1").value = null;
    document.getElementById("inputGroupFile01Edit").value = null;
    setImageToStore(null);
    form.textarea = null;
  };

  const handleImage = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file[0]);
    reader.onload = function () {
      const base64 = reader.result;
      setImageToStore(base64);
      setForm({ ...form, image: base64 });
    };
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.type]: e.target.value });
  };
  let language = `${navigator.language}-${navigator.language.toUpperCase()}`;
  return (
    <div className="post-container ">
      <div className="createPostContainer">
        <div className="profile-image-container">
          <div className="image">
            <img className="img-profile" src={store.profilePicture} />
          </div>
        </div>
        <div className="new-post-input">
          <div
            data-bs-toggle="modal"
            data-bs-target="#staticBackdrop"
            className="input-button text-secondary"
          >
            En que estas pensando ?
          </div>
        </div>
      </div>
      <div className="posts">
        {/* creacion de post */}
        <div
          className="modal fade"
          id="staticBackdrop"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabIndex="-1"
          aria-labelledby="staticBackdropLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="staticBackdropLabel">
                  {" "}
                  Crear nuevo post{" "}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <div className="form-group">
                    <label>Texto</label>
                    <textarea
                      className="form-control"
                      id="exampleFormControlTextarea1"
                      rows="3"
                    ></textarea>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label"> Imagen </label>
                  <div className="custom-file">
                    <input
                      onChange={(e) => handleImage(e.target.files)}
                      type="file"
                      className="custom-file-input inputFile"
                      id="inputGroupFile01Edit"
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    onClick={handleSubmit}
                    type="button"
                    className="btn btn-primary rounded-pill"
                    data-bs-dismiss="modal"
                  >
                    {" "}
                    Publicar{" "}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Editar post */}
        <div
          className="modal fade"
          id="staticBackdropEdit"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabIndex="-1"
          aria-labelledby="staticBackdropLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="staticBackdropLabel">
                  {" "}
                  Editar post{" "}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <div className="form-group">
                    <label>Texto</label>
                    <textarea
                      onChange={handleInputChange}
                      className="form-control"
                      id="exampleFormControlTextareaEdit1"
                      rows="3"
                    ></textarea>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label"> Imagen </label>
                  <div className="custom-file">
                    <input
                      onChange={(e) => handleImage(e.target.files)}
                      type="file"
                      className="custom-file-input"
                      id="inputGroupFile01"
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    onClick={handleUpdate}
                    type="button"
                    className="btn btn-primary rounded-pill"
                    data-bs-dismiss="modal"
                  >
                    {" "}
                    Publicar{" "}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* listar todos los posts */}
        <ul>
          {store.allPosts <= 0 ? (
            <p className="noPostAvailable">No hay post disponibles</p>
          ) : (
            store.allPosts.map((post, key) => {
              try {
                const date = new Date(post.date);
                const dateTransformation = new Intl.DateTimeFormat(language, {
                  dateStyle: "full",
                  timeStyle: "medium",
                }).format(date);
                post.date = dateTransformation;
              } catch {}
              return (
                <div key={key} className="post d-flex flex-column">
                  <div className="postText">
                    <h2 className="w-100">{post.text}</h2>
                    <div className="relative mb-5">
                      {Number(localStorage.getItem("user_id")) !==
                      post.user_id ? null : (
                        <div
                          className="postEdit"
                          onClick={() => getEditForm(post)}
                          data-bs-toggle="modal"
                          data-bs-target="#staticBackdropEdit"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-pencil-square svgPencilPost text-success"
                            viewBox="0 0 16 16"
                          >
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                            <path
                              fillRule="evenodd"
                              d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                            />
                          </svg>
                        </div>
                      )}
                      {Number(localStorage.getItem("user_id")) !==
                      post.user_id ? null : (
                        <div
                          className="postDelete"
                          onClick={() => handleDelete(post.id)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-trash svgTrashPost text-danger"
                            viewBox="0 0 16 16"
                          >
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                            <path
                              fillRule="evenodd"
                              d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                  {post.image ? (
                    <img
                      className="postImage mx-auto"
                      src={post.image}
                      alt="Post image"
                    />
                  ) : null}
                  <p className="postDate text-secondary text-end">
                    {post.date}
                  </p>
                </div>
              );
            })
          )}
        </ul>
      </div>
      <div className="pagination-container">
        <button
          className="btn btn-primary border-white my-2"
          id="prevButtonPost"
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
        <div className="page-container">{page}</div>
        <button
          className="btn btn-primary border-white my-2"
          id="nextButtonPost"
          onClick={nextImages}
        >
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
