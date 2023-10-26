const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const modelUser = require('../models/user');
const { GridFsStorage } = require("multer-gridfs-storage")
const path = require('path');

const axios = require('axios');
const fetch = require('node-fetch');

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
            // access: jwt.createAccessToken(userStore),
            // refresh: jwt.createRefreshToken(userStore),
            accessToken, refreshToken
        });
    } catch (error) {
        res.status(400).send({ msg: error.message });
        console.log();
    }
};

const register = async (req, res) => {

    // const { email, current_password } = req.body;
    // if (!current_password) {
    //     throw new Error("La contraseña no puede ser vacía");
    // }
    // const hashedPassword = await bcrypt.hash(current_password, 10);
    // const user = new modelUser({ email, current_password: hashedPassword });
    // await user.save();
    // res.sendStatus(201);


    try {
        const { name, lastname, email, current_password } = req.body;

        // Validar que la contraseña no esté vacía y cumpla con ciertos criterios
        if (!current_password || current_password.length < 8) {
            return res.status(400).json({ error: "La contraseña no cumple con los requisitos mínimos" });
        }

        // Hashear la contraseña antes de almacenarla
        const hashedPassword = await bcrypt.hash(current_password, 10);

        // Crear un nuevo usuario con la contraseña hasheada
        const user = new modelUser({ name, lastname, email, current_password: hashedPassword });
        await user.save();

        // Responder con un estado HTTP 201 (Created) si todo fue exitoso
        res.status(201).json({ message: "Usuario registrado con éxito" });
    } catch (error) {
        // Manejar errores y responder con un estado HTTP 500 (Internal Server Error) en caso de un error interno
        console.error(error);
        res.status(500).json({ error: "Error en el registro de usuario" });
    }
}




function createAccessToken(modelUser) {
    const accessToken = jwt.sign(modelUser, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
    return accessToken;
}

function createRefreshToken(modelUser) {
    const accessToken = jwt.sign(modelUser, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
    return accessToken;
}

module.exports = {login, register, createAccessToken, createRefreshToken};