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
        <div>
          <button
            type="button"
            className="btn btn-secondary rounded-pill"
            data-bs-toggle="modal"
            data-bs-target="#modalNewEvent"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-plus-circle me-1"
              viewBox="0 0 16 16"
            >
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
            </svg>
            Crea tu propio evento
          </button>
          <ModalNewEvent />
        </div>
        <div>
          <Link to="/searchevents">
            <h3 className="text-light">Busca en los eventos</h3>
          </Link>
        </div>
        <div>
          <h1 className="text-white title-container">Todos los eventos</h1>
        </div>
        <div className="event-container event-scroll">
          {store.allPublicEvents.map((item, i) => (
            <div key={i}>
              <IndividualAllEvents item={item} />
              <button
                onClick={() => {
                  deleteEvent(item.id);
                }}
                className="btn btn-danger"
              >
                Borrar evento
              </button>
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
