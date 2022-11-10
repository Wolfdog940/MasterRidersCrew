import React, { useState, useContext, useEffect } from "react";
import { Context } from "../../store/appContext";
import { useNavigate, useParams } from "react-router-dom";
import { Navbar } from "../navbar";

const ShowEvent = () => {
  const { store, actions } = useContext(Context);
  const [event, setEvent] = useState({});
  const params = useParams();
  const [eventParticipation, setEventParticipation] = useState(true);
  let navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
    }
    getEventAndList();
    setEventParticipation(actions.searchEvent(params.eventId));
  }, []);

  const getEventAndList = async () => {
    await actions.getEvent(params.eventId);
    await actions.listEvents();
  };

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

  const subscribe = async (e) => {
    e.preventDefault();
    var id = params.eventId;
    await actions.joinEvent(id);
    await actions.listEvents();
    setEventParticipation(actions.searchEvent(params.eventId));
  };

  const unsubscribe = async (e) => {
    e.preventDefault();
    var id = params.eventId;
    await actions.unsubscribeEvent(id);
    await actions.listEvents();
    setEventParticipation(actions.searchEvent(params.eventId));
  };
  return (
    <div>
      <Navbar />
      <div className="event-container event-scroll">
        <iframe src={event.map} style={{"width":"80%", "max-width":"700px", "height":"500px"}}></iframe>
        <div className="event-post">
          <label htmlFor="name">Nombre del evento</label>
          <h5 id="name" className="card-title">
            {event.name}
          </h5>
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
          <input
            id="mapInput"
            placeholder="Pega aqui la ruta de google maps"
          ></input>

          <button onClick={sendMap} className="btn btn-primary">
            Enviar mapa
          </button>
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
      </div>
    </div>
  );
};

export default ShowEvent;
