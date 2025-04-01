const express = require('express');
const routerUsers = express.Router();
const {registerUser, loginUser} = require("../controllers/user")
const {validatorRegister} = require("../validators/users")

routerUsers.use(express.json());

routerUsers.post("/register", validatorRegister, registerUser)
routerUsers.post("/login", loginUser)

module.exports = {routerUsers}

