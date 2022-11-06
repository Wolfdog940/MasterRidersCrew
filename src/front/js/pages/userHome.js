import React from "react";
import { Navbar } from "../component/navbar";
import { ShowPost } from "../component/post/showPosts";

import { Weather } from "../component/weather.jsx";

const UserHome = () => {
  return (
    <div className="home">
      <Navbar />
      <ShowPost />
      <Weather />
    </div>
  );
};

export default UserHome;
