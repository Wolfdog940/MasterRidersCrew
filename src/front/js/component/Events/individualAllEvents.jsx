import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../store/appContext";
import { Weather } from "../weather.jsx";

const IndividualAllEvents = (props) => {
  const { store, actions } = useContext(Context);
  const [event, setEvent] = useState({});
  const [eventParticipation, setEventParticipation] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    const synchEffect = async () => {
      setEvent(props.item);
      await actions.listEvents();
      setEventParticipation(actions.searchEvent(props.item.id));
    };
    synchEffect();
  }, []);

  useEffect(() => {
    if (store.userEventParticipation.length > 0) {
      setEventParticipation(actions.searchEvent(props.item.id));
    }
  }, [store.eventParticipation]);

  const subscribe = async (e) => {
    e.preventDefault();
    await actions.joinEvent(props.item.id);
    await actions.listEvents();
    setEventParticipation(actions.searchEvent(props.item.id));
  };

  const unsubscribe = async (e) => {
    e.preventDefault();
    await actions.unsubscribeEvent(props.item.id);
    await actions.listEvents();
    setEventParticipation(actions.searchEvent(props.item.id));
  };

  return (
    <div className="event-post container">
      <div>
        <div>
          <Link to={"/showevent/" + event.id} className="link-light">
            <h5 id="name" className="card-title text-center">
              {event.name}
            </h5>
          </Link>
        </div>
        <div>
          <iframe src={event.map} width="100%" height="auto"></iframe>
        </div>
        <div>
          <div className="d-flex">
            <label htmlFor="date" className="text-secondary">
              Fecha
            </label>
            <p id="date" className="postText justify-content-end">
              {event.date} a las {event.hours}:{event.minutes}
            </p>
          </div>
          <div className="d-flex">
            <label htmlFor="start" className="text-secondary">
              Origen
            </label>
            <p id="start" className="postText justify-content-end">
              {event.start}
            </p>
            {event.destination_lat != undefined ? (
              <span className="text-end rounded-circle ms-2">
                <Weather long={event.origin_lon} lat={event.origin_lat} />
              </span>
            ) : (
              <span>datos del tiempo no han cargado</span>
            )}
          </div>
          <div className="d-flex">
            <label htmlFor="end" className="text-secondary">
              Destino
            </label>
            <p id="end" className="postText justify-content-end">
              {event.end}
            </p>
            {event.destination_lat != undefined ? (
              <span className="text-end rounded-circle ms-2">
                <Weather
                  long={event.destination_lon}
                  lat={event.destination_lat}
                />
              </span>
            ) : (
              <span>datos del tiempo no han cargado</span>
            )}
          </div>
          <div className="d-flex justify-content-between">
            <label htmlFor="description" className="text-secondary">
              Descripcion
            </label>
            <p id="description" className="postText justify-content-end pEvent">
              {event.description}
            </p>
          </div>
        </div>
        <div className="d-flex justify-content-evenly">
          {eventParticipation ? (
            <button onClick={unsubscribe} className="btn btn-outline-warning leaveBtn">
              Abandonar evento
            </button>
          ) : (
            <button onClick={subscribe} className="btn btn-outline-success enterBtn">
              Inscribirse en el evento
            </button>
          )}
          <button
            onClick={() => {
              props.deleteEvent(props.item.id);
            }}
            className="btn btn-transparent text-danger myTrash"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-trash"
              viewBox="0 0 16 16"
            >
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
              <path
                fillRule="evenodd"
                d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default IndividualAllEvents;
