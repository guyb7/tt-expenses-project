import '../env'
process.env.ENV = 'test'
process.env.PORT = 3003 // if changed, modify testURL in package.json
process.env.PG_DB = 'expenses_test_db'

import axios from 'axios'
// import Db from './Database'
import Server from './Server'

const instance = axios.create({
  baseURL: 'http://127.0.0.1:3003/api/',
  timeout: 1000
})

beforeAll(() => {
  Server.start()
})

afterAll(() => {
  Server.shutDown()
})

test('Server is running', done => {
  instance.get('/status')
  .then(function (response) {
    expect(response.data.success).toBe(true)
    done()
  })
  .catch(function (error) {
    console.log(error)
  })
})
