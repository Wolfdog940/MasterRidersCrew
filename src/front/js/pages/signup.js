import React from "react";
import { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";

const signUp = () => {
  const { store, actions } = useContext(Context);
  const [valores, setValores] = useState({});

  const handleInputChange = (event) => {
    setValores({
      ...valores,
      [event.target.type]: event.target.value,
    });
  };

  function handleSubmit(e) {
    e.preventDefault();
    console.log(valores);
    actions.signup(valores);
  }

  return (
    <section>
      <div className="container mt-5 pt-5">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center mb-2"></div>
        </div>
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="login-wrap p-0">
              <h3 className="registro mb-5 text-center pb-2 pt-5 mt-1 ">
                Registro
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <input
                    onChange={handleInputChange}
                    type="email"
                    className="form-control border rounded-pill px-6 bg-transparent mt-2 text-center input"
                    placeholder="email"
                    required=""
                  />
                </div>
                <div className="form-group">
                  <input
                    onChange={handleInputChange}
                    type="password"
                    className="form-control border rounded-pill px-6 bg-transparent mt-2 mb-2 text-center input"
                    placeholder="Password"
                    required=""
                  />
                </div>

                <div className="form-group">
                  <button
                    type="submit"
                    className="form-control btn btn-light submit border rounded-pill px-6"
                  >
                    Registrate
                  </button>
                </div>
                <div className="form-group d-md-flex d-flex justify-content-center">
                  <div className="w-50 text-md-right  mt-2 fs-5 fw-bolder text-center">
                    <Link to="/">
                      <a className="text-white">Ya estas registrado?</a>
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default signUp;
