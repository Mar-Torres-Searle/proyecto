const {check} = require("express-validator")

const {validateResults} = require("../utils/handleValidator")


const validatorRegister = [
    check("email").exists().notEmpty().isEmail(),
    check("password").exists().notEmpty().isLength( {min:8} ),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
]
















//Definir validador para que el login sea un email valido y la password contenga al menos 8 caracteres
const validatorLogin = [

    check("email").exists().notEmpty().isEmail(),
    check("password").exists().notEmpty().isLength( {min:8, max: 16} ),
    
    (req, res, next) => {
        return validateResults(req, res, next)
    }
]

module.exports = { validatorRegister, validatorLogin }