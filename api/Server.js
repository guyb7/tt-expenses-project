import express from 'express'
import bodyParser from 'body-parser'

import Routes from './Routes'

const app = express()
app.use(bodyParser.json())

export default {
  start: () => {
    Routes.mount(app)
    app.listen(process.env.PORT, () => {
      console.log('Expenses server is listening on port ' + process.env.PORT)
    })
  }
}
