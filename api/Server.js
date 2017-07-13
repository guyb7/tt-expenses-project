import express from 'express'
import bodyParser from 'body-parser'

const app = express()
app.use(bodyParser.json())

export default {
  start: () => {
    app.listen(process.env.PORT, () => {
      console.log('Expenses server is listening on port ' + process.env.PORT)
    })
  }
}
