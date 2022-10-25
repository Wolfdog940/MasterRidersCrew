import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { Navbar } from "./navbar";
import "../../styles/userProfile.css";
import Modal from "./modal.jsx";
import { object } from "prop-types";


export const UserProfile = () => {
  const { store, actions } = useContext(Context);
  const [datos, setDatos] = useState({});
  const [mostrarModal, setMostrarModal] = useState(false);
  const [imagenPerfil, setImagenPerfil] = useState(null);
  const [imagenBase64, setImagenBase64] = useState(null);

  useEffect(() => {
    actions.getProfile();
    setTimeout(()=>{
      if (store.userData.profile_picture)
        actions.getProfilePicture(store.userData.profile_picture).then(image=>setImagenPerfil(image));
    },250)
  }, []);

  useEffect(()=>{
    if (store.userData.profile_picture){
      actions.getProfilePicture(store.userData.profile_picture).then(image=>setImagenPerfil(image));
    }
  }, [store.userData.profile_picture])

  function handleInputChange(e) {
    if (e.target.value.trim().length > 0){
      let button = document.querySelector("#actualizar");
      button.disabled = false;
      setDatos({ ...datos, [e.target.id]: e.target.value.trim() });
    }
    else{
      console.log("Debes agregar un texto valido")
    }
  }

  const isNull = (datos) => {
    let values = null;
    let flag = false;
    if (datos)
      values = Object.values(datos);
      values.forEach((value)=>{
        console.log(value.length)
        if (value.length)
          flag = true;
      })
    return flag;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (isNull(datos)){
      let cambiado = await actions.updateProfile(datos);
      setMostrarModal(cambiado);
      let button = document.querySelector("#actualizar");
      button.disabled = true;
    }
    else{
      console.log("No puedes dejar vacio ningun campo!")
    }
  }

  const convertirBase64 = (files) => {
    Array.from(files).forEach((file) => {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        let base64 = reader.result;
        setImagenBase64(base64);
      };
    });
  };

  const upload = async () => {
    let id = await actions.uploadImage(imagenBase64);
    actions.updateProfile({profile_picture:id})
    console.log(store.userData)
  }

  return (
    <div>
      <Navbar />
      <div className="infoUser d-flex flex-column">
        <div className="backgroundColor"></div>
        <div className="profilePicture d-flex">
          {imagenPerfil ? (
            <img src={imagenPerfil} className="picture"></img>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="200"
              height="194"
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
        </div>
        <div className="userData">
          <form onSubmit={handleSubmit} id="form">
            <div className="mt-3 mb-4 d-flex flex-column">
              <div className="form-group">
                <label htmlFor="name" className="mt-2 mb-1">Nombre:</label>
                <input
                  id="name"
                  placeholder={
                    store?.userData?.name ?? "Todavía no esta definido"
                  }
                  defaultValue={store?.userData?.name || null}
                  onChange={handleInputChange}
                  className="form-control rounded-pill mb-2"
                  required
                ></input>
              </div>
              <div className="form-group">
                <label htmlFor="last_name" className="mt-2 mb-1">Apellido:</label>
                <input
                  id="last_name"
                  placeholder={
                    store?.userData?.last_name ?? "Todavía no esta definido"
                  }
                  defaultValue={store?.userData?.last_name || null}
                  onChange={handleInputChange}
                  className="form-control rounded-pill mb-2"
                  required
                ></input>
              </div>
              <div className="form-group">
                <label htmlFor="address" className="mt-2 mb-1">Dirección:</label>
                <input
                  id="address"
                  placeholder={
                    store?.userData?.address ?? "Todavía no esta definido"
                  }
                  defaultValue={store?.userData?.address || null}
                  onChange={handleInputChange}
                  className="form-control rounded-pill"
                  required
                ></input>
              </div>
            </div>
            {mostrarModal ? (
              <Modal cambiarModo={setMostrarModal} texto="Atención" />
            ) : null}
          </form>
          <div className="d-flex justify-content-evenly">
            <button
              type="submit"
              form="form"
              className="btn btn-primary rounded-pill"
              disabled={true}
              id="actualizar"
            >
              Actualizar Datos
            </button>
            <button
              type="button"
              className="btn btn-primary rounded-pill"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
            >
              Cambiar Foto
            </button>
            <div
              className="modal fade"
              id="exampleModal"
              tabIndex="-1"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5" id="exampleModalLabel">
                      Cambiar foto de perfil
                    </h1>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">
                    <input type="file" onChange={(e) => convertirBase64(e.target.files)}></input>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-primary" onClick={upload}>
                      Subir foto
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
