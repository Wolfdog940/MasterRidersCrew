import React, { useState, useContext, useEffect } from "react";
import { Context } from "../../store/appContext";
import { useParams } from "react-router-dom";
import { Navbar } from "../../component/navbar";
import IndividualAllEvents from "../../component/Events/individualAllEvents.jsx";

const AllEvents = () => {
  const { store, actions } = useContext(Context);
  const [events, setEvents] = useState([]);
  const params = useParams();

  useEffect(() => {
    actions.getEvents(params.page, params.per_page);
  }, []);

  useEffect(() => {
    setEvents(store.allEvents);
  }, [store.allEvents]);
  debugger;
  return (
    <div>
      <Navbar />
      <div className="post-container">
        {events.map((item) => (
          <IndividualAllEvents item={item} />
        ))}
      </div>
    </div>
  );
};

export default AllEvents;
