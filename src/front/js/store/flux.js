const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      token: null,
      event: {},
      message: null,
      listaGrupos: [],
      demo: [
        {
          title: "FIRST",
          background: "white",
          initial: "white",
        },
        {
          title: "SECOND",
          background: "white",
          initial: "white",
        },
      ],
    },
    actions: {
      signup: (valores) => {
        fetch(process.env.BACKEND_URL + "/api/signup", {
          method: "POST",
          body: JSON.stringify(valores),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((resp) => {
            console.log(resp.ok); // Será true (verdad) si la respuesta es exitosa.
            console.log(resp.status); // el código de estado = 200 o código = 400 etc.
            console.log(process.env.BACKEND_URL);
            return resp.json(); // (regresa una promesa) will try to parse the result as json as return a promise that you can .then for results
          })
          .catch((error) => {
            console.log("Error al registar el usuario", error);
          });
      },

      loguearUsuario: async (datos) => {
        try {
          const resp = await fetch(process.env.BACKEND_URL + "/api/login", {
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify(datos),
          });
          const data = await resp.json();

          if (resp.status === 401) throw new Error(data.msg);
          else if (resp.status !== 200) throw new Error("Ingreso Invalido");
          else if (resp.status === 200) {
            sessionStorage.setItem("token", data.token);
            sessionStorage.setItem("user_id", data.user_id);
            setStore({ token: data.token });
            console.log(store.token);
          }
        } catch (error) {
          console.log("Error al loguear el usuario", error);
        }
      },

      getGrupos: async () => {
        try {
          const resp = await fetch(
            process.env.BACKEND_URL + "/api/user/group",
            {
              method: "GET",
              headers: {
                Authorization: "Bearer " + sessionStorage.getItem("token"),
              },
            }
          );
          const data = await resp.json();
          if (resp.status === 401) throw new Error(data.msg);
          else if (resp.status !== 200) throw new Error("Ingreso Invalido");
          else if (resp.status === 200) {
            let grupos = data.data;
            console.log(grupos);
            setStore({
              listaGrupos: grupos.map((g) => g.name),
            });
          }
        } catch (error) {
          console.log("Error al cargar lista de grupos", error);
        }
      },

      newEvent: async (name, start, end, description, date) => {
        const opts = {
          method: "POST",
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
          body: JSON.stringify({
            name: name,
            start: start,
            end: end,
            description: description,
            date: date,
          }),
        };
        try {
          const resp = await fetch(
            process.env.BACKEND_URL + "/api/event",
            opts
          );
          if (resp.status !== 200) {
            alert("There has been an error during api call");
            return false;
          }
          const data = await resp.json();
          return data;
        } catch (error) {
          console.error("There has been an error sending the post");
        }
      },

      editEvent: async (name, start, end, description, date) => {
        const opts = {
          method: "PUT",
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
          body: JSON.stringify({
            name: name,
            start: start,
            end: end,
            description: description,
            date: date,
          }),
        };
        try {
          const resp = await fetch(
            process.env.BACKEND_URL + "/api/event",
            opts
          );
          if (resp.status !== 200) {
            alert("There has been an error during api call");
            return false;
          }
          const data = await resp.json();
          return data;
        } catch (error) {
          console.error("There has been an error sending the post");
        }
      },
      getEvent: async (eventId) => {
        const opts = {
          headers: {
            Authorization: "Bearer " + sessionStorage.token,
          },
        };
        try {
          const resp = await fetch(
            process.env.BACKEND_URL + "/api/event/" + eventId,
            opts
          );
          const data = await resp.json();
          setStore({ event: data });
          return data;
        } catch (error) {
          console.error("There has been an error retrieving data");
        }
      },
    },
  };
};

export default getState;
