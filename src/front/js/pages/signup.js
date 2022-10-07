import React from "react";
import { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";

const signUp = () => {
  const { store, actions } = useContext(Context);
  const [valores, setValores] = useState({});
  const nav = useNavigate();

  const handleInputChange = (event) => {
    setValores({
      ...valores,
      [event.target.type]: event.target.value,
    });
  };

  function handleSubmit(e) {
    e.preventDefault();

    actions.signup(valores);

    //agregar condicion para link login
    nav("/");
  }

  return (
    <section className="d-flex justify-content-center align-items-center">
      <form
        onSubmit={handleSubmit}
        className="d-flex flex-column align-items-center"
      >
        <h3 className="text-white my-3">Sign Up</h3>
        <div className="form-group d-flex justify-content-center">
          <input
            onChange={handleInputChange}
            type="email"
            className="form-control rounded-pill bg-transparent my-2 text-center text-white"
            placeholder="email"
            required=""
          />
        </div>
        <div className="form-group d-flex justify-content-center">
          <input
            onChange={handleInputChange}
            type="password"
            className="form-control rounded-pill bg-transparent my-2 text-center text-white"
            placeholder="Password"
            required=""
          />
        </div>

        <div className="form-group w-50 my-2">
          <button
            type="submit"
            className="form-control btn btn-light submit rounded-pill bg-transparent text-white w-100"
          >
            Registrate
          </button>
        </div>
        <div className="form-group d-flex justify-content-center">
          <div className="mt-3">
            <Link to="/" className="text-white">
              Ya estas registrado?
            </Link>
          </div>
        </div>
      </form>
    </section>
  );
};
export default signUp;
