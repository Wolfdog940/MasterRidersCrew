import React, { useState, useContext } from "react";
/* import { Context } from "../store/appContext"; */
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import { CalendarContainer } from "react-datepicker";

const NewEvent = () => {
  /* const { store, actions } = useContext(Context); */
  const [startDate, setStartDate] = useState(new Date());

  const submitEvent = () => {
    var nameInput = document.getElementById("nameInput").value;
    var startInput = document.getElementById("startInput").value;
    var endInput = document.getElementById("endInput").value;
    var descriptionInput = document.getElementById("descriptionInput").value;
    var privacyInput = document.getElementById("privacyInput").value;
    var date = dateValue;
    console.log(
      nameInput,
      startInput,
      endInput,
      descriptionInput,
      privacyInput,
      startDate
    );
    debugger;
  };
  const MyContainer = ({ className, children }) => {
    return (
      <div style={{ padding: "16px", background: "#216ba5", color: "#fff" }}>
        <CalendarContainer className={className}>
          <div style={{ background: "#f0f0f0" }}>
            What is your favorite day?
          </div>
          <div style={{ position: "relative" }}>{children}</div>
        </CalendarContainer>
      </div>
    );
  };

  return (
    <form onSubmit={submitEvent}>
      <DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        calendarContainer={MyContainer}
      />
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
      <div className="mb-3 form-check">
        <input type="checkbox" className="form-check-input" id="privacyInput" />
        <label className="form-check-label" htmlFor="privacyInput">
          Privado?
        </label>
      </div>
      <button type="submit" className="btn btn-primary">
        Enviar
      </button>
    </form>
  );
};

export default NewEvent;
