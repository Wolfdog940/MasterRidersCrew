import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";

export const AutoComplete = (props) => {
  const [complete, setComplete] = useState([]);
  const { actions } = useContext(Context);
  const [cities, setCities] = useState([]);

  const setData = (e) => {
    let city = cities.find((x) => x.place_id == e.target.value);
    document.querySelector("#" + props.id).value = city.address.county
      ? city.address.name +
        ", " +
        city.address.county +
        ", " +
        city.address.country
      : city.address.name + " ," + city.address.country;
    if (props.pokemon == "inicio") {
      actions.setOriginCoords(city.lon, city.lat);
    } else {
      actions.setDestinationCoords(city.lon, city.lat);
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

  const handleInputChange = async (event) => {
    await c(event);

    let key = props.id;
    getCities(complete[key]);
  };

  const c = async (event) => {
    setComplete({
      ...complete,
      [event.target.id]: event.target.value.trim(),
    });
  };

  return (
    <div className="d-flex justify-content-center text-dark">
      <input
        className="w-100"
        type="text"
        list="list"
        id={props.id}
        autoComplete="off"
        onChange={handleInputChange}
      />

      <select
        className="form-select"
        aria-label="Default select example"
        onChange={(e) => {
          setData(e);
        }}
      >
        {cities.map((city) => {
          if (city.address.county) {
            return (
              <option key={city.place_id} value={city.place_id}>
                {city.address.name +
                  ", " +
                  city.address.county +
                  ", " +
                  city.address.country}
              </option>
            );
          } else {
            <option key={city.place_id} value={city.place_id}>
              {city.address.name + " ," + city.address.country}
            </option>;
          }
        })}
      </select>
    </div>
  );
};
