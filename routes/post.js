const express = require("express");
const router = express.Router();
const postController = require("../controllers/post")

/* http://localhost:3000/api/v1/posts/new-post */
router.post("/new-post", postController.createPost);

/* http://localhost:3000/api/v1/posts */
router.get("/", postController.getPosts);

/* http://localhost:3000/api/v1/posts/1 */
router.delete("/:id", postController.removePost);


router.post("/upload-image", postController.uploadImage);

module.exports = router;