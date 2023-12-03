const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth")

router.post("/login", authController.login);

router.post("/register", authController.register);

router.put("/verificar-cuenta", authController.verificar);


module.exports = router;