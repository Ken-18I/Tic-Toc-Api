const cors = require('cors')
const express = require('express')
const appRouter = require('./routers/appRouter')

class ExpressApp {
  constructor() {
    this.app = express()
    this.port = 3000

    this.middlewares()
    this.routes()
  }

  middlewares() {
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(express.json())

    this.app.use(cors())
  }

  routes() {
    this.app.use('/model', appRouter)
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server listening on port ${this.port}`)
    })
  }
}

module.exports = ExpressApp
