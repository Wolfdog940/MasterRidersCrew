import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";

export const AutoComplete = () => {
  const [complete, setComplete] = useState("");
  const { store, actions } = useContext(Context);

  /*  useEffect(() => {
    setComplete(actions.getCitys());
  }, [store.citys]); */

  const handleInputChange = (event) => {
    setComplete({
      ...complete,

      [event.target.id]: event.target.value.trim(),
    });
    actions.getCitys(complete.city);
  };

  return (
    <div className="pt-5 mt-5 d-flex justify-content-center text-dark">
      <input type="text" id="city" list="list" onChange={handleInputChange} />
      {console.log(complete.city)}
      {/* {console.log(store.citys)} */}

      <datalist id="list">
        {store?.citys.map((city, index) => {
          if (city.address.county) {
            return (
              <option
                key={index}
                value={
                  city.address.name +
                  " " +
                  city.address.county +
                  " " +
                  city.address.country
                }
              ></option>
            );
          }

          return;
          <option
            key={index}
            value={city.address.name + " " + city.address.country}
          ></option>;
        })}
      </datalist>
    </div>
  );
};
