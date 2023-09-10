const mongoose = require('mongoose')

const movieSchema=mongoose.Schema({
    title: { type: String },
    poster_path: { type: String },
    overview: { type: String },
    release_date: { type: String }
})

module.exports = mongoose.model("Movie", movieSchema)