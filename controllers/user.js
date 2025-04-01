const UserModel = require("../models/users.js")
const {encrypt, compare} = require("../utils/handlePassword")
const {tokenSign} = require("../utils/handleJwt")
const { matchedData } = require("express-validator");
const {generateCode} = require("../utils/handleRegister")
const {uploadToPinata} = require("../utils/handleUploadPFS")

const registerUser = async (req, res) => {
    const {email, password} = req.body
    const checkIs = await UserModel.findOne({email}).select("-pas-createdAt -updatedAt")
    if (checkIs) {
        res.status(409).json({message: "El email ya está registrado"})
    }

    const passwordHash = await encrypt(password)
    const body = {...req.body, password: passwordHash, emailCode: generateCode()}
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
    const {emailCode} = req.body
    if (user.emailCode !== emailCode) {
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
    const user = await UserModel.findOne({email})
    if (!user) {
        res.status(409).json({message: "El email no está registrado"})
    }
    if (user.status !== 1) {
        res.status(409).json({message: "El email no está validado"})
    }
        //comprobamos que la contraseña sea correcta
    const passwordHash = await compare(password, user.password)
    if (!passwordHash) {
        res.status(409).json({message: "La contraseña es incorrecta"})
    }
    
    user.set('password', undefined, {strict: false})
    const response = {
        token: await tokenSign(user),
        email: user.email,
        role: user.role,
        _id: user._id,
        name: user.name
    };

    res.send(response);
    
}

const completeRegistration = async (req, res) => {
    const {name, lastname, nif, address} = req.body
    const user = req.user
    user.name = name
    user.lastname = lastname
    user.nif = nif
    user.address = address  
    await user.save()
    const { _id, email, emailCode, status, role, createdAt, updatedAt } = user.toObject();
    return res.send({ _id, email, emailCode, status, role, createdAt, updatedAt, name, nif, lastname });

}

const addUserAddress = async (req, res) => {
    const {address} = req.body
    
    const user = req.user
    user.address = address
    await user.save()
    if (user.autonomo) {
        user.company = address
        await user.save()
    }
    return res.send({message: "La dirección ha sido añadida", address: user.address})
}

const addCompany = async (req, res) => {
    const {company} = req.body
    const user = req.user
    user.company = company
    user.autonomo = false
    await user.save()
    return res.send({message: "La empresa ha sido añadida", company: user.company, autonomo: user.autonomo})
}   


const uploadLogo = async (req, res, next) => {

    try{

        const user = req.user
        const fileBuffer = req.file.buffer  
        const fileName = req.file.originalname
        //guardar la imagen en la carpeta storage
        
        const pinataResponse = await uploadToPinata(fileBuffer, fileName)
        const ipfsFile = pinataResponse.IpfsHash
        const ipfs = `https://${process.env.PINATA_GATEWAY_URL}/ipfs/${ipfsFile}`
        user.logo = {url: ipfs, filename: fileName}
        await user.save()
        res.send({message: "La imagen ha sido subida", logo: user.logo})

    }catch(err){

        console.log(err)
        next(err)
    }
}

const getUserData = async (req, res) => {
    const user = await UserModel.findById(req.user._id).select("-createdAt -updatedAt -code -password")
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

const recoveyCodeRequest = async (req, res) => {
    const {email} = req.body
    const user = await UserModel.findOne({email})
    if (!user) {
        return res.status(404).send({message: "El email no está registrado"})
    }
    if (user.status !== 1) {
        return res.status(404).send({message: "El email no está validado"})
    }
    user.recoveryCode = generateCode()
    await user.save()
    return res.send({message: "El codigo de recuperación ha sido enviado", recoveryCode: user.recoveryCode})
}

const revoverPassword = async (req, res) => {
    const {email, recoveryCode, password} = req.body
    const user = await UserModel.findOne({email, status: 1})
    if (!user) {
        return res.status(404).send({message: "El email no está registrado"})
    }
    if (user.status !== 1) {
        return res.status(404).send({message: "El email no está validado"})
    }
    if (user.recoveryCode !== recoveryCode) {
        return res.status(404).send({message: "El codigo de recuperación es incorrecto"})
    }
    user.password = await encrypt(password)
    user.recoveryCode = null
    await user.save()
    return res.send({message: "La contraseña ha sido cambiada"})
    
}

module.exports = {registerUser, loginUser, userValidate, getUserData, deleteUser, completeRegistration, addUserAddress, addCompany, uploadLogo, recoveyCodeRequest, revoverPassword}
