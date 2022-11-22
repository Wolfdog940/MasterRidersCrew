import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../store/appContext";
import { Weather } from "../weather.jsx";

const IndividualAllEventsUserFavorite = (props) => {
  const { store, actions } = useContext(Context);
  const [event, setEvent] = useState({});
  const [eventParticipation, setEventParticipation] = useState(true);
  const [eventParticipants, setEventParticipants] = useState(0);
  const nav = useNavigate();

  useEffect(() => {
    setEvent(props.item);
    let synchEffect = async () => {
      await actions.listEvents();
      setEventParticipation(actions.searchEvent(props.item.id));
      await getEventParticipants();
    };
    synchEffect();
  }, []);

  useEffect(() => {
    let synchEffect = async () => {
      if (store.userEventParticipation.length > 0) {
        await actions.listEvents();
        setEventParticipation(actions.searchEvent(props.item.id));
        getEventParticipants();
      }
    };
    synchEffect();
  }, [store.eventParticipation]);

  const getEventParticipants = async () => {
    const opts = {
      headers: {
        Authorization: "Bearer " + localStorage.token,
      },
    };
    try {
      const resp = await fetch(
        process.env.BACKEND_URL + "/api/listParticipants/" + props.item.id,
        opts
      );
      const data = await resp.json();
      setEventParticipants(data.participantsAmount);
      return data;
    } catch (error) {
      console.error("There has been an error retrieving data");
    }
  };

  const subscribe = (e) => {
    e.preventDefault();
    var id = event.id;
    actions.joinEvent(id);
    props.updateMethod != null
      ? props.updateMethod(1, 5)
      : nav("/allpublicevents/1/5");
  };

  const unsubscribe = (e) => {
    e.preventDefault();
    var id = event.id;
    actions.unsubscribeEvent(id);
    props.updateMethod != null
      ? props.updateMethod(1, 5)
      : nav("/allpublicevents/1/5");
  };

  return (
    <div className="event-post container">
      <div>
        <div>
          <Link to={"/showevent/" + event.id} className="link-light">
            <h5 id="name" className="card-title text-center mb-4">
              {event.name}
            </h5>
          </Link>
        </div>
        <div>
          <iframe src={event.map} width="100%" height="auto"></iframe>
        </div>
        <div>
          <div className="d-flex pt-2 border-top border-opacity-25 mb-1">
            <label htmlFor="date" className="text-secondary hidden">
              Fecha
            </label>
            <p id="date" className="postText justify-content-end">
              {event.date} a las {event.hours}:{event.minutes}
            </p>
          </div>
          <div className="d-flex pt-2 border-top border-opacity-25">
            <label htmlFor="start" className="text-secondary hidden">
              Origen
            </label>
            <p id="start" className="postText justify-content-end">
              {event.start}
            </p>
            {event.destination_lat != undefined ? (
              <span className="text-end rounded-circle ms-2">
                <Weather long={event.origin_lon} lat={event.origin_lat} />
              </span>
            ) : (
              <span>datos del tiempo no han cargado</span>
            )}
          </div>
          <div className="d-flex pt-2 border-top">
            <label htmlFor="end" className="text-secondary hidden">
              Destino
            </label>
            <p id="end" className="postText justify-content-end">
              {event.end}
            </p>
            {event.destination_lat != undefined ? (
              <span className="text-end rounded-circle ms-2">
                <Weather
                  long={event.destination_lon}
                  lat={event.destination_lat}
                />
              </span>
            ) : (
              <span>datos del tiempo no han cargado</span>
            )}
          </div>
          <div className="d-flex justify-content-between pt-2 border-top">
            <label htmlFor="description" className="text-secondary hidden">
              Descripcion
            </label>
            <p id="description" className="postText justify-content-end pEvent">
              {event.description}
            </p>
          </div>
          <div className="d-flex justify-content-between pt-2 border-top">
            <label
              htmlFor="amountParticipants"
              className="text-secondary hidden"
            >
              Cantidad de participantes
            </label>
            <p
              id="amountParticipants"
              className="postText justify-content-end pEvent"
            >
              {eventParticipants}
            </p>
          </div>
        </div>
        <div className="d-flex justify-content-evenly">
          {eventParticipation ? (
            <button
              onClick={unsubscribe}
              className="btn btn-outline-warning leaveBtn rounded-pill"
            >
              Abandonar evento
            </button>
          ) : (
            <button
              onClick={subscribe}
              className="btn btn-outline-success enterBtn rounded-pill"
            >
              Inscribirse en el evento
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default IndividualAllEventsUserFavorite;
