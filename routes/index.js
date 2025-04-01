const usersRouter = require('./users');

const router = require('express').Router();

router.use('/user', usersRouter);

module.exports = router;