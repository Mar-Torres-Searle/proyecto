const mongoose = require("mongoose")
const UserScheme = new mongoose.Schema(
    {
        name: {
            type: String
        },
        lastname: {
            type: String
        },
        nif: {
            type: String
        },
        email: {
            type: String,
            unique: true
        },
        password:{
            type: String // TODO Guardaremos el hash
        },
        status:{
            type: Number,
            default: 0,
            enum: [0, 1]  // Solo permite valores 0 o 1
        },
        role:{
            type: ["user", "admin"], // es el enum de SQL
            default: "user"
        }
    },
    {
        timestamps: true, // TODO createdAt, updatedAt
        versionKey: false
    }
)
module.exports = mongoose.model("users", UserScheme) // "users" es el nombre de la colección en mongoDB (o de la tabla en SQL)