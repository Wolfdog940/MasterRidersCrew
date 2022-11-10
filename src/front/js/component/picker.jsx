import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import es from "date-fns/locale/es";
registerLocale("es", es);

export const Picker = () => {
  const [startDate, setStartDate] = useState(null);
 /*  let lastDate = Date.now() + Number.MAX_SAFE_INTEGER; */

  return (
    <DatePicker
      selected={startDate}
      onChange={(date) => setStartDate(date)}
      /* minDate={new Date()} */
      /* maxDate={lastDate} */
      dateFormat="dd/MM/yyy"
      locale="es"
      placeholderText="Seleciona una fecha"
    />
  );
};
