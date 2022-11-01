import React, { useContext, useEffect } from "react";
import { Context } from "../../store/appContext";
import "../../../styles/userPost.css";

const AllMyPosts = () => {
  const { store, actions } = useContext(Context);

  useEffect(() => {
    actions.getPostByUser();
  }, []);

  console.log(store.postByUser)
  return (
    <div className="postContainer d-flex flex-column">
      {store.postByUser ? 
        store.postByUser.map((post, index) => {
          <div className="card" key={index}>
            <img src={post.image} class="card-img-top"/>
            <div className="card-body">
              <p className="card-text">
                {post.text}
              </p>
              <p className="card-text">
                {post.date}
              </p>
            </div>
          </div>;
        })
       : 
        <p className="noPostAvailable">No hay posts disponibles</p>
      }
    </div>
  );
};

export default AllMyPosts;
