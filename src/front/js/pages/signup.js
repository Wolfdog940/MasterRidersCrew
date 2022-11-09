import React from "react";
import { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";

const signUp = () => {
  const { store, actions } = useContext(Context);
  const [showpwd, setShowpwd] = useState(false);
  const [valores, setValores] = useState({});
  const [validado, setValidado] = useState(false);

  const nav = useNavigate();

  const handleInputChange = (event) => {
    setValores({
      ...valores,
      [event.target.id]: event.target.value,
    });
  };

  function handleSubmit(e) {
    e.preventDefault();

    if (validado) {
      actions.signup(valores);
      nav("/");
    } else {
      document.getElementById("password").value = "";
      document.getElementById("password2").value = "";
    }
  }

  function validarPwd() {
    let input1 = document.getElementById("password").value;
    let input2 = document.getElementById("password2").value;
    if (input1.length > 0 && input2.length > 0) {
      if (input1.value == input2.value) {
        setValidado(true);
      }
    } else {
      setValidado(false);
    }
  }

  return (
    <div className="">
      <div className="d-flex justify-content-center align-items-center mt-2 flex-column">
        <div>
          <h1 className="logo text-white">*Riders|Crew*</h1>
        </div>
        <div className="logo">
          <h2 className="text-white mt-2 mb-0">Bienvenidos</h2>
        </div>
      </div>

      <section className="d-flex justify-content-center align-items-center section-init ">
        <form
          onSubmit={handleSubmit}
          className=" signup_form d-flex flex-column align-items-center border-start border-bottom  border-white"
        >
          <h3 className="text-white my-3 signup">Sign Up</h3>
          <h4 className="text-white border-bottom">Crea una nueva cuenta</h4>
          <div className="form-group d-flex justify-content-center">
            <input
              onChange={handleInputChange}
              type="name"
              className="form-control rounded-pill bg-transparent my-2 text-center text-white mx-2"
              placeholder="nombre"
              id="name"
              required=""
            />
            <input
              onChange={handleInputChange}
              type="last_name"
              className="form-control rounded-pill bg-transparent my-2 text-center text-white"
              placeholder="apellido"
              id="last_name"
              required=""
            />
          </div>
          <div className="form-group d-flex justify-content-center">
            <input
              onChange={handleInputChange}
              type="email"
              className="form-control rounded-pill bg-transparent my-2 text-center text-white mx-2"
              placeholder="email"
              id="email"
              required=""
              pattern="[a-zA-Z0-9]{0,}([.]?[a-zA-Z0-9]{1,})[@](gmail.com|hotmail.com|yahoo.com)"
              title="Tienes que introducir un direccion de correo valida ej: hola@hotmail.com,hola@gmail.com,hola@yahoo.com "
            />
            <input
              onChange={handleInputChange}
              type={showpwd ? "text" : "password"}
              className="form-control rounded-pill bg-transparent my-2 text-center text-white"
              placeholder="Password"
              id="password"
              required=""
              pattern="^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$"
              title="El password tiene que tener un minimo de 6 caracteres , por lo menos una mayuscula , 1 minuscula  y un numero sin espacios ."
            />
          </div>

          <div className="form-group d-flex justify-content-center">
            <input
              id="password2"
              type={showpwd ? "text" : "password"}
              className="form-control rounded-pill bg-transparent my-2 text-center text-white"
              placeholder="validar Password"
              required=""
              pattern={valores.password}
              onBlur={validarPwd}
              title={
                !validado ? "las contraseñas no coinciden" : "password correcto"
              }
            />
          </div>

          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="exampleCheck1"
              onClick={() => setShowpwd(!showpwd)}
            />
            <label
              className="form-check-label text-white"
              htmlFor="exampleCheck1"
              id="cheack"
            >
              Check me out
            </label>
          </div>
          <div>
            <span className="d-none text-warning">
              Checks that a password has a minimum of 6 characters, at least 1
              uppercase letter, 1 lowercase letter, and 1 number with no spaces.
            </span>
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
    </div>
  );
};
export default signUp;
