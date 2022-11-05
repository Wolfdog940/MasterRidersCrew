import React, { useState, useContext, useEffect } from "react";
import { Context } from "../../store/appContext";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Navbar } from "../../component/navbar";
import IndividualAllEvents from "../../component/Events/individualAllEvents.jsx";

const AllEvents = () => {
  const { store, actions } = useContext(Context);
  const { page, per_page } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    actions.getEvents(page, per_page);
  }, [page]);

  if (store.allEvents) {
    return (
      <div>
        <Navbar />
        <Link to="/newevent">
          <h3 className="text-light">Crear tu propio evento</h3>
        </Link>
        <Link to="/searchevents">
          <h3 className="text-light">Busca en los eventos</h3>
        </Link>
        <div>
          <h1 className="text-white title-container">Todos mis eventos</h1>
        </div>
        <div className="event-container event-scroll">
          {store.allEvents.map((item) => (
            <IndividualAllEvents item={item} />
          ))}
        </div>
        <div className="w-100 d-flex justify-content-center mt-5">
          {page >= 1 && page < Math.ceil(store.allEventsLength / per_page) ? (
            <button
              className="btn btn-primary mx-5"
              onClick={() =>
                navigate(`/allevents/${parseInt(page) + 1}/${per_page}`)
              }
            >
              Siguiente
            </button>
          ) : null}
          {page > 1 && page <= Math.ceil(store.allEventsLength / per_page) ? (
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

export default AllEvents;
