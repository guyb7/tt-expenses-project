import axios from 'axios'
import Promise from 'bluebird'
import _ from 'lodash'
import Mocks from './Mocks'

const baseUrl = '/api'
const mock = process.env.NODE_ENV === 'development'

export default {
  get: (route, params) => {
    if (mock) {
      return Mocks('get', route, params)
    } else {
      return new Promise((resolve, reject) => {
        axios.get(baseUrl + route, params)
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
  },
  post: (route, params) => {
    if (mock) {
      return Mocks('post', route, params)
    } else {
      return new Promise((resolve, reject) => {
        axios.post(baseUrl + route, params)
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
}
