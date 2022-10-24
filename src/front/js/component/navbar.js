import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import UserHome from "../pages/userHome";
import { Noticias } from "./noticias";

export const Navbar = () => {
  const { store, actions } = useContext(Context);
  const nav = useNavigate();
  const borrar_token = () => {
    actions.borrar_token();
    nav("/");
  };

  return (
    <div className="container nav d-flex justify-content-evenly border-bottom  sticky-top">
      <div className="">
        <h4 className="text-white mt-3 me-5 logo">R|C</h4>
      </div>
      <nav className="navbar navbar-expand-lg  ">
        <div className="container  ">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-list text-white"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
              />
            </svg>
          </button>
          <div className="collapse navbar-collapse " id="navbarNavDropdown">
            <ol className="navbar-nav  ">
              <li className="nav-item">
                <Link className="nav-link text-light" to="/userHome">
                  {" "}
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-light" to="/Noticias">
                  Noticias
                </Link>
              </li>

              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle "
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
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
                </a>
                <ol className="dropdown-menu">
                  <li>
                    <Link className="nav-link text-light" to="/userprofile">
                      <a className="dropdown-item" href="#">
                        perfil
                      </a>
                    </Link>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Another action
                    </a>
                  </li>
                  <li>
                    <button
                      className=" dropdown-item  btn btn-danger"
                      onClick={borrar_token}
                    >
                      logout
                    </button>
                  </li>
                </ol>
              </li>
            </ol>
          </div>
        </div>
      </nav>
    </div>
  );
};
