const express = require("express");
const router = express.Router();
const pokemonController = require("../controllers/pokemon")



/* http://localhost:3000/api/v1/pokemon */
router.get("/", pokemonController.getAllPokemon);

/* http://localhost:3000/api/v1/pokemon/ditto */
/* http://localhost:3000/api/v1/pokemon/bulbasaur */
router.get('/:name', pokemonController.getPokemon);


module.exports = router;