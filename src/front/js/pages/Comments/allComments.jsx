import React, { useEffect, useContext, useState } from "react";
import { Comment } from "../../component/Comments/comment.jsx";
import { Context } from "../../store/appContext";

export const AllComments = (props) => {
  const [comments, setComments] = useState([]);
  const { store, actions } = useContext(Context);

  useEffect(() => {
    getComments(props.item_id);
  }, []);

  const getComments = async () => {
    try {
      const opts = {
        headers: {
          Authorization: "Bearer " + localStorage.token,
        },
      };
      const resp = await fetch(
        process.env.BACKEND_URL +
          `/api/list${props.type}Comments/${props.item_id}`,
        opts
      );
      const data = await resp.json();
      debugger;

      setComments(data);

      return true;
    } catch (error) {
      console.error("There has been an error retrieving data");
    }
  };

  const newComment = async () => {
    const opts = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        comment: document.getElementById("comment").value,
        item_id: props.item_id,
      }),
    };
    try {
      const resp = await fetch(
        process.env.BACKEND_URL + `/api/list${props.type}Comments`,
        opts
      );
      if (resp.status !== 200) {
        alert("There has been an error during api call");
        return false;
      }
      const data = await resp.json();
      let aux = comments;
      debugger;
      setComments([data, ...comments]);

      aux = comments;
      return true;
    } catch (error) {
      console.error("There has been an error sending the comment");
    }
  };

  const handleSubmit = async () => {
    await newComment();
    document.getElementById("comment").value = null;
  };

  debugger;
  return (
    <div className="comment-container ">
      <div className="d-flex flex-column">
        <label htmlFor="comment" className="text-secondary hidden">
          Nuevo comentario
        </label>
        <textarea
          id="comment"
          className="justify-content-end"
          rows={3}
        ></textarea>
      </div>
      <button className="btn btn-success my-3" onClick={handleSubmit}>
        Guardar comentario
      </button>

      {comments.length && comments.length > 0 ? (
        comments.map((item, i) => <Comment item={item} key={i} />)
      ) : (
        <h3>No hay comentarios, se el primero!</h3>
      )}
    </div>
  );
};
