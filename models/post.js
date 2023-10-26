const mongoose = require('mongoose')
const postSchema=mongoose.Schema({
    title: { type: String, required: true},
    subtitle: { type: String, required: true},
    active: { type: Boolean, default: true },
    avatar: { type: [String], required: true},
    description: {type: String, required: true},
});


// const postSchema = new mongoose.Schema({
//     title: { type: String, required: true},
//     subtitle: { type: String, required: true},
//     active: { type: Boolean, default: true },
//     images: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Image'
//     }],
//     description: {type: String, required: true}
// });
  
module.exports = mongoose.model('Post', postSchema);

