import React, { useState, useContext } from "react";
import { Context } from "../../store/appContext";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import { Navbar } from "../navbar";
import { AutoComplete } from "../autocomplete.jsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import es from "date-fns/locale/es";
registerLocale("es", es);

const EditEvent = () => {
  const [startDate, setStartDate] = useState(new Date());
  const { store, actions } = useContext(Context);
  const [event, setEvent] = useState({});
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    actions.getEvent(params.eventId);
  }, []);

  useEffect(() => {
    setEvent(store.event);
  }, [store.event]);

  const submitEvent = async (e) => {
    e.preventDefault();
    let name = document.getElementById("nameInput").value;
    let start = document.getElementById("startInput").value;
    let end = document.getElementById("endInput").value;
    let description = document.getElementById("descriptionInput").value;
    let hours = document.getElementById("hoursInput").value;
    let minutes = document.getElementById("minutesInput").value;
    let date = startDate;
    await actions.editEvent(
      name,
      start,
      end,
      description,
      date,
      hours,
      minutes
    );
    navigate("/allevents/1/5");
  };

  return (
    <div>
      <Navbar />
      <form onSubmit={submitEvent}>
        <div>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            minDate={new Date()}
            maxDate={lastDate}
            dateFormat="dd/MM/yyy"
            locale="es"
            placeholderText="Seleciona una fecha"
          />
          <span>
            <label htmlFor="hoursInput">A las</label>
            <input
              id="hoursInput"
              placeholder="¿A que hora?"
              defaultValue={event.hours}
            ></input>
            <label htmlFor="hoursInput">:</label>
            <input
              id="minutesInput"
              placeholder="¿minutos?"
              defaultValue={event.minutes}
            ></input>
          </span>
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
          <AutoComplete
            id="startInput"
            pokemon="inicio"
            defaultValue={event.start}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="endInput" className="form-label">
            Final
          </label>
          <AutoComplete id="endInput" defaultValue={event.end} />
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
