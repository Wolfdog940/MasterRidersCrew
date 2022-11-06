import React, { useContext, useEffect } from "react";
import { Context } from "../../store/appContext";
import "../../../styles/userPost.css";

const AllMyPosts = () => {
  const { store, actions } = useContext(Context);

  useEffect(() => {
    actions.getPostByUser();
  }, []);

  const getEditForm = async (post) => {
    formToEdit.current = post;
    const textarea = document.getElementById('exampleFormControlTextareaEdit1');
    textarea.value = formToEdit.current.text;
  };

  console.log(store.postByUser)
  return (
    <ul className="listaPost">
      {store.postByUser && store.postByUser.length ? ( 
        store.postByUser.map((post, index)=>{
          return(
            <div className="post" key={index}>
              <div className="postText">
                <p className="text-white">{post.text}</p>
              </div>
              <img className="postImage" src={post.image}></img>
              <p className="text-white">{post.date}</p>
            </div>
          )
        }) 
      ) : (
        <p>Nada que mostrar</p>
      )
      }
    </ul>
  );
};


export default AllMyPosts;
