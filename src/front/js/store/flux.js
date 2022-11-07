const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      token: null,
      event: {},
      allEvents: [],
      allEventsLength: null,
      allPublicEvents: [],
      allPublicEventsLength: null,
      userEventParticipation: [],
      message: null,
      listaGrupos: [],
      allPosts: [],
      maxPosts: false,
      postByUser: [],
      userData: {},
      profilePicture: null,
      userImages: [],
      amountUserImage: null, //devuelve la cantidad de imagenes que tiene el usuario
      topImagePerPage: 6,
      newsPage: [],
      citys: [],
      nextPage: 0,
      originCoords: { lon: null, lat: null },
      destinationCoords: { lon: null, lat: null },
    },
    actions: {
      setOriginCoords: (lon, lat) => {
        setStore({ originCoords: { lon: lon, lat: lat } });
      },
      setDestinationCoords: (lon, lat) => {
        setStore({ destinationCoords: { lon: lon, lat: lat } });
      },
      signup: (valores) => {
        fetch(process.env.BACKEND_URL + "/api/signup", {
          method: "POST",
          body: JSON.stringify(valores),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((resp) => {
            return resp.json(); // (regresa una promesa) will try to parse the result as json as return a promise that you can .then for results
          })
          .then((data) => {
            getActions().setProfile(valores, data.id);
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
            localStorage.setItem("token", data.token);
            localStorage.setItem("user_id", data.user_id);
            setStore({ token: data.token });
            getActions().getProfile(data.token);
          }
        } catch (error) {
          console.log("Error al loguear el usuario", error);
        }
      },

      borrar_token: async () => {
        const store = getStore();
        try {
          localStorage.removeItem("token");
          localStorage.removeItem("user_id");
          setStore({ token: null });
        } catch (error) {
          console.log("Error al deslogear el usuario", error);
        }
      },

      getGrupos: async () => {
        try {
          const resp = await fetch(
            process.env.BACKEND_URL + "/api/user/group",
            {
              method: "GET",
              headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
              },
            }
          );
          const data = await resp.json();
          if (resp.status === 401) throw new Error(data.msg);
          else if (resp.status !== 200) throw new Error("Ingreso Invalido");
          else if (resp.status === 200) {
            let grupos = data.data;
            setStore({
              listaGrupos: grupos.map((g) => g.name),
            });
          }
        } catch (error) {
          console.log("Error al cargar lista de grupos", error);
        }
      },
      updateMaxPosts: async () => {
        setStore({ maxPosts: false });
      },
      getPosts: async (page, per_page) => {
        // Obtiene todos los posts
        try {
          const resp = await fetch(
            process.env.BACKEND_URL + `/api/all_posts/${page}/${per_page}`,
            {
              method: "GET",
              headers: {
                "content-type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token"),
              },
            }
          );
          const data = await resp.json();
          setStore({ allPosts: data });
          return data;
        } catch (error) {
          setStore({ maxPosts: true });
        }
      },
      getPostByUser: async () => {
        // Obtiene todos los posts creados por el usuario actual logueado.
        try {
          const resp = await fetch(
            process.env.BACKEND_URL + "/api/all_user_posts",
            {
              method: "GET",
              headers: {
                "content-type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token"),
              },
            }
          );
          const data = await resp.json();
          setStore({ postByUser: data });
          return data;
        } catch (error) {
          console.log("Error al obtener los posts del usuario actual", error);
        }
      },
      createPost: async (post) => {
        try {
          const resp = await fetch(
            process.env.BACKEND_URL + "/api/create_post",
            {
              method: "POST",
              headers: {
                "content-type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token"),
              },
              body: JSON.stringify(post),
            }
          );
          const data = await resp.json();
        } catch (error) {
          console.log("Error al crear un post", error);
        }
      },
      updatePost: async (post) => {
        // Actualiza o Edita un post
        try {
          const resp = await fetch(
            process.env.BACKEND_URL + "/api/update_post",
            {
              method: "PUT",
              headers: {
                "content-type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token"),
              },
              body: JSON.stringify(post),
            }
          );
          const data = await resp.json();
          const actions = getActions();
          actions.getPosts();
          return data;
        } catch (error) {
          console.log("Error al actualizar un post", error);
        }
      },
      deletePost: async (post_id) => {
        // Elimina un post
        try {
          const resp = await fetch(
            process.env.BACKEND_URL + "/api/delete_post",
            {
              method: "DELETE",
              headers: {
                "content-type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token"),
              },
              body: JSON.stringify(post_id),
            }
          );
          const data = await resp.json();
          return data;
        } catch (error) {
          console.log("Error al eliminar un post", error);
        }
      },
      newEvent: async (name, start, end, description, date, hours, minutes) => {
        let store = getStore();
        date = date.toString().slice(0, 15);
        const opts = {
          method: "POST",
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify({
            name: name,
            start: start,
            end: end,
            description: description,
            date: date,
            origin_lon: store.originCoords.lon,
            origin_lat: store.originCoords.lat,
            destination_lon: store.destinationCoords.lon,
            destination_lat: store.destinationCoords.lat,
            hours: hours,
            minutes: minutes,
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

      deleteEvent: async (id) => {
        const opts = {
          method: "DELETE",
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        };
        try {
          const resp = await fetch(
            process.env.BACKEND_URL + "/api/event/" + id,
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

      editEvent: async (
        name,
        start,
        end,
        description,
        date,
        hours,
        minutes
      ) => {
        const opts = {
          method: "PUT",
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify({
            name: name,
            start: start,
            end: end,
            description: description,
            date: date,
            hours: hours,
            minutes: minutes,
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
      editEventMap: async (map, id) => {
        const opts = {
          method: "PUT",
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify({
            map: map,
          }),
        };
        try {
          const resp = await fetch(
            process.env.BACKEND_URL + "/api/eventmap/" + id,
            opts
          );
          if (resp.status !== 200) {
            alert("There has been an error during api call");
            return false;
          }
          const data = await resp.json();
          setStore({ event: data });
          return data;
        } catch (error) {
          console.error("There has been an error sending the post");
        }
      },
      getEvent: async (eventId) => {
        const opts = {
          headers: {
            Authorization: "Bearer " + localStorage.token,
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
      getEvents: async (page, per_page) => {
        const opts = {
          headers: {
            Authorization: "Bearer " + localStorage.token,
          },
        };
        try {
          const resp = await fetch(
            process.env.BACKEND_URL + "/api/events/" + page + "/" + per_page,
            opts
          );
          const data = await resp.json();
          setStore({ allEvents: null });
          setStore({ allEventsLength: null });
          setStore({ allEvents: data[0] });
          setStore({ allEventsLength: data[1] });
          return data;
        } catch (error) {
          console.error("There has been an error retrieving data");
        }
      },

      getPublicEvents: async (page, per_page) => {
        const opts = {
          headers: {
            Authorization: "Bearer " + localStorage.token,
          },
        };
        try {
          const resp = await fetch(
            process.env.BACKEND_URL +
              "/api/publicevents/" +
              page +
              "/" +
              per_page,
            opts
          );
          const data = await resp.json();
          setStore({ allPublicEvents: null });
          setStore({ allPublicEventsLength: null });
          setStore({ allPublicEvents: data[0] });
          setStore({ allPublicEventsLength: data[1] });
          return data;
        } catch (error) {
          console.error("There has been an error retrieving data");
        }
      },

      joinEvent: async (event_id) => {
        const opts = {
          method: "POST",
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify({
            event_id: event_id,
          }),
        };
        try {
          const resp = await fetch(
            process.env.BACKEND_URL + "/api/joinevent",
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

      listEvents: async () => {
        const opts = {
          headers: {
            Authorization: "Bearer " + localStorage.token,
          },
        };
        try {
          const resp = await fetch(
            process.env.BACKEND_URL + "/api/myevents/",
            opts
          );
          const data = await resp.json();
          setStore({ userEventParticipation: data });
          return data;
        } catch (error) {
          console.error("There has been an error retrieving data");
        }
      },

      unsubscribeEvent: async (id) => {
        const opts = {
          method: "DELETE",
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify({
            event_id: id,
          }),
        };
        try {
          const resp = await fetch(
            process.env.BACKEND_URL + "/api/unsubscribeevent/",
            opts
          );
          const data = await resp.json();
          return data;
        } catch (error) {
          console.error("There has been an error retrieving data");
        }
      },

      searchEvent: (id) => {
        var store = getStore();
        for (var i = 0; i < store.userEventParticipation.length; i++) {
          if (store.userEventParticipation[i]["event_id"] == id) {
            return true;
          }
        }
        return false;
      },

      createGroup: (valores) => {
        fetch(process.env.BACKEND_URL + "/api/group", {
          method: "POST",
          body: JSON.stringify(valores),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
          .then((resp) => {
            return resp.json();
          })
          .catch((error) => {
            console.log("Error al registar el grupo", error);
          });
      },
      setProfile: async (valores, id) => {
        try {
          const resp = await fetch(
            process.env.BACKEND_URL + "/api/user/" + id + "/data",
            {
              method: "POST",
              headers: {
                "content-type": "application/json",
              },
              body: JSON.stringify(valores),
            }
          );
          const data = await resp.json();
          if (resp.status === 200) setStore({ userData: data });
          else throw new Error("No se pudo actualizar/Unable to update");
        } catch (error) {
          console.log("Peticion invalida/Invalid request");
        }
      },
      getProfilePicture: async (id) => {
        try {
          const resp = await fetch(
            process.env.BACKEND_URL + "/api/user/image/" + id,
            {
              method: "GET",
              headers: {
                "content-type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token"),
              },
            }
          );
          const { data } = await resp.json();
          if (resp.status === 400) throw new Error(data.msg);
          else if (resp.status !== 200) throw new Error("Invalid Request");
          else if (resp.status === 200) {
            setStore({ profilePicture: data.image });
            return data.image;
          }
        } catch (error) {
          console.log(error);
        }
      },
      getProfile: async () => {
        try {
          const resp = await fetch(
            process.env.BACKEND_URL + "/api/user/data/info",
            {
              method: "GET",
              headers: {
                "content-type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token"),
              },
            }
          );
          const data = await resp.json();
          if (resp.status === 400) {
            alert("Todavia no guardaste tus datos, por favor, llenalos ahora");
            throw new Error(data.msg);
          } else if (resp.status !== 200)
            throw new Error("Peticion invalida/Invalid request");
          else if (resp.status === 200) setStore({ userData: data });
          if (data.profile_picture)
            getActions().getProfilePicture(data.profile_picture);
        } catch (error) {
          console.log(error);
        }
      },
      updateProfile: async (datos) => {
        try {
          const resp = await fetch(
            process.env.BACKEND_URL + "/api/user/data/update",
            {
              method: "PUT",
              headers: {
                "content-type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token"),
              },
              body: JSON.stringify(datos),
            }
          );
          const data = await resp.json();
          if (resp.status === 200) {
            setStore({ userData: data });
            return true;
          } else return false; 
        } catch (error) {
          console.log(error);
        }
      },

      uploadImage: async (image) => {
        try {
          const resp = await fetch(
            process.env.BACKEND_URL + "/api/user/image",
            {
              method: "POST",
              headers: {
                "content-type": "application/json",
                authorization: "Bearer " + localStorage.getItem("token"),
              },
              body: JSON.stringify(image),
            }
          );
          const { data } = await resp.json();
          if (resp.status !== 200) throw new Error(data.msg);
          else return data.id;
        } catch (error) {
          console.log("Peticion invalida/Invalid request");
        }
      },
      getImages: async (page) => {
        try {
          const resp = await fetch(
            process.env.BACKEND_URL + "/api/user/images/" + page + "/" + 6,
            {
              headers: {
                "content-type": "application/json",
                authorization: "Bearer " + localStorage.getItem("token"),
              },
            }
          );
          const data = await resp.json();
          if (resp.status !== 200) return false;
          else if (resp.status === 200) {
            setStore({ userImages: data[0] });
            setStore({ amountUserImage: data[1] });
            return true;
          }
        } catch (error) {
          console.log("Peticion Invalida/Invalid Request ", error);
        }
      },

      getImagePost: async (id) => {
        try {
          const resp = await fetch(
            process.env.BACKEND_URL + "/api/user/image/" + id,
            {
              method: "GET",
              headers: {
                "content-type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token"),
              },
            }
          );
          const { data } = await resp.json();
          if (resp.status === 400) throw new Error(data.msg);
          else if (resp.status !== 200) throw new Error("Invalid Request");
          else if (resp.status === 200) {
            return data.image;
          }
        } catch (error) {
          console.log(error);
        }
      },

      setNews: async () => {
        try {
          const resp = await fetch(
            "https://newsdata.io/api/1/news?apikey=pub_12812043094206f09e194256f1427c4d0a498&country=es&category=sports,entertainment&page=" +
              getStore().nextPage
          );
          const data = await resp.json();

          if (resp.status === 200) {
            data.results.map((item, i) => {
              const allnews = getStore().newsPage;
              setStore({ newsPage: [...allnews, item] });
            });

            setStore({ nextPage: data.nextPage });
          } else {
            throw new Error("No se pudo actualizar/Unable to update");
          }
        } catch (error) {
          console.log("Peticion invalida/Invalid request");
        }
      },

      getWeather: async () => {
        try {
          const resp = await fetch(
            "https://api.weatherstack.com/current?access_key=03c7127b5e1f869eba59e725b42f3753&query=New%20York"
          );
          const data = await resp.json();

          if (resp.status === 200) {
            setStore({ weather: data.current });
          } else {
            throw new Error("No se pudo actualizar/Unable to update");
          }
        } catch (error) {
          console.log("Peticion invalida/Invalid request");
        }
      },
    },
  };
};

export default getState;
