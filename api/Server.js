import express from 'express'
import bodyParser from 'body-parser'
import Promise from 'bluebird'

import Authentication from './Authentication'
import Routes from './Routes'
import Session from './Session'

let serverInstance
let sess
const app = express()
app.use(bodyParser.json())

export default {
  start: () => {
    return new Promise((resolve, reject) => {
      sess = Session.mount(app)
      Authentication.mount(app)
      Routes.mount(app)
      serverInstance = app.listen(process.env.PORT, () => {
        console.log('Expenses server is listening on port ' + process.env.PORT)
        resolve()
      })
    })
  },

  shutDown: () => {
    return new Promise((resolve, reject) => {
      console.log('Sutting down Expenses server')
      serverInstance.close()
      resolve()
    })
  }
}
