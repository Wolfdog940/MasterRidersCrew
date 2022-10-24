const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      token: null,
      event: {},
      message: null,
      listaGrupos: [],
      allPosts: [],
      postByUser: [],
      userData: {},
      newsPage: [],
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
            console.log(store.token);
          }
        } catch (error) {
          console.log("Error al loguear el usuario", error);
        }
      },

      borrar_token: async () => {
        const store = getStore();
        try {
          await fetch(process.env.BACKEND_URL + "/api/logout", {
            method: "DELETE",
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
              "content-type": "application/json",
            },
          });
          if (store.token != null) {
            localStorage.removeItem("token");
            localStorage.removeItem("user_id");
            setStore({ token: null });
          }
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
      setNews: async () => {
        try {
          const resp = await fetch(
            "https://newsdata.io/api/1/news?apikey=pub_12662c51012f03b6663b59439e464384b6845&country=es&category=sports,entertainment"
          );
          const data = await resp.json();
          if (resp.status === 200) {
            setStore({ newsPage: data.results });
          } else throw new Error("No se pudo actualizar/Unable to update");
        } catch (error) {
          console.log("Peticion invalida/Invalid request");
        }
      },
    },
  };
};

export default getState;
