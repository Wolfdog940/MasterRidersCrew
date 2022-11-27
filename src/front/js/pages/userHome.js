import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Friends } from "../component/friends.jsx";
import { MyFriends } from "../component/myFriends.jsx";
import { Navbar } from "../component/navbar";
import { ShowPost } from "../component/post/showPosts";
import { Context } from "../store/appContext.js";

const UserHome = () => {
  const {store, actions} = useContext(Context);
  let navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/");
    actions.getFriends();
  }, []);

  return (
    <div className="home ">
      <Navbar />
      <div className="container">
        <div className="row bigRow">
            <div className="col-3 g-0">
              <Friends />
              <MyFriends />
            </div>
            <div className="col-9">
              <ShowPost />
            </div>
        </div>
        <div className="smallRow">
          <Friends />
          <MyFriends />
          <ShowPost />
        </div>
      </div>
    </div>
  );
};

export default UserHome;
