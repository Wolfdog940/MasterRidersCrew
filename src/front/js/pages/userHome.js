import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Friends } from "../component/friends.jsx";
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

      <Friends />
      <ShowPost />
    </div>
  );
};

export default UserHome;
