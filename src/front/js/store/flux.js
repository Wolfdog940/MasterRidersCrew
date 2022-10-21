const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      token: null,
      message: null,
      listaGrupos: [],
      allPosts: [],
      postByUser: []
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
          }
        } catch (error) {
          console.log("Error al loguear el usuario", error);
        }
      },

      getGrupos: async () => {
        try {
          const resp = await fetch(process.env.BACKEND_URL + "/api/group", {
            method: "GET",
            headers: {
              Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
          });
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
          const resp = await fetch(process.env.BACKEND_URL + '/api/all_posts', {
            method: 'GET',
            headers: { "content-type": "application/json", Authorization: 'Bearer ' + sessionStorage.getItem('token')}
          });
          const data = await resp.json();
          setStore({ allPosts: data });
          return data;
        } catch (error) {
          console.log('Error al obtener todos los posts', error);
        }
      },
      getPostByUser: async () => {
        // Obtiene todos los posts creados por el usuario actual logueado.
        try {
          const resp = await fetch(process.env.BACKEND_URL + '/api/all_user_posts', {
            method: 'GET',
            headers: {"content-type": "application/json", Authorization: 'Bearer ' + sessionStorage.getItem('token')}
          });
          const data = await resp.json();
          setStore({ postByUser: data });
          return data;
        } catch (error) {
          console.log('Error al obtener los posts del usuario actual', error);
        }
      },
      createPost: async(post) => {
        console.log('Post to create', post);
        console.log('Token', sessionStorage.getItem('token'));
        // Crea un nuevo post
        try {
          const resp = await fetch(process.env.BACKEND_URL + '/api/create_post', {
            method: 'POST',
            headers: { "content-type": "application/json", Authorization: 'Bearer ' + sessionStorage.getItem('token')},
            body: JSON.stringify(post)
          });
          const data = await resp.json();
          console.log('Se ha creado un post', data);
        } catch (error) {
          console.log('Error al crear un post', error);
        }
      },
      updatePost: async(post) => {
        // Actualiza o Edita un post
        try {
          const resp = await fetch(process.env.BACKEND_URL + '/api/update_post', {
            method: 'PUT',
            headers: {
              "content-type": "application/json",
              Authorization: 'Bearer ' + sessionStorage.getItem('token')
            },
            body: JSON.stringify(post)
          });
          const data = await resp.json();
          const actions = getActions();
          actions.getPosts();
          return data;
        } catch (error) {
          console.log('Error al actualizar un post', error);
        }
      },
      deletePost: async(post_id) => {
        // Elimina un post
        try {
          const resp = await fetch(process.env.BACKEND_URL + '/api/delete_post', {
            method: 'DELETE',
            headers: { "content-type": "application/json", Authorization: 'Bearer ' + sessionStorage.getItem('token')},
            body: JSON.stringify(post_id)
          });
          const data = await resp.json();
          return data;
        } catch (error) {
          console.log('Error al eliminar un post', error);
        }
      }
    },
  };
};

export default getState;
