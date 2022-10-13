import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { useEffect, useState } from "react";

const SideBar = () => {
  const { store, actions } = useContext(Context);

  useEffect(() => {
    actions.getGrupos();
  }, []);

  return (
    <div className="row">
      <div className="sidebar">
        <button
          className="btn btn-light position-absolute top-50"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasScrolling"
          aria-controls="offcanvasScrolling"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-arrow-bar-right bg-warnig"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M6 8a.5.5 0 0 0 .5.5h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L12.293 7.5H6.5A.5.5 0 0 0 6 8zm-2.5 7a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5z"
            />
          </svg>
        </button>

        <div
          className="top-side navbar-collapse   d-flex align-items-start offcanvas offcanvas-start bg-dark w-25"
          data-bs-scroll="true"
          data-bs-backdrop="false"
          tabindex="-1"
          id="offcanvasScrolling"
          aria-labelledby="offcanvasScrollingLabel"
        >
          <div className="offcanvas-header">
            <div className="ml-auto">
              <div className="dropdown">
                <button
                  className="btn btn-outline-dark dropdown-toggle border-none"
                  type="button"
                  id="dropdownMenuButton1"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="fas fa-users bg-transparent border-none"></i>
                </button>
                <ul
                  className="dropdown-menu bg-transparent text-white"
                  aria-labelledby="dropdownMenuButton1"
                >
                  {store.listaGrupos && store.listaGrupos.length > 0
                    ? store.listaGrupos.map((datos, index) => (
                        <li className="" key={index}>
                          {datos}
                        </li>
                      ))
                    : console.log("error")}
                </ul>
              </div>
            </div>
            <button
              type="button"
              className="btn-close  position-absolute top-50 start-100 "
              data-bs-dismiss="offcanvas"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                fill="currentColor"
                className="bi bi-arrow-bar-left bg-warning "
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M12.5 15a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5zM10 8a.5.5 0 0 1-.5.5H3.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L3.707 7.5H9.5a.5.5 0 0 1 .5.5z"
                />
              </svg>
            </button>
          </div>
          <div className="offcanvas-body">
            <p>
              Try scrolling the rest of the page to see this option in action.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
