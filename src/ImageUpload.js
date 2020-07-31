import React, { useState } from "react";
import { storage, db } from "./firebase";
import firebase from "firebase";
import { Button } from "@material-ui/core";
import "./ImageUpload.css";

function ImageUpload({ username }) {
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [caption, setCaption] = useState("");

  const handleChange = (e) => {
    if (e.target.files[0]) setImage(e.target.files[0]);
  };

  const handleUpload = () => {
    const uploadTask = storage.ref(`image/${image.name}`).put(image);

    uploadTask.on(
      "state_changed",
      function (snapshot) {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      function (error) {
        alert(error.message);
      },
      function () {
        console.log("succes");
        storage
          .ref("image")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            db.collection("paths").add({
              timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
              imageUrl: url,
              username: username,
              caption: caption,
            });
            setProgress(0);
            setCaption("");
            setImage(null);
          });
      }
    );
  };

  return (
    <div className="imageupload">
      <progress className="imageupload_progress" value={progress} max="100" />
      <input
        type="text"
        placeholder="Enter the caption..."
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />
      <input type="file" onChange={handleChange} />
      <Button onClick={handleUpload}>Upload</Button>
    </div>
  );
}

export default ImageUpload;
