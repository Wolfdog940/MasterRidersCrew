import React, { useState, useContext, useEffect } from "react";
import { Context } from "../../store/appContext";
import { useParams } from "react-router-dom";
import Calendar from "react-calendar";
import { Navbar } from "../navbar";

const EditEvent = () => {
  const [startDate, setStartDate] = useState(new Date());
  const { store, actions } = useContext(Context);
  const [event, setEvent] = useState({});
  const params = useParams();

  useEffect(() => {
    actions.getEvent(params.eventId);
  }, []);

  useEffect(() => {
    setEvent(store.event);
  }, [store.event]);

  const submitEvent = () => {
    var name = document.getElementById("nameInput").value;
    var start = document.getElementById("startInput").value;
    var end = document.getElementById("endInput").value;
    var description = document.getElementById("descriptionInput").value;
    var date = startDate;
    actions.editEvent(name, start, end, description, date);
  };

  return (
    <div>
      <Navbar />
      <form onSubmit={submitEvent}>
        <div className="mb-3">
          <label className="form-label">Fecha</label>
          <p>{event.date}</p>
        </div>
        <div>
          <Calendar onChange={setStartDate} value={startDate} />
        </div>
        <div className="mb-3">
          <label htmlFor="nameInput" className="form-label">
            Nombre
          </label>
          <input
            type="text"
            className="form-control"
            id="nameInput"
            aria-describedby="nameHelp"
            defaultValue={event.name}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="startInput" className="form-label">
            Inicio
          </label>
          <input
            type="text"
            className="form-control"
            id="startInput"
            aria-describedby="startHelp"
            defaultValue={event.start}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="endInput" className="form-label">
            Final
          </label>
          <input
            type="text"
            className="form-control"
            id="endInput"
            aria-describedby="endHelp"
            defaultValue={event.end}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="descriptionInput" className="form-label">
            Descripcion
          </label>
          <input
            type="text"
            className="form-control"
            id="descriptionInput"
            aria-describedby="descriptionHelp"
            defaultValue={event.description}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Enviar
        </button>
      </form>
    </div>
  );
};

export default EditEvent;
