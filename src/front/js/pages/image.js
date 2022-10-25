import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/image.css";

const Image = () => {
  const { store, actions } = useContext(Context);
  const [imagen64, setImagen64] = useState(null);

  const convertirBase64 = (files) => {
    Array.from(files).forEach((file) => {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        let base64 = reader.result;
        setImagen64({ ...imagen64, image: base64 });

        //console.log(base64);
      };
    });
  };

  const guardarImagen = () => {
    if (imagen64) actions.uploadImage(imagen64);
    else console.log("No hay ninguna foto que guardar!");
  };

  return (
    <div className="window">
      <input type="file" onChange={(e) => convertirBase64(e.target.files)} />
      <button className="btn btn-primary" onClick={guardarImagen}>
        Guardar
      </button>
      { imagen64 ? <img src={imagen64.image} id="previa" width="400px" height="400px"></img> : null}
    </div>
  );
};

export default Image;