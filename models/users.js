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
        autonomo:{
            type: Boolean,
            default: true
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
            enum: [0, 1, -1]  
        },
        role:{
            type: ["user", "guest"], 
            default: "user"
        },
        emailCode: {
            type: String
        },
        recoveryCode: {
            type: String
        },
        attempts: {
            type: Number,
            default: 3
        },
        logo: {
            url: String,
            filename: String
        },
        guests:[
            {
                ref: "users",
                type: mongoose.Schema.Types.ObjectId
            }
        ]
    },
    {
        timestamps: true, 
        versionKey: false
    }
)
module.exports = mongoose.model("users", UserScheme) 