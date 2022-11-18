import React, { useState, useEffect, useContext } from "react";
import { Context } from "../../store/appContext";


const AllFavoriteUserPosts = ({ user_id }) => {
    const{ actions } = useContext(Context);
  const [allPosts, setAllPosts] = useState(null);

  useEffect(() => {
    let posts = null;
    let asyncPost = async () => posts = await actions.getPostsSpecificUser(user_id);
    asyncPost();
    setAllPosts(posts);
  }, []);

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
