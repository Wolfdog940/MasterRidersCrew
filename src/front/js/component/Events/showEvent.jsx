import React, { useState, useContext, useEffect } from "react";
import { Context } from "../../store/appContext";
import { useParams } from "react-router-dom";
import Calendar from "react-calendar";
import { Navbar } from "../navbar";

const ShowEvent = () => {
  const { store, actions } = useContext(Context);
  const [event, setEvent] = useState({});
  const params = useParams();

  useEffect(() => {
    actions.getEvent(params.eventId);
  }, []);

  useEffect(() => {
    setEvent(store.event);
  }, [store.event]);

  const sendMap = (e) => {
    e.preventDefault();
    var map = document.getElementById("mapInput").value.slice(13, -132);
    var id = params.eventId;
    actions.editEventMap(map, id);
  };
  return (
    <div>
      <Navbar />
      <div className="event-container event-scroll">
        <iframe src={event.map} width="800" height="600"></iframe>
        <div className="event-post">
          <h5 className="card-title">{event.name}</h5>
          <p className="postText">{event.date}</p>
          <p className="postText">{event.start}</p>
          <p className="postText">{event.end}</p>
          <p className="postText">{event.description}</p>
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
