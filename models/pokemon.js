const mongoose = require('mongoose')

const addressSchema=mongoose.Schema({
    name: { type: String },
    url_image: { type: String },
    base_experience: { type: Number },
    height: { type: Number },
    abilities: {type: Object},
})

module.exports = mongoose.model("Address", addressSchema)