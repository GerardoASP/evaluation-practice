const mongoose = require('mongoose')
const postSchema=mongoose.Schema({
    title: { type: String, required: true},
    subtitle: { type: String, required: true},
    active: { type: Boolean, default: true },
    avatar: { type: [String], required: true},
    description: {type: String, required: true},
    likes: { type: Number, default: 0 },
    saves: { type: Number, default: 0 }
});
  
module.exports = mongoose.model('Post', postSchema);

