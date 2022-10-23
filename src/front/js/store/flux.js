const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      token: null,
      message: null,
      listaGrupos: [],
      userData: {},
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
        try{
          const resp = await fetch(process.env.BACKEND_URL + "/api/user/image", {
            method: 'POST',
            headers: {
              "content-type": "application/json",
              "authorization": "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify(image)
          });
          const data = await resp.json();
          if (resp.status !== 200)
            throw new Error(data.msg);
          else console.log(data.msg);
        }
        catch(error){
          console.log("Peticion invalida/Invalid request");
        }
      },
      getProfilePicture: async (id)=>{
        try{
          const resp = await fetch(process.env.BACKEND_URL + '/api/user/image/' + id,{
            method: 'GET',
            headers: {
              "content-type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token")
            }
          });
          const {data} = await resp.json();
          if (resp.status === 400) 
            console.log(data.msg)//throw new Error(data.msg);
          else if (resp.status !== 200) 
            console.log("otro problema")//throw new Error("Invalid Request");
          else if (resp.status === 200){
            return data.image;
          }
        }
        catch (error){
          console.log("Invalid Request", error)
        }
      },
      getProfile: async (token) => {
        try{
          const resp = await fetch(process.env.BACKEND_URL + "/api/user/data/info", {
            method: "GET",
            headers: {
              "content-type": "application/json",
              Authorization: `Bearer ${token ? token : localStorage.getItem("token")}`
            }
          });
          const data = await resp.json();
          if (resp.status === 400){
            alert("Todavia no guardaste tus datos, por favor, llenalos ahora");
            throw new Error(data.msg)
          }
          else if (resp.status !== 200)
            throw new Error("Peticion invalida/Invalid request")
          else if (resp.status === 200)
            setStore({userData: data});
        }
        catch (error){
          console.log(error);
        }
      },
      updateProfile: async (datos) => {
        try{
          const resp = await fetch(process.env.BACKEND_URL + "/api/user/data/update", {
            method: 'PUT',
            headers:{
              "content-type": "application/json",
              "Authorization": "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify(datos)
          });
          const data = await resp.json();
          if (resp.status === 200){
            setStore({userData: data})
            alert("Los datos se actualizaron correctamente")
          }
          else throw new Error("Invalid Update")
        }
        catch(error){
          console.log(error);
        }
      }
    },
  };
};

export default getState;
