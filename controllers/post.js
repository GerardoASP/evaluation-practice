const express = require('express');
const modelPost = require('../models/post');
const { GridFsStorage } = require("multer-gridfs-storage")
const path = require('path');

const axios = require('axios');
const fetch = require('node-fetch');

require("dotenv").config()


const multer = require('multer');

const url = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@${process.env.DB_HOST}`


// Create a storage object with a given configuration
// const storage = new GridFsStorage({
//     url,
//     file: (req, file) => {
//       //If it is an image, save to photos bucket
//       if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
//         return {
//           bucketName: "photos",
//           filename: `${Date.now()}_${file.originalname}`,
//           destination: path.join(__dirname, "../uploads/posts"),
//         }
//       } else {
//         //Otherwise save to default bucket
//         return `${Date.now()}_${file.originalname}`
//       }
//     },
// })

const storage = multer.diskStorage({
        destination: path.join(__dirname, '../uploads/posts'), // Ruta de la carpeta de destino
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + '-' + file.originalname);
        }
    }
);
  
// Set multer storage engine to the newly created object
const upload = multer({ storage: storage }).single('image');

const app = express();

const createPost = async (req, res)=>{
    try{
        const {title, subtitle, avatar, description} = req.body;
        // console.log(req.body);
        const newPost = new modelPost({title, subtitle, avatar, description});
        // console.log(newPost);
        const savedPost = await newPost.save();
        // res.status(201).json({message: "Post created"});
        res.status(201).json(savedPost);
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

const getPosts = async (req, res)=>{
    try{
        const posts = await modelPost.find();
        res.status(200).json(posts);
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

const removePost = async(req, res)=>{
    const {id} = req.params;
    try{
        const postDelete = await modelPost.findByIdAndDelete(id)
        res.status(200).json(postDelete);
    }catch(error){
        res.status(500).json({message: error.message});
    }
}



const uploadImage = (req, res) => {
    // upload(req, res, (err) => {
    //     const file = req.file
    //     // Respond with the file details
    //     res.send({
    //         message: "Uploaded",
    //         id: file.id,
    //         name: file.filename,
    //         contentType: file.contentType,
    //     })
    // }),
    upload(req, res, (err) => {
        if (err) {
          // Manejar errores de carga
          return res.status(500).json({ error: err.message });
        }
        
        // La imagen se cargó con éxito
        res.status(201).json({ message: 'File uploaded successfully' });
    });
};




module.exports = {
    createPost,
    getPosts,
    removePost,
    uploadImage
}