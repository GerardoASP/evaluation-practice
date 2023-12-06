const express = require('express');
const modelPost = require('../models/post');
const modelUser = require('../models/user');
const modelImage = require('../models/image');
const { GridFsStorage } = require("multer-gridfs-storage")
const path = require('path');
const { MongoClient, GridFSBucket, ObjectID } = require("mongodb");

const axios = require('axios');
const fetch = require('node-fetch');

require("dotenv").config()

const dotenv = require('dotenv').config();


const multer = require('multer');

const url = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@${process.env.DB_HOST}`;


const allowedImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/bmp", "image/tiff"];
const allowedVideoTypes = ["video/mp4", "video/webm", "video/ogg", "video/x-msvideo", "video/quicktime"];

let date = Date.now();

// Create a storage object with a given configuration
const storage = new GridFsStorage({
    url: url,
    file: (req, file) => {
      //If it is an image, save to photos bucket
      console.log(file)
      if (allowedImageTypes.includes(file.mimetype)) {
        return {
          bucketName: "photos",
          filename: `${date}-${file.originalname}`
        }
      }else if(allowedVideoTypes.includes(file.mimetype)){

      } /* else {
        //Otherwise save to default bucket
        return `${Date.now()}_${file.originalname}`
      } */
    }
});

const storageLocal = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/posts/'); // Directorio donde se guardarán las imágenes
    },
    filename: function (req, file, cb) {
      cb(null, date + '-' + file.originalname); // Nombre del archivo
    }
});

// const storageLocal = multer.diskStorage({
//     destination: path.join(__dirname, '../uploads/posts'), // Ruta de la carpeta de destino
//     filename: (req, file, cb) => {
//         // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         const uniqueSuffix = Date.now();
//         cb(null, uniqueSuffix + '-' + file.originalname);
//     }
// });

const app = express();

const createPost = async (req, res)=>{
    try{
        const {title, subtitle, avatar, active, description, userId} = req.body;
        console.log(req.body);
        const newPost = new modelPost({title, subtitle, avatar, active, description});
        // console.log(newPost);
        const savedPost = await newPost.save();

        // Recupera el usuario al que deseas agregar el post
        const user = await modelUser.findById(userId);
        
        // Agrega el ObjectId del nuevo post al array correspondiente
        user.posts.push(savedPost._id);
        
        // Guarda el usuario
        await user.save();
        res.status(201).json({ message: "Post created", post: savedPost });
    }catch(error){
        res.status(500).json({message: error.message});
    }
}



//     try {
//         const { title, subtitle, description, images } = req.body;
    
//         const newPost = new modelPost({ title, subtitle, description });
    
//         // Guardar las imágenes asociadas y obtener los IDs
//         const savedImages = await modelImage.create(images);
//         const imageIds = savedImages.map(image => image._id);
    
//         // Asignar los IDs de las imágenes al campo "images" del post
//         newPost.images = imageIds;
    
//         const savedPost = await newPost.save();
    
//         res.status(201).json(savedPost);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
    // }
// }

// Set multer storage engine to the newly created object
// const upload = multer({ storage: storage }).single('image');
// const uploadLocal = multer({ storage: storageLocal }).single('image');



// const createPost = async (req, res) => {
//     try {
//       const { title, subtitle, description } = req.body;
  
//       const newPost = new modelPost({ title, subtitle, description });
  
//     //   const upload = multer({ storage: storage }).array('images', 10);
  
//       upload(req, res, async (err) => {
//         if (err) {
//           return res.status(500).json({ message: err.message });
//         }
  
//         // Asignar los IDs de las imágenes al campo "images" del post
//         newPost.images = req.files.map(file => file.id);
  
//         const savedPost = await newPost.save();
  
//         res.status(201).json(savedPost);
//       });
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   };

const getPosts = async (req, res)=>{
    try{
        const posts = await modelPost.find();
        res.status(200).json(posts);
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

const removePost = async(req, res)=>{
    const postId = req.params.id;
    const userId = req.body.userId;
    console.log(postId);
    console.log(userId);
    // const {postId, userId} = req.query;
    // console.log("postId", postId);
    // console.log("userId", userId);
    try{
        // Encuentra el usuario al que deseas agregar el post
        const user = await modelUser.findById(userId);
        
        // Elimina el post del array 'posts' del usuario
        user.posts.pull(postId);
        await user.save();

        const postDelete = await modelPost.findByIdAndDelete(postId)
        res.status(200).json(postDelete);
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

const editPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const active = req.body.active;

        console.log(postId);
        console.log(active);

        // Validar que el campo 'active' esté presente
        if (active === undefined) {
            return res.status(400).json({ error: 'Debes proporcionar el nuevo valor para el campo active.' });
        }

        // Buscar el post por su ID
        const post = await modelPost.findById(postId);

        // Verificar si el post existe
        if (!post) {
            return res.status(404).json({ error: 'Post no encontrado.' });
        }

        // Actualizar el campo 'active' del post
        post.active = active;

        // Guardar los cambios en la base de datos
        await post.save();

        // Responder con el post actualizado
        res.json({ message: 'Campo active editado exitosamente.', post });
    } catch (error) {
        console.error('Error al editar el campo active del post:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};


// const uploadImage = (req, res) => {
//     upload(req, res, (err) => {
//         const file = req.file
//         // Respond with the file details
//         res.send({
//             message: "Uploaded",
//             id: file.id,
//             name: file.filename,
//             contentType: file.contentType,
//         })
//     });
// };

// const uploadImageLocal = (req, res) => {
//     uploadLocal(req, res, (err) => {
//         if (err) {
//           // Manejar errores de carga
//           return res.status(500).json({ error: err.message });
//         }
        
//         // La imagen se cargó con éxito
//         res.status(201).json({ message: 'File uploaded successfully' });
//     });
// };


// const uploadImage = async (req, res) => {
//     try {
//         // Ejecutar ambos middlewares en paralelo
//         const [localResult, gridFSResult] = await Promise.all([
//             new Promise((resolve, reject) => {
//                 uploadLocal(req, res, (err) => {
//                     if (err) {
//                         reject(err);
//                     } else {
//                         resolve();
//                     }
//                 });
//             }),
//         ]);

//         const file = req.file;
//         const fileDetails = {
//             message: "Uploaded",
//             id: file.id,
//             name: file.filename,
//             contentType: file.contentType,
//         };

//         // La imagen se cargó con éxito en ambas ubicaciones.
//         res.status(201).json({ message: 'File uploaded successfully', fileDetails });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };


const uploadImage = async (req, res) => {
    try {
        // const upload = multer({ storage: storage }).single('image');
        const uploadLocal = multer({ storage: storageLocal }).single('image');
        // Ejecutar ambos middlewares en paralelo
        const [localResult, gridFSResult] = await Promise.all([
            // new Promise((resolve, reject) => {
            //     uploadLocal(req, res, (err) => {
            //         if (err) {
            //             reject(err);
            //         } else {
            //             resolve();
            //         }
            //     });
            // }),
            new Promise((resolve, reject) => {
                upload(req, res, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            }),
        ]);

        const file = req.file;
        const fileDetails = {
            message: "Uploaded",
            id: file.id,
            name: file.filename,
            contentType: file.contentType,
        };

        // La imagen se cargó con éxito en ambas ubicaciones.
        res.status(201).json({ message: 'File uploaded successfully', fileDetails });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};





const uploadImageM = async (req, res) => {
    try {
        // const uploadM = multer({ 
        //     storage: storage, 
        //     limits: {
        //         fileSize: 10 * 1024 * 1024, // Tamaño máximo del archivo (aquí, 10 MB)
        //         files: 5, // Número máximo total de archivos (imágenes + videos)
        //         parts: 6
        // } }).array('files', 5);
        // const uploadLocalM = multer({ storage: storageLocal }).array('images', 5);

        const uploadLocalM = multer({
            storage: storageLocal,
            fileFilter: function (req, file, cb) {
                // Filtra los archivos permitidos (puedes personalizar esto según tus necesidades)
                if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
                    cb(null, true);
                } else {
                    cb(new Error('Formato de archivo no válido. Solo se permiten imágenes y videos.'));
                }
            },
            limits: {
                fileSize: 10 * 1024 * 1024, // Tamaño máximo del archivo (aquí, 10 MB)
                files: 5, // Número máximo total de archivos (imágenes + videos)
                parts: 6
            }
        }).array('files', 5); // Usa array en lugar de fields para permitir cualquier combinación de imágenes y videos

        // Ejecutar ambos middleware en paralelo
        await Promise.all([
            // new Promise((resolve, reject) => {
            //     uploadM(req, res, (err) => {
            //         if (err) {
            //             reject(err);
            //         } else {
            //             resolve();
            //         }
            //     });
            // }),
            new Promise((resolve, reject) => {
                uploadLocalM(req, res, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            })
        ]);


        // Acceder a los archivos cargados
        const filesM = req.files; // Resultado de uploadM
        const filesLocalM = req.files; // Resultado de uploadLocalM

        console.log(filesLocalM);

        // // Comprobar si se subieron archivos
        // if ((!filesM && !filesLocalM) || (filesM && filesM.length === 0 && filesLocalM && filesLocalM.length === 0)) {
        //     return res.status(400).json({ error: "No se subieron archivos" });
        // }

        // La imagen se cargó con éxito en ambas ubicaciones.
        res.status(201).json({ message: 'Files uploaded successfully', filesM});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createPost,
    getPosts,
    removePost,
    uploadImage,
    uploadImageM,
    editPost
}