import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import "./EachPost.css";
import Avatar from "@material-ui/core/Avatar";
import firebase from "firebase";

function EachPost({ username, imageUrl, caption, postId, user }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("paths")
        .doc(postId)
        .collection("comments")
        .orderBy("timeStamp", "desc")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }
    return () => {
      unsubscribe();
    };
  }, [postId]);
  const postComment = (event) => {
    event.preventDefault();
    db.collection("paths").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
      timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment("");
  };

  return (
    <div className="post">
      <div className="post_header">
        <Avatar className="post_avatar" src="hjbhj" alt={username} />
        <h3 className="user_name">{username}</h3>
      </div>
      <img className="post_image" src={imageUrl} alt="mjn" />
      <h4 className="post_text">
        <strong>{username} </strong>
        {caption}
      </h4>

      <div className="post_comments">
        {comments.map((comment) => (
          <p>
            <strong>{comment.username} </strong>
            {comment.text}
          </p>
        ))}
      </div>
      {user && (
        <form className="post_commentbox">
          <input
            className="post_input"
            placeholder="Add a comment ..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            type="text"
          />
          <button
            className="post_button"
            onClick={postComment}
            disabled={!comment}
            type="submit"
          >
            Post
          </button>
        </form>
      )}
    </div>
  );
}

export default EachPost;
