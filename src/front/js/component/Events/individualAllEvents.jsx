import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../store/appContext";
import { Weather } from "../weather.jsx";
const IndividualAllEvents = (props) => {
  const { store, actions } = useContext(Context);
  const [event, setEvent] = useState({});
  const [eventParticipation, setEventParticipation] = useState(true);
  const nav = useNavigate();

  useEffect(async () => {
    setEvent(props.item);
    await actions.listEvents();
    setEventParticipation(actions.searchEvent(event.id));
  }, []);

  useEffect(() => {
    if (store.userEventParticipation.length > 0) {
      setEventParticipation(actions.searchEvent(event.id));
    }
  }, [store.eventParticipation]);

  const subscribe = async (e) => {
    e.preventDefault();
    var id = event.id;
    await actions.joinEvent(id);
    setEventParticipation(actions.searchEvent(event.id));
  };

  const unsubscribe = async (e) => {
    e.preventDefault();
    var id = params.eventId;
    await actions.unsubscribeEvent(id);
    setEventParticipation(actions.searchEvent(event.id));
  };

  return (
    <div className="event-post container">
      <div className="row">
        <div className="col-4">
          <Link to={"/showevent/" + event.id} className="link-light">
            <label for="name">Nombre del evento</label>
            <h5 id="name" className="card-title">
              {event.name}
            </h5>
          </Link>
          <label for="date">Fecha</label>
          <p id="date" className="postText">
            {event.date} a las {event.hours}:{event.minutes}
          </p>
          <label for="start">Ciudad de inicio</label>
          <p id="start" className="postText">
            {event.start}
          </p>
          <label for="end">Ciudad de destino</label>
          <p id="end" className="postText">
            {event.end}
          </p>
          <label for="description">Descripcion</label>
          <p id="description" className="postText">
            {event.description}
          </p>
          {eventParticipation ? (
            <button onClick={unsubscribe} className="btn btn-primary ms-5">
              Salir
            </button>
          ) : (
            <button onClick={subscribe} className="btn btn-primary ms-5">
              Inscribirse
            </button>
          )}
        </div>
        <div className="col-8">
          <iframe src={event.map} width="500" height="400"></iframe>
          {event.destination_lat != undefined ? (
            <span>
              <Weather long={event.origin_lon} lat={event.origin_lat} />
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
