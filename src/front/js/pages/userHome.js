import React from "react";
import { Navbar } from "../component/navbar";
import { ShowPost } from "../component/post/showPosts";
import SideBar from "../component/sidebar";

const UserHome = () => {
  return (
    <div className="home">
      <Navbar />

      <ShowPost />
    </div>
  );
};

export default UserHome;
