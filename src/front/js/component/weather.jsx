import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";

export const Weather = (props) => {
  const { store, actions } = useContext(Context);
  const [dailyweather, setdailyWeather] = useState();

  useEffect(() => {
    getWeather();
  }, []);

  const getWeather = async () => {
    try {
      const resp = await fetch(
        "https://api.weatherstack.com/current?access_key=03c7127b5e1f869eba59e725b42f3753&query=" +
          props.lat +
          "," +
          props.long
      );
      const data = await resp.json();

      if (resp.status === 200) {
        setdailyWeather(data.current);
        console.log(data);
        console.log(getStore().weather);
      } else {
        throw new Error("No se pudo actualizar/Unable to update");
      }
    } catch (error) {
      console.log("Peticion invalida/Invalid request");
    }
  };

  return (
    <div>
      {/* <img src={dailyweather.weather_icons} />
      <div>{dailyweather.temperature + "º" + "C"}</div> */}
    </div>
  );
};
