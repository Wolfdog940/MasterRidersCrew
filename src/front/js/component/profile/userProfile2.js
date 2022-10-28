import React, { useContext, useState, useEffect } from "react";
import { Context } from "../../store/appContext";
import { Navbar } from "../navbar";
import "../../../styles/userProfile2.css";

const UserProfile2 = () => {
  const { store, actions } = useContext(Context);
  const [datos, setDatos] = useState({});
  const [image, setImage] = useState(null);

  useEffect(() => {
    actions.getProfile();
  }, [,store.profilePicture]);


  /* Manejo de las imagenes */
  const convertirBase64 = (files) => {
    Array.from(files).forEach((file) => {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        let base64 = reader.result;
        setImage(base64);
      };
    });
  };

  const upload = async () => {
    if (image){
      let id = await actions.uploadImage(image);
      let bool = await actions.updateProfile({ profile_picture: id });
      if (bool)
          actions.getProfile();
    }
    else alert("Debes agregar una foto antes")
  };


  /* Manejo de los inputs */
  function handleInputChange(e) {
    if (e.target.value.trim().length > 0) {
      let button = document.querySelector("#update");
      button.disabled = false;
      setDatos({ ...datos, [e.target.id]: e.target.value.trim() });
    } else {
      console.log("Debes agregar un texto valido");
    }
  }

  /* const isNull = (datos) => {
    let values = null;
    let flag = false;
    if (datos) values = Object.values(datos);
    values.forEach((value) => {
      console.log(value.length);
      if (value.length) flag = true;
    });
    return flag;
  }; */

  async function handleSubmit(e) {
    e.preventDefault();
    /* if (isNull(datos)){ */
    actions.updateProfile(datos);
    let button = document.querySelector("#actualizar");
    button.disabled = true;
    alert("Datos Actualizados");
    /* }
    else{ */
    console.log("No puedes dejar vacio ningun campo!");
    /* } */
  }

  return (
    <>
      <Navbar />
      <div className="userContain">
        <div className="userBackground">
          {/* <div className="editPhoto float-end mt-3">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-camera myCamera text-center"
                    viewBox="0 0 16 16"
                >
                    <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1v6zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2z" />
                    <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z" />
                </svg>
            </div>
            {store.backgroundPicture ? <img src={store.backgroundPicture}/> : null}  Se podria agregar una foto de fondo */}
        </div>
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
              <h3 className="text-white">{`${store?.userData?.name} ${store?.userData?.last_name}`}</h3>
              <p className="text-white">{store?.userData?.address}</p>
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
                          required
                        ></input>
                      </div>
                      <div className="formGroup my-2">
                        <label className="text-muted">Apellido:</label>
                        <input
                          id="last_name"
                          onChange={handleInputChange}
                          className="form-control rounded-pill mb-2"
                          required
                        ></input>
                      </div>
                      <div className="formGroup my-2">
                        <label className="text-muted">Direccion:</label>
                        <input
                          id="address"
                          onChange={handleInputChange}
                          className="form-control rounded-pill mb-2"
                          required
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
    </>
  );
};

export default UserProfile2;
