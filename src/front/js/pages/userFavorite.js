import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "../component/navbar.js";
import AllFavoriteUserPosts from "../component/favorites/allFavoriteUserPosts.jsx";

const UserFavorite = () => {

  const {user_id} = useParams();
  const [user, setUser] = useState({});

  useEffect(()=>{
    if (!localStorage.getItem("token")) {
      navigate("/");
    }
    getFavoriteProfile(user_id);
  },[])

  const getFavoriteProfile = async (user_id) => {
    try {
      const resp = await fetch(
        process.env.BACKEND_URL + "/api/user/data/info/" + user_id,
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      const {data} = await resp.json();
      if (resp.status !== 200){
        alert("Peticion invalida/Invalid request");
        return false;
      }
      setUser(data);
      return true;
    } catch (error) {    }
  }

  return (
    <>
      <Navbar />
      <h2 className="text-white m-auto mt-2 text-center">
        Datos de tu favorito
      </h2>
      <div className="userContainer">
        <div className="userBackground"></div>
        <div className="userPhoto">
          {user.image ? (
            <img src={user.image} className="picture" />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="150"
              height="150"
              fill="currentColor"
              className="bi bi-person-circle"
              viewBox="0 0 16 16"
            >
              <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
              <path
                fillRule="evenodd"
                d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
              />
            </svg>
          )}
        </div>
        <div className="userData">
          <div className="userDescription d-flex justify-content-between">
            <div className="ms-4">
              <h3 className="text-secondary">{`${user.name} ${user.last_name}`}</h3>
              <p className="text-secondary">{user.address}</p>
            </div>
          </div>
        </div>
      </div>
      <h2 className="text-white m-auto text-center">Sus Posts</h2>
      <AllFavoriteUserPosts user_id={user_id} />
      {/* <AllEvents noNavBar={true} noParams={true} /> */}
    </>
  );
};

export default UserFavorite;
