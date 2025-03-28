const UserModel = require("../models/users.js")
const {encrypt, compare} = require("../utils/handlePassword")
const {tokenSign} = require("../utils/handleJwt")
const { matchedData } = require("express-validator");

const registerUser = async (req, res) => {
    const {email, password} = req.body
    const checkIs = await UserModel.findOne({email})
    if (checkIs) {
        res.status(409).json({message: "El email ya está registrado"})
    }
    const passwordHash = await encrypt(password)
    const body = {...req.body, password: passwordHash}
    const dataUser = await UserModel.create(body)
    dataUser.set('password', undefined, {strict: false})

    const userData = {
        email: dataUser.email,
        status: dataUser.status,
        role: dataUser.role,
        _id: dataUser._id
    }

    const data = {
        token: await tokenSign(dataUser),
        user: userData
    }
    res.send(data)
}

module.exports = {registerUser}
