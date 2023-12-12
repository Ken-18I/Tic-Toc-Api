const express = require('express')
const { handleTicTacToe } = require('../controllers/appController')

const appRouter = express.Router()

appRouter.post('/predict', handleTicTacToe)

module.exports = appRouter
