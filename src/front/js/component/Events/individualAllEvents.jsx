import React, { useState, useContext, useEffect } from "react";
import { Context } from "../../store/appContext";

const IndividualAllEvents = (props) => {
  const { store, actions } = useContext(Context);
  const [event, setEvent] = useState({});

  useEffect(() => {
    setEvent(props.item);
  }, []);

  return (
    <div className="event-post">
      <h5 className="card-title">{event.name}</h5>
      <p className="postText">{event.date}</p>
      <p className="postText">{event.start}</p>
      <p className="postText">{event.end}</p>
      <p className="postText">{event.description}</p>
    </div>
  );
};

export default IndividualAllEvents;
