import axios from 'axios'
import Promise from 'bluebird'
import _ from 'lodash'
import Mocks from './Mocks'

const baseUrl = '/api'
const mock = process.env.NODE_ENV === 'development'

const handleRequest = (method, route, params) => {
  if (mock) {
    return Mocks(method, route, params)
  } else {
    return new Promise((resolve, reject) => {
      axios[method](baseUrl + route, params)
      .then(response => {
        resolve(response)
      })
      .catch(e => {
        if (_.has(e, 'response.data.error')) {
          reject(new Error(e.response.data.error.text))
        } else {
          reject(e)
        }
      })
    })
  }
}

export default {
  get: (route, params) => handleRequest('get', route, params),
  post: (route, params) => handleRequest('post', route, params),
  put: (route, params) => handleRequest('put', route, params),
  delete: (route, params) => handleRequest('delete', route, params)
}
