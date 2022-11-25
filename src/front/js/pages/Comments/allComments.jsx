import React, { useEffect, useContext, useState } from "react";
import { Comment } from "../../component/Comments/comment.jsx";
import { Context } from "../../store/appContext";
import "../../../styles/allComments.css"

export const AllComments = (props) => {
  const [comments, setComments] = useState([]);
  const { store, actions } = useContext(Context);

  useEffect(() => {
    let synchEffect = async () => {
      await getComments(props.item_id);
    };
    synchEffect();
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
        comment: document.querySelector(`#comment${props.item_id}`).value,
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
      setComments([data, ...comments]);
      return true;
    } catch (error) {
      console.error("There has been an error sending the comment");
    }
  };

  const handleSubmit = async () => {
    await newComment();
    document.getElementById(`comment${props.item_id}`).value = null;
  };

  return (
    <div className="comment-container ">
      <div className="d-flex flex-column">
        <label htmlFor="comment" className="text-secondary hidden">
          Nuevo comentario
        </label>
        <textarea
          id={`comment${props.item_id}`}
          className="justify-content-end text-area-comment"
          rows={2}
        ></textarea>
      </div>
      <button className="btn btn-outline-success my-3 rounded-pill enterBtn" onClick={handleSubmit}>
        Guardar comentario
      </button>
      <button
        className="btn btn-outline-secondary ms-2 rounded-pill showBtn"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target={"#collapseComments"+props.item_id}
        aria-expanded="false"
        aria-controls="collapseComments"
      >
        Comentarios 
      </button>
      <div className="collapse" id={"collapseComments"+props.item_id}>
        {comments.length && comments.length > 0 ? (
          comments.map((item, i) => <Comment item={item} key={i} />)
        ) : (
          <h3>No hay comentarios, se el primero!</h3>
        )}
      </div>
    </div>
  );
};
