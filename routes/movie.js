const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movie")



/* http://localhost:3000/api/v1/movies */
router.get("/", movieController.getAllMovies);

/* http://localhost:3000/api/v1/movies/Hard */
/* http://localhost:3000/api/v1/movies/Pin */
router.get('/:name', movieController.getFilterMovies);


module.exports = router;