import React from "react";
import { useState, useContext } from "react";
import { Context } from "../store/appContext";

export const CreateGroup = () => {
  const { store, actions } = useContext(Context);

  const [valores, setValores] = useState({ private: false });
  const [privacy, setPrivacy] = useState(false);

  const setBoolean = () => {
    setValores({ ...valores, private: !privacy });
    setPrivacy(!privacy);
  };

  const handleInputChange = (event) => {
    setValores({
      ...valores,
      [event.target.name]: event.target.value,
    });
  };

  function handleSubmit(e) {
    e.preventDefault();
    actions.createGroup(valores);
  }

  return (
    <section className="d-flex justify-content-center align-items-center">
      <form
        className="d-flex flex-column align-items-center"
        onSubmit={handleSubmit}
      >
        <h3 className="text-white my-3">Crear grupo</h3>

        <div className="form-group d-flex justify-content-center">
          <input
            onChange={handleInputChange}
            name="name"
            className="form-control rounded-pill bg-transparent my-2 text-center text-white"
            placeholder="Nombre del grupo "
            id="nombre"
            required=""
          />
        </div>

        <div className="mb-3 form-check">
          <input
            type="checkbox"
            name="private"
            className="form-check-input"
            id="exampleCheck1"
            onClick={() => setBoolean()}
          />
          <label
            className="form-check-label text-white"
            htmlFor="exampleCheck1"
            id="cheack"
          >
            privado
          </label>
        </div>
        <div></div>

        <div className="form-group w-50 my-2">
          <button
            type="submit"
            className="form-control btn btn-light submit rounded-pill bg-transparent text-white w-100"
          >
            Crear Grupo
          </button>
        </div>
        <div className="form-group d-flex justify-content-center">
          <div className="mt-3"></div>
        </div>
      </form>
    </section>
  );
};
