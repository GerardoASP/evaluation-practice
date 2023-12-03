const express = require('express');
const modelUser = require('../models/user');
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

module.exports = {getAllUsers, updateUser};