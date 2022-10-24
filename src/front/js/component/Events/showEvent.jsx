import React, { useState, useContext, useEffect } from "react";
import { Context } from "../../store/appContext";
import { useParams } from "react-router-dom";
import Calendar from "react-calendar";

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
  return (
    <div>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">{event.name}</h5>
          <p className="card-text">{event.date}</p>
          <p className="card-text">{event.start}</p>
          <p className="card-text">{event.end}</p>
          <p className="card-text">{event.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ShowEvent;
