import React, { useState, useContext } from "react";

import { Context } from "../store/appContext";
import { useNavigate, Link } from "react-router-dom";
import "../../styles/home.css";

const Login = () => {
  const [datos, setDatos] = useState({});
  const { store, actions } = useContext(Context);
  const nav = useNavigate();

  function handleInputChange(e) {
    setDatos({ ...datos, [e.target.type]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    actions.loguearUsuario(datos);
    /*setTimeout(()=>{
        if (store.token !== null){
            console.log("se logueo correctamente")
            //nav('/products');
        }
        else console.log("Algo salio mal al loguear")
        },500)*/
  }

  return (
    <section className="d-flex justify-content-center align-items-center">
      <form
        onSubmit={handleSubmit}
        className="d-flex flex-column align-items-center"
      >
        <h3 className="text-white my-3">Login</h3>
        <div className="form-group w-75 my-2">
          <input
            onChange={handleInputChange}
            type="email"
            className="form-control rounded-pill bg-transparent my-2 text-center text-white"
            placeholder="email"
            required=""
          />
        </div>
        <div className="form-group w-75 mb-2">
          <input
            onChange={handleInputChange}
            type="password"
            className="form-control rounded-pill bg-transparent my-2 text-center text-white"
            placeholder="Password"
            required=""
          />
        </div>
        <div className="form-group w-25 my-2">
          <button
            type="submit"
            className="form-control btn btn-light submit rounded-pill bg-transparent text-white"
          >
            Entrar
          </button>
        </div>
        <div className="form-group d-flex justify-content-center">
          <div className="mt-3">
            <Link to="/" className="text-white link">
              Todavia no estas registrado?
            </Link>
          </div>
        </div>
      </form>
    </section>
  );
};

export default Login;
