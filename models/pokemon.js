const mongoose = require('mongoose')

const pokemonSchema=mongoose.Schema({
    name: { type: String },
    url_image: { type: String },
    base_experience: { type: Number },
    height: { type: Number },
    abilities: {type: Object},
})

module.exports = mongoose.model("Pokemon", pokemonSchema)