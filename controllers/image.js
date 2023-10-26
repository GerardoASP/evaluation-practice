const express = require('express');
const router = express.Router();
const mongodb = require('mongodb');
const Grid = require('gridfs-stream');
const mongoose = require('mongoose');
// const dbURI = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@${process.env.DB_HOST}`;


// Create a connection to your MongoDB database
const conn = mongoose.createConnection(`mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@${process.env.DB_HOST}`);

// Initialize GridFS
let gfs;
conn.once('open', () => {
  gfs = Grid(conn.db, mongodb);
  gfs.collection('photos'); // Replace 'uploads' with your GridFS collection name
});


const getImage = async (req, res) => {
    try {
        gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
            if (!file || file.length === 0) {
              return res.status(404).json({
                err: 'No file exists',
              });
            }
        
            const readstream = gfs.createReadStream(file.filename);
            readstream.pipe(res);
        });
    } catch (error) {
        console.error('Error al obtener la imagen:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
};


module.exports = {getImage};
