import axios from 'axios'
import Mocks from './Mocks'

const baseUrl = '/api'
const mock = true

export default {
  get: (route, params) => {
    if (mock) {
      return Mocks('get', route, params)
    } else {
      return axios.get(baseUrl + route, params)
    }
  },
  post: (route, params) => {
    if (mock) {
      return Mocks('post', route, params)
    } else {
      return axios.post(baseUrl + route, params)
    }
  }
}
