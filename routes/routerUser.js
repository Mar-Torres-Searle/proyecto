const express = require('express');
const routerUsers = express.Router();
const {registerUser, loginUser, userValidate, getUserData, deleteUser, addUserAddress, completeRegistration} = require("../controllers/user")
const {validatorRegister, validatorCode, userDataValidator, addressValidator} = require("../validators/users")
const {attemptsMiddleware} = require("../middleware/users")
const {authMiddleware} = require("../middleware/session")
 
routerUsers.use(express.json());

routerUsers.post("/register", validatorRegister, registerUser)
routerUsers.post("/login", loginUser)
routerUsers.put("/validate", validatorCode, authMiddleware, attemptsMiddleware, userValidate)
routerUsers.get("/", authMiddleware, getUserData)
routerUsers.delete("/", authMiddleware, deleteUser)


module.exports = {routerUsers}

