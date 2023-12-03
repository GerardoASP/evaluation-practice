const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const modelUser = require('../models/user');
const fetch = require('node-fetch');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

require("dotenv").config()

const login = async (req, res) => {
    const { email, current_password } = req.body;
    console.log(req.body);
    try {
        if (!email || !current_password) {
            throw new Error("El email y la contraseña son obligatorios");
            console.log("no recibe datos");
        }
        const emailLowerCase = email.toLowerCase();
        const userStore = await modelUser.findOne({ email: emailLowerCase }).exec();
        if (!userStore) {
            throw new Error("El usuario no existe");
        }
        const check = await bcrypt.compare(
            current_password,
            userStore.current_password
        );
        if (!check) {
            throw new Error("Contraseña incorrecta");
        }
        if (!userStore.active) {
            throw new Error("Usuario no autorizado o no activo");
        }

        // Genera tokens de acceso y refresco
        const accessToken = jwt.sign({ userStore }, process.env.JWT_SECRET_KEY, { expiresIn: '5m' });
        const refreshToken = jwt.sign({ userStore }, process.env.JWT_SECRET_KEY, { expiresIn: '5m' });

        res.status(200).send({
            accessToken, refreshToken
        });
    } catch (error) {
        res.status(400).send({ msg: error.message });
        console.log();
    }
};

const register = async (req, res) => {
    try {
        const { name, lastname, email, current_password } = req.body;

        // Validar que la contraseña no esté vacía y cumpla con ciertos criterios
        if (!current_password || current_password.length < 8) {
            return res.status(400).json({ error: "La contraseña no cumple con los requisitos mínimos" });
        }

        // Hashear la contraseña antes de almacenarla
        const hashedPassword = await bcrypt.hash(current_password, 10);

        // Genera un token único para el usuario
        const token = crypto.randomBytes(64).toString('hex');

        // Crear un nuevo usuario con la contraseña hasheada
        const user = new modelUser({ name, lastname, email, current_password: hashedPassword, token });
        await user.save();

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
        let mailOptions = {
            from: 'jeanc.ballesterosz@autonoma.edu.co',
            to: 'jeanc.ballesterosz@autonoma.edu.co',
            subject: 'Verifica la cuenta del usuario',
            html: `El usuario ${user.name} ${user.lastname} con correo ${user.email}, se acaba de registrar en EduNative. Revisa la aplicación para verificar la cuenta`
        };

        // Envía el correo
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error en el envío del correo de verificación:", error);
                return res.status(500).json({ error: "Error en el envío del correo de verificación. Por favor, inténtalo de nuevo." });
            }
            res.status(200).json({ message: "Usuario registrado con éxito" });
        });
    } catch (error) {
        // Manejar errores y responder con un estado HTTP 500 (Internal Server Error) en caso de un error interno
        console.error(error);
        res.status(500).json({ error: "Error en el registro de usuario" });
    }
}

const verificar = async (req, res) => {
    const token = req.query.token;

    // Busca al usuario con el token correspondiente
    const user = await modelUser.findOne({ token: token });

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

        // Si el usuario existe y el token coincide, verifica la cuenta
        if (user) {
            // Actualiza el estado del usuario a activo
            user.active = true;
            await user.save();

            // Realiza la solicitud PUT utilizando fetch
            try {
                const putResponse = await fetch(`http://localhost:3000/api/v1/auth/verificar-cuenta?token=${token}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        // Otros encabezados según sea necesario
                    },
                    body: JSON.stringify({ userId: user._id }), // Puedes enviar datos adicionales en el cuerpo
                });

                const putData = await putResponse.json();

                console.log('Respuesta de la solicitud PUT:', putData);
            } catch (error) {
                console.error('Error en la solicitud PUT:', error);
            }

            res.status(200).json({ message: "Usuario verificado con éxito" });
        } else {
            res.send('Enlace de verificación no válido');
        }
    });
};

function createAccessToken(modelUser) {
    const accessToken = jwt.sign(modelUser, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
    return accessToken;
}

function createRefreshToken(modelUser) {
    const accessToken = jwt.sign(modelUser, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
    return accessToken;
}

module.exports = { login, register, createAccessToken, createRefreshToken, verificar };
