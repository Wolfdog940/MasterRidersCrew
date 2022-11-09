import React, { useContext, useState, useEffect } from "react";
import { Context } from "../../store/appContext";
import { Navbar } from "../navbar";
import AllMyPosts from "../post/allMyPosts.jsx";
import "../../../styles/userProfile.css";
import AllEvents from "../../pages/Events/allEvents.jsx";
import { useNavigate } from "react-router-dom";

const UserProfile2 = () => {
  const { store, actions } = useContext(Context);
  const [datos, setDatos] = useState({});
  const [image, setImage] = useState(null);
  let navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
    }
    actions.getProfile();
  }, [, store.profilePicture]);

  /* Manejo de las imagenes */
  const convertirBase64 = (file) => {
    let reader = new FileReader();
    reader.readAsDataURL(file[0]);
    reader.onload = function () {
      let base64 = reader.result;
      setImage(base64);
    };
  };
  const upload = async () => {
    if (image) {
      let id = await actions.uploadImage(image);
      let bool = await actions.updateProfile({ profile_picture: id });
      if (bool) actions.getProfile();
    } else alert("Debes agregar una foto antes");
  };

  /* Manejo de los inputs */
  function handleInputChange(e) {
    let button = document.querySelector("#update");
    if (e.target.value.trim().length) {
      button.disabled = false;
    } else {
      alert("Debes agregar un texto valido");
      button.disabled = true;
    }
    setDatos({ ...datos, [e.target.id]: e.target.value.trim() });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    actions.updateProfile(datos);
    let button = document.querySelector("#actualizar");
    //button.disabled = true;
    alert("Datos Actualizados");
  }

  return (
    <>
      <Navbar />
      <h2 className="text-white m-auto mt-4 text-center">Mis Datos</h2>
      <div className="userContainer">
        <div className="userBackground"></div>
        <div className="userPhoto">
          {store.profilePicture ? (
            <img src={store.profilePicture} className="picture" />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="150"
              height="150"
              fill="currentColor"
              className="bi bi-person-circle"
              viewBox="0 0 16 16"
            >
              <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
              <path
                fillRule="evenodd"
                d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
              />
            </svg>
          )}
          <button
            type="button"
            className="btn pencilPhoto text-white"
            data-bs-toggle="modal"
            data-bs-target="#staticBackdrop2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-pen svgPencil"
              viewBox="0 0 16 16"
            >
              <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z" />
            </svg>
          </button>
          <div
            className="modal fade"
            id="staticBackdrop2"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabIndex="-1"
            aria-labelledby="staticBackdropLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="staticBackdropLabel">
                    Cambiar Mi Foto
                  </h1>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <input
                    type="file"
                    onChange={(e) => {
                      convertirBase64(e.target.files);
                    }}
                  ></input>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-primary rounded-pill"
                    onClick={upload}
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  >
                    Subir foto
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="userData">
          <div className="userDescription d-flex justify-content-between">
            <div className="ms-4">
              <h3 className="text-secondary">{`${store?.userData?.name} ${store?.userData?.last_name}`}</h3>
              <p className="text-secondary">{store?.userData?.address}</p>
            </div>
            <button
              type="button"
              className="btn btn-primary pencil"
              data-bs-toggle="modal"
              data-bs-target="#staticBackdrop"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-pen svgPencil"
                viewBox="0 0 16 16"
              >
                <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z" />
              </svg>
            </button>
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
                    <h1 className="modal-title fs-5" id="staticBackdropLabel">
                      Editar Mi Perfil
                    </h1>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">
                    <form id="form" onSubmit={handleSubmit}>
                      <div className="formGroup my-2">
                        <label className="text-muted">Nombre:</label>
                        <input
                          id="name"
                          onChange={handleInputChange}
                          className="form-control rounded-pill mb-2"
                        ></input>
                      </div>
                      <div className="formGroup my-2">
                        <label className="text-muted">Apellido:</label>
                        <input
                          id="last_name"
                          onChange={handleInputChange}
                          className="form-control rounded-pill mb-2"
                        ></input>
                      </div>
                      <div className="formGroup my-2">
                        <label className="text-muted">Direccion:</label>
                        <input
                          id="address"
                          onChange={handleInputChange}
                          className="form-control rounded-pill mb-2"
                        ></input>
                      </div>
                    </form>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="submit"
                      form="form"
                      className="btn btn-primary rounded-pill"
                      id="update"
                      disabled={true}
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    >
                      Cambiar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <h2 className="text-white m-auto text-center">Mis Post</h2>
      <AllMyPosts />
      <AllEvents noNavBar={true} noParams={true} />
    </>
  );
};

export default UserProfile2;
