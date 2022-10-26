import React, { useState, useContext, useEffect } from "react";
import { Context } from "../../store/appContext";
import { useParams } from "react-router-dom";
import Calendar from "react-calendar";
import { Navbar } from "../navbar";

const ShowEvents = () => {
  const { store, actions } = useContext(Context);
  const [events, setEvents] = useState({});
  const params = useParams();

  useEffect(() => {
    actions.getEvents(params.page, params.per_page);
  }, []);

  useEffect(() => {
    setEvents(store.events);
    debugger;
  }, [store.event]);
  return (
    <div>
      <Navbar />
    </div>
  );
};

export default ShowEvents;
