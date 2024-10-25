import { useState } from "react";
import axios from "axios";
import "../css/uploadGame.css";

function UploadGame() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [categories, setCategories] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [gameFile, setGameFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // For submit state
  const [uploadingMessage, setUploadingMessage] = useState(""); // For uploading message

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUploadingMessage("UPLOADING...");

    const keywordsArray = keywords.split(",").map((keyword) => keyword.trim());
    const categoriesArray = categories
      .split(",")
      .map((category) => category.trim());

    const formData = new FormData();
    formData.append("gameName", name);
    formData.append("gameDescription", description);
    // Append keywords as an array
    keywordsArray.forEach((keyword) => {
      formData.append("gameKeywords", keyword);
    });
    // Append categories as an array
    categoriesArray.forEach((category) => {
      formData.append("gameCategory", category);
    });
    
    if (gameFile) {
      formData.append("gameFile", gameFile);
    }
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const response = await axios.post(
        "https://infinityplayserver.onrender.com/api/admin/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      setResponseMessage(response.data.message);
      console.log(response.data);
    } catch (error) {
      console.error("Error submitting the form:", error);
      setResponseMessage(
        error.response
          ? error.response.data.message
          : "Error submitting the form"
      );
    } finally {
      setIsSubmitting(false); // Re-enable submit button after response
      setUploadingMessage(""); // Clear "UPLOADING..." message
    }
  };

  return (
    <form className="upload-game" onSubmit={handleSubmit}>
      {/* Upload Game Form */}
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
          disabled={isSubmitting} // Disable input during submission
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
          disabled={isSubmitting} // Disable input during submission
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
          disabled={isSubmitting} // Disable input during submission
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
          disabled={isSubmitting} // Disable input during submission
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
          disabled={isSubmitting} // Disable input during submission
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
          disabled={isSubmitting} // Disable input during submission
        />
      </div>

      <button type="submit" className="btn btn-success" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>

      {/* Show uploading message or response */}
      {uploadingMessage && <div className="alert alert-warning mt-3">{uploadingMessage}</div>}
      {responseMessage && <div className="alert alert-info mt-3">{responseMessage}</div>}
    </form>
  );
}

export default UploadGame;
