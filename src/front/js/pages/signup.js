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
      [event.target.type]: event.target.value,
    });
  };

  function handleSubmit(e) {
    e.preventDefault();
    actions.signup(valores);
    nav("/");
  }

  function validarPwd() {
    let input1 = document.getElementById("password1");
    let input2 = document.getElementById("password2");
    if (input1 != null && input2 != null) {
      if (input1.value == input2.value) setValidado(true);
    }
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
            id="email"
            required=""
            pattern="[a-zA-Z0-9]{0,}([.]?[a-zA-Z0-9]{1,})[@](gmail.com|hotmail.com|yahoo.com)"
            title="Tienes que introducir un direccion de correo valida ej: hola@hotmail.com,hola@gmail.com,hola@yahoo.com "
          />
        </div>
        <div className="form-group d-flex justify-content-center">
          <input
            onChange={handleInputChange}
            type={showpwd ? "text" : "password"}
            className="form-control rounded-pill bg-transparent my-2 text-center text-white"
            placeholder="Password"
            id="password1"
            required=""
            pattern="^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=.\-_*])([a-zA-Z0-9@#$%^&+=*.\-_]){3,}$"
            title="El password tiene que tener un minimo de 6 caracteres , por lo menos una mayuscula , 1 minuscula ,un numero sin espacios y un simbolo."
          />
        </div>
        <div className="form-group d-flex justify-content-center">
          <input
            onChange={handleInputChange}
            type={showpwd ? "text" : "password"}
            className="form-control rounded-pill bg-transparent my-2 text-center text-white"
            placeholder="validar Password"
            id="password2"
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
  );
};
export default signUp;
