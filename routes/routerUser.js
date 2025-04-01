const express = require('express');
const routerUsers = express.Router();
const {registerUser, loginUser, userValidate, getUserData, deleteUser, addUserAddress, completeRegistration, addCompany} = require("../controllers/user")
const {validatorRegister, validatorCode, userDataValidator, addressValidator, companyValidator} = require("../validators/users")
const {attemptsMiddleware} = require("../middleware/users")
const {authMiddleware} = require("../middleware/session")
 
routerUsers.use(express.json());

routerUsers.post("/register", validatorRegister, registerUser)
routerUsers.post("/login", loginUser)
routerUsers.put("/validate", authMiddleware, validatorCode, attemptsMiddleware, userValidate)
routerUsers.get("/", authMiddleware, getUserData)
routerUsers.delete("/", authMiddleware, deleteUser)
routerUsers.put("/register", userDataValidator, authMiddleware, completeRegistration)
routerUsers.patch("/address", addressValidator, authMiddleware, addUserAddress)
routerUsers.patch("/company", companyValidator, authMiddleware, addCompany)


module.exports = {routerUsers}

