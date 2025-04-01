const express = require('express');
const routerUsers = express.Router();
const {registerUser, loginUser, userValidate} = require("../controllers/user")
const {validatorRegister, validatorCode} = require("../validators/users")
const {attemptsMiddleware} = require("../middleware/users")
const {authMiddleware} = require("../middleware/session")
 
routerUsers.use(express.json());

routerUsers.post("/register", validatorRegister, registerUser)
routerUsers.post("/login", loginUser)
routerUsers.put("/validate", authMiddleware, validatorCode, attemptsMiddleware, userValidate)

module.exports = {routerUsers}

