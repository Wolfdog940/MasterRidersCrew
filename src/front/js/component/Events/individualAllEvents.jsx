import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../store/appContext";

const IndividualAllEvents = (props) => {
  const { store, actions } = useContext(Context);
  const [event, setEvent] = useState({});
  const [eventParticipation, setEventParticipation] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    setEvent(props.item);
    actions.listEvents();
    setEventParticipation(actions.searchEvent(event.id));
  }, []);

  useEffect(() => {
    if (store.userEventParticipation.length > 0) {
      setEventParticipation(actions.searchEvent(event.id));
    }
  }, [store.eventParticipation]);

  const subscribe = (e) => {
    e.preventDefault();

    var id = event.id;
    actions.joinEvent(id);
  };

  const unsubscribe = (e) => {
    e.preventDefault();
    var id = params.eventId;
    actions.unsubscribeEvent(id);
  };

  return (
    <div className="event-post">

      <label htmlFor="name">Nombre del evento</label>
      <h5 id="name" className="card-title">
        {event.name}
      </h5>
      <label htmlFor="date">Fecha</label>

     
      <p id="date" className="postText">
        {event.date}
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
        <button onClick={unsubscribe} className="btn btn-primary">
          Salir
        </button>
      ) : (
        <button onClick={subscribe} className="btn btn-primary">
          Inscribirse
        </button>
      )}
    </div>
  );
};

export default IndividualAllEvents;
