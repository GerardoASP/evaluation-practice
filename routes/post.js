const express = require("express");
const router = express.Router();
const postController = require("../controllers/post")
const path = require('path');

/* http://localhost:3000/api/v1/posts/new-post */
router.post("/new-post", postController.createPost);

/* http://localhost:3000/api/v1/posts */
router.get("/", postController.getPosts);

/* http://localhost:3000/api/v1/posts/1 */
router.delete("/:id", postController.removePost);

router.post("/upload-image", postController.uploadImage);

router.post("/upload-imageM", postController.uploadImageM);

router.put("/:id/edit", postController.editPost);

// router.get("/images/:filename", postController.getImage);


module.exports = router;