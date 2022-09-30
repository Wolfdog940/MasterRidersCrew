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

    signup: (valores) => {
        fetch(process.env.BACKEND_URL + "/api/signup", {
          method: "POST",
          body: JSON.stringify(valores),
          headers: {
            "Content-Type": "application/json",
          },
        }).then((resp) => {
          console.log(resp.ok); // Será true (verdad) si la respuesta es exitosa.
          console.log(resp.status); // el código de estado = 200 o código = 400 etc.
          return resp.json(); // (regresa una promesa) will try to parse the result as json as return a promise that you can .then for results
        });
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
