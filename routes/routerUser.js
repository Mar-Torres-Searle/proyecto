const express = require('express');
const routerUsers = express.Router();
const {registerUser} = require("../controllers/user")
const {validatorRegister} = require("../validators/users")

routerUsers.use(express.json());

routerUsers.post("/register", validatorRegister, registerUser)

module.exports = {routerUsers}

