const mongoose = require('mongoose')
const dbConnect = () => {
    const db_uri = process.env.DB_URI

    console.log(db_uri)
    mongoose.set('strictQuery', false)
    try{
       const db = mongoose.connect(db_uri)
       console.log("Conectado a la BD:", db)
    }catch(error){
        console.err("Error conectando a la BD:", error)
    }
    //Listen events
    mongoose.connection.on("connected",() => console.log("Conectado a la BD"))
}
module.exports = dbConnect

//hacer npm start 
//probar a cambiar una letra de DB_URI y ver si nos da error
