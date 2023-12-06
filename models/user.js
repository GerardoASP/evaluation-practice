const mongoose = require('mongoose')
const address = require('./address.js')
const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    active: { type: Boolean, required: true, default: false },
    email: { type: String, required: true, unique: true},
    current_password: { type: String, require: true },
    role: { type: String, required: true, default: "miembro" },
    posts: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Posts" 
    }],
    likes: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Posts" 
    }],
    saves: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Posts" 
    }]
})

module.exports = mongoose.model("User", userSchema);

