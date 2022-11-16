import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Friends } from "../component/friends.jsx";
import { MyFriends } from "../component/myFriends.jsx";
import { Navbar } from "../component/navbar";
import { ShowPost } from "../component/post/showPosts";

const UserHome = () => {
  let navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/");
  }, []);

  return (
    <div className="home ">
      <Navbar />
      <div className="container">
        <div className="row finder-container w-0">
          <div className=" rigth-container">
            <Friends />

            <MyFriends />
          </div>

          <ShowPost />
        </div>{" "}
      </div>
    </div>
  );
};

export default UserHome;
