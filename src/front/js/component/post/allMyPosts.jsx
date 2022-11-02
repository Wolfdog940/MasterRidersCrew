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
      {store.postByUser ? ( 
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
    {/* <div className="postContainer d-flex flex-column">
      {store.postByUser ? 
        store.postByUser.map((post, index) =>(
          <div className="userPost m-2 p-2" key={index}>
            <div className="textPost">
              <p className="text-white">
                {post.text}
              </p>
              <p className="text-white">
                {post.date}
              </p>
            </div>
            {post.image ?
              (<div className="imgContainer pb-4">
                <img src={post.image} class="imgPost"/>
                <hr className="text-white"></hr>
              </div>):null
            }
          </div>
        ))
       : 
        <p className="noPostAvailable">No hay posts disponibles</p>
      }
    </div> */}


export default AllMyPosts;
