import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import IndividualAllEventsUserFavorite from "../favorites/individualAllEventsUserFavorite.jsx"

const AllEventsUserFavorite = (props) => {
  const [events, setEvents] = useState([]);
  const [count, setCount] = useState(0);
  let { page, per_page } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
    }
    if (props.noParams) {
      page = 1;
      per_page = 10;
    }
  }, []);

  useEffect(() => {
    getEventsUserFavorite(props.user_id, page, per_page);
  }, [page]);

  const getEventsUserFavorite = async (user_id, page, per_page) => {
    try {
      const resp = await fetch(
        process.env.BACKEND_URL + "/api/events/"+ user_id + "/" + page + "/" + per_page,{
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + localStorage.token
        }
      }
      );
      const data = await resp.json();
      if (resp.status !== 200){
        alert("Peticion invalida/Invalid request");
        return false;
      }
      setEvents(data[0]);
      setCount(data[1]);
      return true;
    } catch (error) {
      console.error("There has been an error retrieving data");
    }
  };

  if (events) {
    return (
      <div>
        <div>{props.noNavBar ? <div></div> : <Navbar />}</div>
        <div>
          <h1 className="text-white title-container">Todos sus eventos</h1>
        </div>
        <div className="event-container event-scroll">
          {events.map((item) => (
            <div className="post-margin" key={item.id}>
              <IndividualAllEventsUserFavorite
                item={item}
              />
            </div>
          ))}
        </div>
        <div className="w-100 d-flex justify-content-center mt-5">
          {page >= 1 && page < Math.ceil(store.allEventsLength / per_page) ? (
            <button
              className="btn btn-primary mx-5"
              id="nextButtonPost"
              onClick={() =>
                navigate(`/allevents/${parseInt(page) + 1}/${per_page}`)
              }
            >
              Siguiente
            </button>
          ) : null}
          {page > 1 && page <= Math.ceil(store.allEventsLength / per_page) ? (
            <button
              className="btn btn-primary mx-5"
              id="prevButtonPost"
              onClick={() =>
                navigate(`/allevents/${parseInt(page) - 1}/${per_page}`)
              }
            >
              Anterior
            </button>
          ) : null}
        </div>
      </div>
    );
  } else {
    return <div></div>;
  }
};

export default AllEventsUserFavorite;
