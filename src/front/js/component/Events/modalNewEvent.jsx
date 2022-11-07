import React, { useState, useContext } from "react";
import { Context } from "../../store/appContext";
import { useNavigate } from "react-router-dom";
import { AutoComplete } from "../autocomplete.jsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import es from "date-fns/locale/es";
registerLocale("es", es);

const ModalNewEvent = () => {
  const [startDate, setStartDate] = useState(new Date());
  const { actions } = useContext(Context);
  const navigate = useNavigate();

  let lastDate = Date.now() + 864000000;

  const submitEvent = async (e) => {
    e.preventDefault();
    let name = document.getElementById("nameInput").value;
    let start = document.getElementById("startInput").value;
    let end = document.getElementById("endInput").value;
    let description = document.getElementById("descriptionInput").value;
    let hours = document.getElementById("hoursInput").value;
    let minutes = document.getElementById("minutesInput").value;
    let date = startDate;
    await actions.newEvent(name, start, end, description, date, hours, minutes);
    navigate("/allevents/1/5");
  };

  return (
    <div
      className="modal fade"
      id="modalNewEvent"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              Crea un evento
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <form id="formulario" onSubmit={submitEvent}>
              <div>
                <DatePicker
                  className="mb-2"
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  minDate={new Date()}
                  maxDate={lastDate}
                  dateFormat="dd/MM/yyy"
                  locale="es"
                  placeholderText="Seleciona una fecha"
                />
                <div className="d-flex mb-2 ">
                  <label htmlFor="hoursInput"></label>
                  <input
                    id="hoursInput"
                    placeholder="a que hora?"
                    className="w-50 "
                    autoComplete="off"
                  ></input>

                  <input
                    id="minutesInput"
                    placeholder="minutos?"
                    className="w-50"
                    autoComplete="off"
                  ></input>
                </div>
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
                  autoComplete="off"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="startInput" className="form-label">
                  Inicio
                </label>
                <AutoComplete id="startInput" pokemon="inicio" />
              </div>
              <div className="mb-3">
                <label htmlFor="endInput" className="form-label">
                  Final
                </label>
                <AutoComplete id="endInput" />
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
                  autoComplete="off"
                />
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button
              type="submit"
              form="formulario"
              className="btn btn-primary"
              data-bs-dismiss="modal"
            >
              Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalNewEvent;
