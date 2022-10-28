import React, { useState, useContext, useEffect } from "react";
import { Context } from "../../store/appContext";
import { useParams } from "react-router-dom";
import Calendar from "react-calendar";
import { Navbar } from "../navbar";

const IndividualAllEvents = (props) => {
  const { store, actions } = useContext(Context);
  const [event, setEvent] = useState({});

  useEffect(() => {
    setEvent(props.item);
  }, []);

  return (
    <div className="card ">
      <div className="card-body post">
        <h5 className="card-title">{event.name}</h5>
        <p className="card-text postText">{event.date}</p>
        <p className="card-text postText">{event.start}</p>
        <p className="card-text postText">{event.end}</p>
        <p className="card-text postText">{event.description}</p>
      </div>
    </div>
  );
};

export default IndividualAllEvents;
