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
        user: body
    }
    res.send(data)
}

//const emailValidator = async (req, res) => {
    
//}

const loginUser = async (req, res) => {
    //comprobamos que el usuario exista y que este validado, status 1
    const {email, password} = req.body
    const user = await UserModel.findOne({email, status: 1}).select("-createdAt -updatedAt")
    if (!user) {
        res.status(409).json({message: "El email no está registrado"})
    }
        //comprobamos que la contraseña sea correcta
    const passwordHash = await compare(password, user.password)
    if (!passwordHash) {
        res.status(409).json({message: "La contraseña es incorrecta"})
    }
    
    user.set('password', undefined, {strict: false})
    res.send({token: await tokenSign(user), user})
    
}

module.exports = {registerUser, loginUser}
