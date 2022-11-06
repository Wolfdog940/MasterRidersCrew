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
      <div className="row">
        <div className="col-4">
          <Link to={"/showevent/" + event.id} className="link-light">
            <label htmlFor="name">Nombre del evento</label>
            <h5 id="name" className="card-title">
              {event.name}
            </h5>
          </Link>
          <label htmlFor="date">Fecha</label>
          <p id="date" className="postText">
            {event.date} a las {event.hours}:{event.minutes}
          </p>
          <label htmlFor="start">Ciudad de inicio</label>
          <p id="start" className="postText">
            {event.start}
          </p>
          <label htmlFor="end">Ciudad de destino</label>
          <p id="end" className="postText">
            {event.end}
          </p>
          <label htmlFor="description">Descripcion</label>
          <p id="description" className="postText">
            {event.description}
          </p>
          {eventParticipation ? (
            <button onClick={unsubscribe} className="btn btn-primary ms-5">
              Borrarse del evento
            </button>
          ) : (
            <button onClick={subscribe} className="btn btn-primary ms-5">
              Inscribirse en el evento
            </button>
          )}
        </div>
        <div className="col-8">
          <iframe src={event.map} width="100%" height="auto"></iframe>
          {event.destination_lat != undefined ? (
            <span>
              <Weather long={event.origin_lon} lat={event.origin_lat} width="15px" height="15px"/>
              <Weather
                long={event.destination_lon}
                lat={event.destination_lat}
              />
            </span>
          ) : (
            <span>datos del tiempo no han cargado</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default IndividualAllEvents;
