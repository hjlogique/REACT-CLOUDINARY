import axios from "axios";

export default {
  // Gets all Image
  getImage: function() {
    return axios.get("/api/imageUpload");
  },
  // Gets the Image with the given id
  getImage: function(id) {
    return axios.get("/api/imageUpload/" + id);
  },
  // Deletes the Image with the given id
  deleteImage: function(id) {
    return axios.delete("/api/imageUpload/" + id);
  },
  // Saves a Image to the database
  saveImage: function(imageData) {
    return axios.post("/api/imageUpload", imageData);
  }
};
