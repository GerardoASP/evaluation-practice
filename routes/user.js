const express = require("express");
const router = express.Router();
const userController = require("../controllers/user")



/* http://localhost:3000/api/v1/movies */
router.get("/", userController.getAllUsers);

/* http://localhost:3000/api/v1/movies/Pin */
router.put('/:id', userController.updateUser);


module.exports = router;