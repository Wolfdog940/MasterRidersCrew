import React, { useState, useContext, useEffect } from "react";
import { Context } from "../../store/appContext";
import { useNavigate, useParams } from "react-router-dom";
import { Navbar } from "../navbar";
import "../../../styles/showEvent.css";

const ShowEvent = () => {
  const { store, actions } = useContext(Context);
  const [event, setEvent] = useState({});
  const params = useParams();
  const [eventParticipation, setEventParticipation] = useState(true);
  const [eventParticipants, setEventParticipants] = useState(0);
  let navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
    }
    getEventAndList();
    setEventParticipation(actions.searchEvent(params.eventId));
  }, []);

  useEffect(() => {
    setEvent(store.event);
    setEventParticipation(actions.searchEvent(params.eventId));
    getEventParticipants();
  }, [store.event]);

  useEffect(() => {
    if (store.userEventParticipation.length > 0) {
      setEventParticipation(actions.searchEvent(params.eventId));
      getEventParticipants();
    }
  }, [store.eventParticipation]);

  const getEventParticipants = async () => {
    const opts = {
      headers: {
        Authorization: "Bearer " + localStorage.token,
      },
    };
    try {
      const resp = await fetch(
        process.env.BACKEND_URL + "/api/listParticipants/" + params.eventId,
        opts
      );
      const data = await resp.json();
      setEventParticipants(data.participantsAmount);
      return data;
    } catch (error) {
      console.error("There has been an error retrieving data");
    }
  };

  const getEventAndList = async () => {
    await actions.getEvent(params.eventId);
    await actions.listEvents();
    await getEventParticipants();
  };

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
    await getEventParticipants();
  };

  const unsubscribe = async (e) => {
    e.preventDefault();
    var id = params.eventId;
    await actions.unsubscribeEvent(id);
    await actions.listEvents();
    setEventParticipation(actions.searchEvent(params.eventId));
    await getEventParticipants();
  };
  return (
    <div>
      <Navbar />
      <div className="event-container event-scroll">
        <iframe src={event.map} className="mapaShowEvent"></iframe>
        <div className="event-post">
          <div className="divShowEvent">
            <label htmlFor="name" className="text-secondary labelShowEvent">
              Nombre del evento
            </label>
            <h5 id="name" className="card-title">
              {event.name}
            </h5>
          </div>
          <div className="divShowEvent">
            <label htmlFor="date" className="text-secondary labelShowEvent">
              Fecha
            </label>
            <p id="date">
              {event.date} a las {event.hours}:{event.minutes}
            </p>
          </div>
          <div className="divShowEvent">
            <label htmlFor="start" className="text-secondary labelShowEvent">
              Ciudad de inicio
            </label>
            <p id="start">{event.start}</p>
          </div>
          <div className="divShowEvent">
            <label htmlFor="end" className="text-secondary labelShowEvent">
              Ciudad de destino
            </label>
            <p id="end">{event.end}</p>
          </div>
          <div className="divShowEvent">
            <label
              htmlFor="description"
              className="text-secondary labelShowEvent"
            >
              Descripcion
            </label>
            <p id="description">{event.description}</p>
          </div>
          <div className="divShowEvent">
            <label
              htmlFor="amountParticipants"
              className="text-secondary labelShowEvent"
            >
              Cantidad de participantes
            </label>
            <p id="amountParticipants">{eventParticipants}</p>
          </div>
          <div className="showFooter d-flex flex-column">
            <div className="d-flex">
              <input
                id="mapInput"
                placeholder="Pega aqui la ruta de google maps"
                className="showFooterInput"
              ></input>
              <button
                onClick={sendMap}
                className="btn btn-outline-secondary enterBtn showFooterBtnAddMap"
              >
                Enviar mapa
              </button>
            </div>
            {eventParticipation ? (
              <button
                onClick={unsubscribe}
                className="btn btn-outline-warning mt-2 leaveBtn showFooterBtnParticipation"
              >
                Borrarse del evento
              </button>
            ) : (
              <button
                onClick={subscribe}
                className="btn btn-outline-success mt-2 enterBtn showFooterBtnParticipation"
              >
                Inscribirse en el evento
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ShowEvent;
