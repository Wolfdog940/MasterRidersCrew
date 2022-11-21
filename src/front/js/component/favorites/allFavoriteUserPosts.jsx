import React, { useState, useEffect, useContext } from "react";
import { Context } from "../../store/appContext";
import { AllComments } from "../../pages/Comments/allComments.jsx";


const AllFavoriteUserPosts = ({ user_id }) => {
    const{ actions } = useContext(Context);
  const [allPosts, setAllPosts] = useState(null);

  const asyncPost = async () => setAllPosts(await actions.getPostsSpecificUser(user_id))

  useEffect(() => {
    asyncPost();
  }, []);
  
  console.log(allPosts)
  return (
    <ul className="listaPost">
      {allPosts && allPosts.length ? (
        allPosts.map((post, index) => {
          return (
            <div className="post" key={index}>
              <div className="postText">
                <p>{post.text}</p>
              </div>
              <img className="postImage" src={post.image}></img>
              <p className="text-secondary text-end mt-4">{post.date}</p>
              <AllComments item_id={post.id} type="Post" />
            </div>
          );
        })
      ) : (
        <p>Nada que mostrar</p>
      )}
    </ul>
  );
};

export default AllFavoriteUserPosts;
