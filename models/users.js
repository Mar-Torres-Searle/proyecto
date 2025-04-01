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
            type: String 
        },
        address:{
            street: String,
            number: String,
            city: String,
            province: String,
            postalCode: String,
            country: String,
        },
        company:{
            name: String,
            cif: String,
            street: String,
            number: String,
            city: String,
            province: String,
            postalCode: String,
            country: String,
            
        },
        status:{
            type: Number,
            default: 0,
            enum: [0, 1, -1]  // Solo permite valores 0 o 1
        },
        role:{
            type: ["user", "admin"], // es el enum de SQL
            default: "user"
        },
        code: {
            type: String
        },
        attempts: {
            type: Number,
            default: 3
        }
    },
    {
        timestamps: true, // TODO createdAt, updatedAt
        versionKey: false
    }
)
module.exports = mongoose.model("users", UserScheme) // "users" es el nombre de la colección en mongoDB (o de la tabla en SQL)