import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";

export const AutoComplete = (props) => {
  const [complete, setComplete] = useState([]);
  const { store, actions } = useContext(Context);
  const [cities, setCities] = useState([]);

  const setData = (e) => {
    document.getElementById(props.id).value = e.target[e.target.value].text;
    if (props.pokemon == "inicio") {
      actions.setOriginCoords(
        cities[parseInt(e.target.value)].lon,
        cities[parseInt(e.target.value)].lat
      );
    } else {
      actions.setDestinationCoords(
        cities[parseInt(e.target.value)].lon,
        cities[parseInt(e.target.value)].lat
      );
    }
  };

  const getCities = async (complete) => {
    try {
      const resp = await fetch(
        "https://api.locationiq.com/v1/autocomplete?key=pk.a5259d9a2749ec7bbf7fff58a60195d1&q=" +
          complete
      );

      const data = await resp.json();

      if (resp.status === 200) {
        setCities(data);
        return data;
      } else {
        throw new Error("Destino no encontrado");
      }
    } catch (error) {
      console.log("Peticion invalida/Invalid request");
    }
  };

  const handleInputChange = (event) => {
    setComplete({
      ...complete,

      [event.target.id]: event.target.value.trim(),
    });
    let key = props.id;
    getCities(complete[key]);
  };

  return (
    <div className="d-flex justify-content-center text-dark">
      <input
        type="text"
        id={props.id}
        list="list"
        onChange={handleInputChange}
      />

      <select
        className="form-select"
        aria-label="Default select example"
        onChange={(e) => {
          setData(e);
        }}
        id={props.id}
      >
        {cities.map((city, index) => {
          if (city.address.county) {
            return (
              <option
                onClick={(e) => {
                  setData(e);
                }}
                key={index}
                value={index}
              >
                {city.address.name +
                  " ," +
                  city.address.county +
                  " ," +
                  city.address.country}
              </option>
            );
          } else {
            <option
              key={index}
              value={city.address.name + " ," + city.address.country}
            ></option>;
          }
        })}
      </select>
    </div>
  );
};
