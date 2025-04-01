const multer = require("multer")

const memory = multer.memoryStorage()




const errorMidelware=(err, req, res, next) => {
    const message = err.message || "Error interno del servidor"
    res.status(400).send({message})    
    console.log(err)
}


const uploadMiddlewareMemory = multer({storage: memory, limits: {fileSize: 1024*1024*10}})

module.exports = { uploadMiddlewareMemory, errorMidelware}
