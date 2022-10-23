import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { Navbar } from "./navbar";
import "../../styles/userProfile.css";
import Modal from "./modal.jsx";

export const UserProfile = () => {
  const { store, actions } = useContext(Context);
  const [datos, setDatos] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);//revisar como agregar el modal

  useEffect(() => {
    actions.getProfile();
    /* setTimeout(()=>{
      actions.getProfilePicture(store.userData.profile_picture).then(image=>setImagen({image:image}));
    },250) */
  }, []);

  function handleInputChange(e) {
    setDatos({ ...datos, [e.target.id]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    actions.updateProfile(datos);
  }

  return (
    <div>
      <Navbar />
      <div className="infoUser d-flex flex-column">
        <div className="backgroundColor"></div>
        <div className="profilePicture d-flex">
          {store.userData ? (
            <img src={store.userData.profile_picture}></img>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-person"
              viewBox="0 0 16 16"
            >
              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
            </svg>
          )}
        </div>
        <div className="userData">
          <h2 className="mt-5 ms-3 d-inline-block">Tu datos:</h2>
          <form
            className="d-flex flex-column"
            onSubmit={handleSubmit}
          >
            <div className="mt-3 mb-4 d-flex flex-column">
              <div className="form-group">
                <label htmlFor="name">Nombre:</label>
                <input
                  id="name"
                  placeholder={
                    store?.userData?.name ?? "Todavía no esta definido"
                  }
                  defaultValue={store?.userData?.name || null}
                  onChange={handleInputChange}
                  className="form-control rounded-pill"
                ></input>
              </div>
              <div className="form-group">
                <label htmlFor="last_name">Apellido:</label>
                <input
                  id="last_name"
                  placeholder={
                    store?.userData?.last_name ?? "Todavía no esta definido"
                  }
                  defaultValue={store?.userData?.last_name || null}
                  onChange={handleInputChange}
                  className="form-control rounded-pill"
                ></input>
              </div>
              <div className="form-group">
                <label htmlFor="address">Dirección:</label>
                <input
                  id="address"
                  placeholder={
                    store?.userData?.address ?? "Todavía no esta definido"
                  }
                  defaultValue={store?.userData?.address || null}
                  onChange={handleInputChange}
                  className="form-control rounded-pill"
                ></input>
              </div>
            </div>
            <div className="form-group d-flex">
              <button
                type="submit"
                className="form-control btn btn-primary submit rounded-pill"
              >
                Actualizar Datos
              </button>
              <button
                className="btn btn-primary rounded-pill"
              >
                Cambiar imagen
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
