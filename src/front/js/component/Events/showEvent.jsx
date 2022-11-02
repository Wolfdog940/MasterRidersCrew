import React, { useState, useContext, useEffect } from "react";
import { Context } from "../../store/appContext";
import { useParams } from "react-router-dom";
import Calendar from "react-calendar";
import { Navbar } from "../navbar";

const ShowEvent = () => {
  const { store, actions } = useContext(Context);
  const [event, setEvent] = useState({});
  const params = useParams();
  const [eventParticipation, setEventParticipation] = useState(true);

  useEffect(() => {
    actions.getEvent(params.eventId);
    actions.listEvents();
    setEventParticipation(actions.searchEvent(params.eventId));
  }, []);

  useEffect(() => {
    setEvent(store.event);
    setEventParticipation(actions.searchEvent(params.eventId));
  }, [store.event]);

  useEffect(() => {
    if (store.userEventParticipation.length > 0) {
      setEventParticipation(actions.searchEvent(params.eventId));
    }
  }, [store.eventParticipation]);

  const sendMap = (e) => {
    e.preventDefault();
    var map = document.getElementById("mapInput").value.slice(13, -132);
    var id = params.eventId;
    actions.editEventMap(map, id);
    document.getElementById("mapInput").value = "";
  };

  const subscribe = (e) => {
    e.preventDefault();
    var id = params.eventId;
    actions.joinEvent(id);
  };

  const unsubscribe = (e) => {
    e.preventDefault();
    var id = params.eventId;
    actions.unsubscribeEvent(id);
  };
  return (
    <div>
      <Navbar />
      {eventParticipation ? (
        <button onClick={unsubscribe} className="btn btn-primary">
          Salir
        </button>
      ) : (
        <button onClick={subscribe} className="btn btn-primary">
          Inscribirse
        </button>
      )}

      <div className="event-container event-scroll">
        <iframe src={event.map} width="800" height="600"></iframe>
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
          <input
            id="mapInput"
            placeholder="Pega aqui la ruta de google maps"
          ></input>

          <button onClick={sendMap} className="btn btn-primary">
            Enviar mapa
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShowEvent;
