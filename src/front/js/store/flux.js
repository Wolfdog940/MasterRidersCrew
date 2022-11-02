const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      token: null,
      event: {},
      allEvents: [],
      allEventsLength: null,
      allPublicEvents: [],
      allPublicEventsLength: null,
      message: null,
      listaGrupos: [],
      allPosts: [],
      postByUser: [],
      userData: {},
      profilePicture: null,
      newsPage: [],
      nextPage: 0,

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
          /* await fetch(process.env.BACKEND_URL + "/api/logout", {
            method: "DELETE",
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
              "content-type": "application/json",
            },
          }); */
          /* if (store.token != null) { */
          localStorage.removeItem("token");
          localStorage.removeItem("user_id");
          setStore({ token: null });
          /* } */
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
            console.log(grupos);
            setStore({
              listaGrupos: grupos.map((g) => g.name),
            });
          }
        } catch (error) {
          console.log("Error al cargar lista de grupos", error);
        }
      },
      getPosts: async () => {
        // Obtiene todos los posts
        try {
          const resp = await fetch(process.env.BACKEND_URL + "/api/all_posts", {
            method: "GET",
            headers: {
              "content-type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          });
          const data = await resp.json();
          setStore({ allPosts: data });
          return data;
        } catch (error) {
          console.log("Error al obtener todos los posts", error);
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
        console.log("Post to create", post);
        console.log("Token", localStorage.getItem("token"));
        // Crea un nuevo post
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
          console.log("Se ha creado un post", data);
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
      newEvent: async (name, start, end, description, date) => {
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
            Authorization: "Bearer " + localStorage.getItem("token"),
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
          debugger;
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
          debugger;
          return data;
        } catch (error) {
          console.error("There has been an error retrieving data");
        }
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
            console.log(resp.ok); // Será true (verdad) si la respuesta es exitosa.
            console.log(resp.status); // el código de estado = 200 o código = 400 etc.
            console.log(process.env.BACKEND_URL);
            return resp.json(); // (regresa una promesa) will try to parse the result as json as return a promise that you can .then for results
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
          if (resp.status === 400) console.log(data.msg);
          //throw new Error(data.msg);
          else if (resp.status !== 200) console.log("otro problema");
          //throw new Error("Invalid Request");
          else if (resp.status === 200) {
            setStore({ profilePicture: data.image });
            return data.image;
          }
        } catch (error) {
          console.log("Invalid Request", error);
        }
      },
      getProfile: async (token) => {
        try {
          const resp = await fetch(
            process.env.BACKEND_URL + "/api/user/data/info",
            {
              method: "GET",
              headers: {
                "content-type": "application/json",

                Authorization: `Bearer ${
                  token ? token : localStorage.getItem("token")
                }`,


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
            //alert("Los datos se actualizaron correctamente")
          } else return false; //throw new Error("Invalid Update")
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
    },
  };
};

export default getState;
