const express = require("express");
const { sendEmail } = require("../utils/handleEmail");
const routerEmail = express.Router();

// Endpoint para enviar un email
routerEmail.post("/send-email", async (req, res) => {
    const { to, subject, text } = req.body;

    // Validar que se proporcionen los campos necesarios
    if (!to || !subject || !text) {
        return res.status(400).json({ error: "Faltan campos requeridos: to, subject, text" });
    }

    const emailOptions = {
        from: process.env.EMAIL,
        to,
        subject,
        text,
    };

    try {
        await sendEmail(emailOptions);
        res.status(200).json({ message: "Email enviado exitosamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al enviar el email" });
    }
});

module.exports = { routerEmail };
