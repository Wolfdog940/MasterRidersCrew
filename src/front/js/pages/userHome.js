import React from "react";
import { Navbar } from "../component/navbar";
import { ShowPost } from "../component/post/showPosts";
import { AutoComplete } from "../component/autocomplete.jsx";

const UserHome = () => {
  return (
    <div className="home">
      <Navbar />
      <ShowPost />
    </div>
  );
};

export default UserHome;
