import React, { useState, useContext, useEffect } from "react";
import { Context } from "../../store/appContext";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Navbar } from "../../component/navbar";
import IndividualAllEvents from "../../component/Events/individualAllEvents.jsx";
import ModalNewEvent from "../../component/Events/modalNewEvent.jsx";

const AllPublicEvents = () => {
  const { store, actions } = useContext(Context);
  const { page, per_page } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")){
      navigate("/")
    }
    actions.getPublicEvents(page, per_page);
  }, [, page]);

  const deleteEvent = async (id) => {
    await actions.deleteEvent(id);
    actions.getPublicEvents(page, per_page);
  };

  if (store.allPublicEvents) {
    return (
      <div>
        <Navbar />
        {/* botones para añadir y buscar eventos */}
        <div className="d-flex justify-content-center">
          <div>
            <button
              type="button"
              className="btn btn-secondary rounded-pill border-white mt-3 me-3 addBtn"
              data-bs-toggle="modal"
              data-bs-target="#modalNewEvent"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="bi bi-plus-circle me-1"
                viewBox="0 0 16 16"
              >
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
              </svg>
              Agregar
            </button>
            <ModalNewEvent />
          </div>
          <div>
            <Link to="/searchevents">
              <button className="btn btn-secondary rounded-pill text-light border-white mt-3 searchBtn">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="bi bi-search me-1"
                  viewBox="0 0 16 16"
                >
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                </svg>
                Buscar
              </button>
            </Link>
          </div>
        </div>
        <div className="d-flex justify-content-center my-2">
          <Link to="/showVideo" className="link">
            {" "}
            <span className="text-warning ">
              No sabes como crear un evento ?
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-exclamation-circle ms-2"
                viewBox="0 0 16 16"
              >
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" />
              </svg>
            </span>
          </Link>
        </div>
        <div>
          <h1 className="text-white title-container">Todos los eventos</h1>
        </div>
        <div className="event-container event-scroll">
          {store.allPublicEvents.map((item, i) => (
            <div key={i}>
              <IndividualAllEvents item={item} deleteEvent={deleteEvent} />
            </div>
          ))}
        </div>
        <div className="w-100 d-flex justify-content-center mt-5">
          {page >= 1 &&
          page < Math.ceil(store.allPublicEventsLength / per_page) ? (
            <button
              className="btn btn-primary mx-5"
              onClick={() =>
                navigate(`/allevents/${parseInt(page) + 1}/${per_page}`)
              }
            >
              Siguiente
            </button>
          ) : null}
          {page > 1 &&
          page <= Math.ceil(store.allPublicEventsLength / per_page) ? (
            <button
              className="btn btn-primary mx-5"
              onClick={() =>
                navigate(`/allevents/${parseInt(page) - 1}/${per_page}`)
              }
            >
              Anterior
            </button>
          ) : null}
        </div>
      </div>
    );
  } else {
    return <div></div>;
  }
};

export default AllPublicEvents;
