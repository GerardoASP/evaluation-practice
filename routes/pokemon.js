const express = require("express");
const router = express.Router();
const pokemonController = require("../controllers/pokemon")



/* http://localhost:3000/api/v1/pokemon */
router.get("/", pokemonController.getAllPokemon);


module.exports = router;