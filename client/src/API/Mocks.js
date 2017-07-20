import Promise from 'bluebird'
import _ from 'lodash'

const DELAY = 400


function APIError(data) {
  this.name = "APIError";
  this.message = (data.error.text || 'Something went wrong!')
  this.data = data
}
APIError.prototype = Error.prototype

const mocks = {
  '/status': {
    get: {
      success: true
    }
  },
  '/login': {
    post: params => {
      if (params.username === 'fail') {
        return {
          success: false,
          error: { id: 'invalid-credentials', text: 'Wrong username or password' }
        }
      } else {
        return {
          success: true
        }
      }
    }
  },
  '/register': {
    post: params => {
      if (params.username === 'fail') {
        return {
          success: false,
          error: { id: 'error-creating-user', text: 'This username already exists' }
        }
      } else {
        return {
          success: true
        }
      }
    }
  },
  '/profile': {
    get: {
      success: true,
      user: {
        id: "019eeb5e-7e8a-42ce-b50c-b30e389ec822",
        username: "user",
        name: "User1",
        role: "user"
      }
    },
    // get: {
    //   success: false,
    //   error: { id: 'session-expired', text: 'Your session has expired' }
    // }
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
          reject(new APIError(res))
        }
      } else if (response.success === true) {
        resolve({
          status: 200,
          data: response
        })
      } else {
        reject(new APIError(response))
      }
    }, DELAY)
  })
}
