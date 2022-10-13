import React from "react";
import { Navbar } from "../component/navbar";
import SideBar from "../component/sidebar";

const UserHome = () => {
  return (
    <div className="home ">
      <Navbar />
      <SideBar />
    </div>
  );
};

export default UserHome;
