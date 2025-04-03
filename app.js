const express = require("express")
const cors = require("cors")
require('dotenv').config(); 
const { routerEmail } = require("./routes/routerEmail")
const { routerUsers } = require('./routes/routerUser');
const dbConnect = require('./config/mongo');
        
const app = express()
dbConnect();

//Le decimos a la app de express() que use cors para evitar el error Cross-Domain (XD)
app.use(cors())
app.use(express.json())

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log("Servidor escuchando en el puerto " + port)
})

app.use("/api/email", routerEmail);
app.use('/api/users', routerUsers);


