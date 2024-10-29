import { useState } from "react";
import axios from "axios";
import {env} from '../utils/env'
import "../css/uploadGame.css";

function UploadGame() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [categories, setCategories] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [gameFile, setGameFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingMessage, setUploadingMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const validateFileExtensions = () => {
    if (gameFile && !gameFile.name.endsWith(".swf")) {
      setErrorMessage("The game file must be in .swf format.");
      return false;
    }

    if (
      imageFile &&
      ![".jpg", ".jpeg", ".png", ".webp"].some(ext =>
        imageFile.name.toLowerCase().endsWith(ext)
      )
    ) {
      setErrorMessage(
        "The image file must be in .jpg, .jpeg, .png, or .webp format."
      );
      return false;
    }

    setErrorMessage("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFileExtensions()) {
      return;
    }

    setIsSubmitting(true);
    setUploadingMessage("UPLOADING...");

    const keywordsArray = keywords.split(",").map((keyword) => keyword.trim());
    const categoriesArray = categories.split(",").map((category) => category.trim());

    const formData = new FormData();
    formData.append("gameName", name);
    formData.append("gameDescription", description);
    keywordsArray.forEach((keyword) => formData.append("gameKeywords", keyword));
    categoriesArray.forEach((category) => formData.append("gameCategory", category));

    if (gameFile) formData.append("gameFile", gameFile);
    if (imageFile) formData.append("image", imageFile);

    try {
      const response = await axios.post(
        `${env.SERVER}/admin/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      setResponseMessage(response.data.message);
    } catch (error) {
      setResponseMessage(
        error.response
          ? error.response.data.message
          : "Error submitting the form"
      );
    } finally {
      setIsSubmitting(false);
      setUploadingMessage("");
    }
  };

  return (
    <form className="upload-game" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Game Name:</label>
        <input
          id="name"
          type="text"
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter game name"
          required
          disabled={isSubmitting}
        />
      </div>
      <div className="form-group">
        <label htmlFor="description">Game Description:</label>
        <textarea
          id="description"
          className="form-control"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description"
          required
          disabled={isSubmitting}
        />
      </div>
      <div className="form-group">
        <label htmlFor="keywords">Keywords:</label>
        <textarea
          id="keywords"
          className="form-control"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="Enter keywords separated by commas"
          required
          disabled={isSubmitting}
        />
      </div>
      <div className="form-group">
        <label htmlFor="categories">Categories:</label>
        <textarea
          id="categories"
          className="form-control"
          value={categories}
          onChange={(e) => setCategories(e.target.value)}
          placeholder="Enter categories separated by commas"
          required
          disabled={isSubmitting}
        />
      </div>
      <div className="form-group">
        <label htmlFor="gameFile">Upload Game File:</label>
        <input
          id="gameFile"
          type="file"
          className="form-control"
          onChange={(e) => setGameFile(e.target.files[0])}
          accept=".swf"
          required
          disabled={isSubmitting}
        />
      </div>
      <div className="form-group">
        <label htmlFor="imageFile">Upload Game Thumbnail:</label>
        <input
          id="imageFile"
          type="file"
          className="form-control"
          onChange={(e) => setImageFile(e.target.files[0])}
          accept="image/*"
          required
          disabled={isSubmitting}
        />
      </div>

      <button type="submit" className="btn btn-success" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>

      {uploadingMessage && <div className="alert alert-warning mt-3">{uploadingMessage}</div>}
      {responseMessage && <div className="alert alert-info mt-3">{responseMessage}</div>}
      {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
    </form>
  );
}

export default UploadGame;
