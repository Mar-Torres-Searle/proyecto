const UserModel = require("../models/users.js")
const {encrypt, compare} = require("../utils/handlePassword")
const {tokenSign} = require("../utils/handleJwt")
const { matchedData } = require("express-validator");
const {generateCode} = require("../utils/handleRegister")
const registerUser = async (req, res) => {
    const {email, password} = req.body
    const checkIs = await UserModel.findOne({email}).select("-pas-createdAt -updatedAt")
    if (checkIs) {
        res.status(409).json({message: "El email ya está registrado"})
    }

    const passwordHash = await encrypt(password)
    const body = {...req.body, password: passwordHash, code: generateCode()}
    const dataUser = await UserModel.create(body)
    dataUser.set('password', undefined, {strict: false})
    dataUser.set('createdAt', undefined, {strict: false})
    dataUser.set('updatedAt', undefined, {strict: false})


    const data = {
        token: await tokenSign(dataUser),
        user: dataUser
    }
    res.send(data)
}

const userValidate = async (req, res) => {
    const user = req.user
    const {code} = req.body
    if (user.code !== code) {
        user.attempts = user.attempts - 1
        await user.save()
        res.status(409).json({message: "El codigo es incorrecto"})
    }
    user.status = 1
    await user.save()
    return res.send({message: "El email es valido"})
}

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


const getUserData = async (req, res) => {
    const user = await UserModel.findById(req.user._id).select("-createdAt -updatedAt -code")
    return res.send({user})
}
const deleteUser = async (req, res) => {
    const {soft} = req.query;
    const user = req.user;

    if (soft === "false") {
        await UserModel.deleteOne({_id: user._id})
    }else{
        user.status = -1
        await user.save()
        return res.send({message: "El usuario ha sido eliminado"})
    }
    return res.send({message: "El usuario ha sido eliminado"})
}

module.exports = {registerUser, loginUser, userValidate, getUserData, deleteUser}
