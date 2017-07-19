import Promise from 'bluebird'
import _ from 'lodash'

const mocks = {
  '/status': {
    get: {
      success: true
    }
  },
  '/login': {
    post: params => {
      if (params.username === 'fail') {
        return new Error('invalid-credentials')
      } else {
        return {
          success: true
        }
      }
    }
  },
  '/register': {
    post: {
      success: true
    }
  },
  '/profile': {
    post: {
      success: true
    }
  },
}
export default (method, route, params) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const response = mocks[route][method]
      if (_.isFunction(response)) {
        const res = response(params)
        if (res.success) {
          resolve(res)
        } else {
          reject(res)
        }
      } else if (response.success === true) {
        resolve({
          status: 200,
          data: response
        })
      } else {
        reject(response)
      }
    }, 600)
  })
}
