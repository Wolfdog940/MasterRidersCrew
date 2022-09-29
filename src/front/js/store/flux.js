const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			token: null,
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			]
		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			getMessage: async () => {
				try{
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				}catch(error){
					console.log("Error loading message from backend", error)
				}
			},
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			},
			loguearUsuario: async(datos) => {
				try{
					const resp = await fetch(process.env.BACKEND_URL + "/api/login" , {
						method: 'POST',
						headers: {
							"content-type": "application/json"
						},
						body: JSON.stringify(datos)
					});
					const data = await resp.json();
					if (resp.status === 401)
						throw new Error(data.msg);
					else if (resp.status !== 200)
						throw new Error("Ingreso Invalido");
					else if (resp.status === 200){
						sessionStorage.setItem("token", data.token);
						sessionStorage.setItem("user_id", data.user_id);
						setStore({token: data.token})
					}
				}
				catch (error) {
					console.log("Error al loguear el usuario", error);
				}
			}
		}
	};
};

export default getState;
