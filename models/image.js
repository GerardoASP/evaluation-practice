// const mongoose = require('mongoose')
// const imageSchema = new mongoose.Schema({
//     filename: String,
//     url: String,
//     // Otros campos relacionados con la imagen, como el tamaño, el tipo, etc.
//   });
  
//   module.exports = mongoose.model('Image', imageSchema);


const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  fieldname: {
    type: String,
    required: true
  },
  originalname: {
    type: String,
    required: true
  },
  encoding: {
    type: String,
    required: true
  },
  mimetype: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Image', imageSchema);

