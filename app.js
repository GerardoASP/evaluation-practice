const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const addressRoutes = require("./routes/address")
const pokemonRoutes = require("./routes/pokemon")
const movieRoutes = require("./routes/movie")
const postRoutes = require("./routes/post")
const dotenv = require('dotenv').config()
//const { API_PATH, PORT } = require('./variables')

const cors = require("cors")

app.use(cors());

//Visualizacion del contenido del endpoint o envio del contenido
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static("uploads"));
app.use('/uploads', express.static('uploads'));

//app.use(`/${API_PATH}/addresses`, addressRoutes);
app.use(`/${process.env.API_PATH}/addresses`,addressRoutes);

//app.use(`/${API_PATH}/pokemon`, pokemonRoutes);
app.use(`/${process.env.API_PATH}/pokemon`,pokemonRoutes);

//app.use(`/${API_PATH}/movies`, movieRoutes);
app.use(`/${process.env.API_PATH}/movies`,movieRoutes);

//app.use(`/${API_PATH}/posts`, postRoutes);
app.use(`/${process.env.API_PATH}/posts`,postRoutes);

module.exports = app
