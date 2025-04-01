const express = require('express');
const routerUsers = express.Router();
const {registerUser, loginUser, userValidate, getUserData, deleteUser, addUserAddress, completeRegistration, addCompany,uploadLogo, recoveyCodeRequest, revoverPassword, addGuest} = require("../controllers/user")
const {validatorRegister, validatorCode, validatorRecoveryCode, userDataValidator, addressValidator, companyValidator, passwordValidator} = require("../validators/users")
const {attemptsMiddleware} = require("../middleware/users")
const {authMiddleware} = require("../middleware/session")   
const {uploadMiddlewareMemory, errorMidelware} = require("../utils/handleStorage")
routerUsers.use(express.json());

routerUsers.post("/register", validatorRegister, registerUser)
routerUsers.post("/login", loginUser)
routerUsers.put("/validation", authMiddleware, validatorCode, attemptsMiddleware, userValidate)
routerUsers.get("/", authMiddleware, getUserData)
routerUsers.delete("/", authMiddleware, deleteUser)
routerUsers.put("/register", userDataValidator, authMiddleware, completeRegistration)
routerUsers.patch("/address", addressValidator, authMiddleware, addUserAddress)
routerUsers.patch("/company", companyValidator, authMiddleware, addCompany)
routerUsers.patch("/logo", authMiddleware, uploadMiddlewareMemory.single("image"), errorMidelware, uploadLogo)
routerUsers.post("/recovery-code", recoveyCodeRequest)
routerUsers.patch("/recovery-password", validatorRecoveryCode, passwordValidator, revoverPassword)
routerUsers.post("/invite", authMiddleware, addGuest)

module.exports = {routerUsers}

