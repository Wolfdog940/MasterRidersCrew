import React, { useState, useContext, useEffect } from "react";
import { Context } from "../../store/appContext";

const IndividualAllEvents = (props) => {
  const { store, actions } = useContext(Context);
  const [event, setEvent] = useState({});

  useEffect(() => {
    setEvent(props.item);
    actions.listEvents();
  }, []);

  const subscribe = (e) => {
    e.preventDefault();

    var id = event.id;
    actions.joinEvent(id);
  };

  return (
    <div className="event-post">
      <label for="name">Nombre del evento</label>
      <h5 id="name" className="card-title">
        {event.name}
      </h5>
      <label for="date">Fecha</label>
      <p id="date" className="postText">
        {event.date}
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
      {actions.searchEvent(event.id) ? (
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
