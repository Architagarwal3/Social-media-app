import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import "./Post.css";
import InstagramEmbed from "react-instagram-embed";

import EachPost from "./EachPost";

function Post({ user }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    db.collection("paths")
      .orderBy("timeStamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);

  return (
    <div className="app_post">
      <div className="app_postleft">
        {posts.map(({ id, post }) => {
          return (
            <EachPost
              key={id}
              postId={id}
              user={user}
              username={post.username}
              imageUrl={post.imageUrl}
              caption={post.caption}
            />
          );
        })}
      </div>
      <div className="app_postright">
        <InstagramEmbed
          url="https://instagr.am/p/Zw9o4/"
          maxWidth={320}
          hideCaption={false}
          containerTagName="div"
          protocol=""
          injectScript
          onLoading={() => {}}
          onSuccess={() => {}}
          onAfterRender={() => {}}
          onFailure={() => {}}
        />
      </div>
    </div>
  );
}

export default Post;
