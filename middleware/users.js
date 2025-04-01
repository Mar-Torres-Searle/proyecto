const attemptsMiddleware = async (req, res, next) => {
    const user = req.user
    console.log("attemptsMiddleware")
    if (user.attempts <= 0) {
        res.status(409).json({message: "No tienes mas intentos"})
    }else{
        next()
    }
}

module.exports = {attemptsMiddleware}
