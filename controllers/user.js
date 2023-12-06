const express = require('express');
const modelUser = require('../models/user');
const modelPost = require('../models/post');
const axios = require('axios');
const fetch = require('node-fetch')

// Obtener todos los movies
const getAllUsers = async (req, res)=>{
    try{
        const users = await modelUser.find();
        res.status(200).json(users);
    }catch(error){
        res.status(500).json({message: error.message});
    }
};

const updateUser = async (req, res) => {
    const { id } = req.params;
 
    try {
        const user = await modelUser.findByIdAndUpdate(
            id, { $set: { active: true } }, { new: true, runValidators: true }
        );

        // Busca al usuario con el token correspondiente
        const userTemp = await modelUser.findOne({ _id: id });

        // Configura el transporte de correo
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD
            }
        });

        // Configura las opciones de correo
        let mailOptionsUser = {
            from: 'jeanc.ballesterosz@autonoma.edu.co',
            to: user.email,
            subject: 'Cuenta Verificada',
            html: `Ya has sido verificado. Revisa la aplicación de EduNative`
        };

        // Envía el correo
        transporter.sendMail(mailOptionsUser, async (error, info) => {
            if (error) {
                console.error("Error en el envío del correo de verificación:", error);
                return res.status(500).json({ error: "Error en el envío del correo de verificación. Por favor, inténtalo de nuevo." });
            }

            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            res.json(user);

        });
 
    } catch (err) {
        res.status(500).json({ message: `Error al actualizar usuario: ${err.message}` });
    }
};

const editUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const active = req.body.active;

        console.log(userId);
        console.log(active);

        // Validar que el campo 'active' esté presente
        if (active === undefined) {
            return res.status(400).json({ error: 'Debes proporcionar el nuevo valor para el campo active.' });
        }

        // Buscar el post por su ID
        const user = await modelUser.findById(userId);

        // Verificar si el post existe
        if (!user) {
            return res.status(404).json({ error: 'User no encontrado.' });
        }

        // Actualizar el campo 'active' del post
        user.active = active;

        // Guardar los cambios en la base de datos
        await user.save();

        // Responder con el post actualizado
        res.json({ message: 'Campo active editado exitosamente.', user });
    } catch (error) {
        console.error('Error al editar el campo active del post:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

module.exports = {getAllUsers, updateUser, editUser};