import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { useEffect } from "react";

const SideBar = () => {
  const { store, actions } = useContext(Context);

  useEffect(() => {
    actions.getGrupos();
    actions.createPost();
    // actions.getPosts();
    // actions.getPostByUser();
    console.log(store);
  }, []);

  return (
    <div className="sidebar ">
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
          class="bi bi-arrow-bar-right"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M6 8a.5.5 0 0 0 .5.5h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L12.293 7.5H6.5A.5.5 0 0 0 6 8zm-2.5 7a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5z"
          />
        </svg>
      </button>

      <div
        className="offcanvas offcanvas-start bg-dark"
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
                className="btn btn-secondary dropdown-toggle"
                type="button"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Grupos
              </button>
              <ul
                className="dropdown-menu bg-warning "
                aria-labelledby="dropdownMenuButton1"
              >
                {console.log(store.listaGrupos)}

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
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-arrow-bar-left bg-white "
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
  );
};

export default SideBar;
