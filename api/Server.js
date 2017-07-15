import express from 'express'
import bodyParser from 'body-parser'

import Authentication from './Authentication'
import Routes from './Routes'
import Session from './Session'

const app = express()
app.use(bodyParser.json())

export default {
  start: () => {
    Session.mount(app)
    Authentication.mount(app)
    Routes.mount(app)
    app.listen(process.env.PORT, () => {
      console.log('Expenses server is listening on port ' + process.env.PORT)
    })
  }
}
