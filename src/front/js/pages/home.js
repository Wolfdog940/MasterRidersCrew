
import React, { useContext } from "react";
import { Link } from "react-router-dom";
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
    <section className="container">
      <div className="row justify-content-center">
        <div className="col-8  col-md-6 col-lg-4">
          <h3 className="text-center my-5 py-5">
            Entrar
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                onChange={handleInputChange}
                type="email"
                className="form-control rounded-pill bg-transparent my-2 text-center"
                placeholder="email"
                required=""
              />
            </div>
            <div className="form-group">
              <input
                onChange={handleInputChange}
                type="password"
                className="form-control rounded-pill bg-transparent my-2 text-center"
                placeholder="Password"
                required=""
              />
            </div>
            <div className="form-group">
              <button
                type="submit"
                className="form-control btn btn-light submit rounded-pill"
              >
                Entrar
              </button>
            </div>
            <div className="form-group d-flex justify-content-center">
              <div className="w-50 mt-2 text-center">
                <Link to="/" className="text-secondary">Todavia no estas registrado?</Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
