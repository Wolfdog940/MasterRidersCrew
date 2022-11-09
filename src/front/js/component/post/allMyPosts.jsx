import React, { useContext, useEffect } from "react";
import { Context } from "../../store/appContext";
import "../../../styles/userPost.css";

const AllMyPosts = () => {
  const { store, actions } = useContext(Context);

  useEffect(() => {
    actions.getPostByUser();
  }, []);

  return (
    <ul className="listaPost">
      {store.postByUser && store.postByUser.length ? (
        store.postByUser.map((post, index) => {
          return (
            <div className="post" key={index}>
              <div className="postText">
                <p>{post.text}</p>
              </div>
              <img className="postImage" src={post.image}></img>
              <p className="text-secondary text-end mt-4">{post.date}</p>
            </div>
          );
        })
      ) : (
        <p>Nada que mostrar</p>
      )}
    </ul>
  );
};

export default AllMyPosts;
