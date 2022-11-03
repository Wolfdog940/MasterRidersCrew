import React, { useState, useContext } from "react";
import { Context } from "../../store/appContext";
import { Link } from "react-router-dom";
import Calendar from "react-calendar";
import { Navbar } from "../navbar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import es from "date-fns/locale/es";
registerLocale("es", es);

const NewEvent = () => {
  const [startDate, setStartDate] = useState(new Date());
  const { actions } = useContext(Context);
  let lastDate = Date.now() + 864000000;
  const submitEvent = (e) => {
    e.preventDefault();
    var name = document.getElementById("nameInput").value;
    var start = document.getElementById("startInput").value;
    var end = document.getElementById("endInput").value;
    var description = document.getElementById("descriptionInput").value;
    var date = startDate;
    actions.newEvent(name, start, end, description, date);
  };

  return (
    <div>
      <Navbar />
      <form onSubmit={submitEvent}>
        <div>
          {/*  <Calendar onChange={setStartDate} value={startDate} /> */}
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            minDate={new Date()}
            maxDate={lastDate}
            dateFormat="dd/MM/yyy"
            locale="es"
            placeholderText="Seleciona una fecha"
          />
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
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Enviar
        </button>
      </form>
    </div>
  );
};

export default NewEvent;
