import React, { useContext, useEffect, useRef, useState } from "react";
import { Context } from "../../store/appContext";

export const ShowPost = () => {
  const { store, actions } = useContext(Context);
  const [form, setForm] = useState();

  const formToEdit = useRef();

  useEffect(() => {
    getAllPosts();
  }, [store]);

  const getAllPosts = async () => {
    await actions.getPosts();
  };

  const handleUpdate = async () => {
    const postId = formToEdit.current.id;
    const postToUpdate = {
      text: form.textarea,
      image: form.image,
      id: postId,
    };
    await actions.updatePost(postToUpdate);
    await getAllPosts();
  };

  const getEditForm = async (post) => {
    formToEdit.current = post;
    const textarea = document.getElementById('exampleFormControlTextareaEdit1');
    textarea.value = formToEdit.current.text;
  };

  const handleDelete = async (post_id) => {
    const postToDelete = {
      id: post_id,
    };
    await actions.deletePost(postToDelete);
    await getAllPosts();
  };

  const handleSubmit = async () => {
    const postToCreate = {
      text: form.textarea,
      image: form.image,
    };
    await actions.createPost(postToCreate);
    await getAllPosts();
  };

  const handleImage = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file[0]);
    reader.onload = function () {
      const base64 = reader.result;
      setForm({ ...form, image: base64 });
    };
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.type]: e.target.value });
  };

  return (
    <div className="post-container">
      <div className="createPostContainer">
        <div className="profile-image-container">
          <div className="image">
            <img src={store.profilePicture} />
          </div>
        </div>
        <div className="new-post-input">
          <div
          data-bs-toggle="modal"
          data-bs-target="#staticBackdrop"
          className="input-button">En que estas pensando ?</div>
        </div>
      </div>
      <div className="posts">
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
                      onChange={handleInputChange}
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
                      className="custom-file-input"
                      id="inputGroupFile01Edit"
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSubmit}
                    type="button"
                    className="btn btn-primary"
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
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleUpdate}
                    type="button"
                    className="btn btn-primary"
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

        <ul>
          {store.allPosts.msg ? (
            <p className="noPostAvailable">No hay post disponibles</p>
          ) : (
            store.allPosts.map((post, key) => {
              return (
                <div key={key} className="post">
                  <div className="postText">
                    <h2>{post.text}</h2>

                    {Number(localStorage.getItem("user_id")) !== post.user_id ? null : (
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
                          className="bi bi-pencil-square"
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

                    {Number(localStorage.getItem("user_id")) !== post.user_id ? null : (
                      <div
                        className="postDelete"
                        onClick={() => handleDelete(post.id)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-trash"
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
                  {
                    post.image 
                    ? <img
                    className="postImage"
                    src={post.image}
                    alt="Post image"
                  /> : null 
                  }

                  <p className="postDate">{post.date}</p>
                </div>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
};
