import Promise from 'bluebird'
import _ from 'lodash'

const DELAY = 400


function APIError(data) {
  this.name = "APIError";
  this.message = (data.error.text || 'Something went wrong!')
  this.data = data
}
APIError.prototype = Error.prototype

let profileCalls = 0

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
  '/logout': {
    get: {
      success: true
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
    get: params => {
      profileCalls++
      if (profileCalls < 1) {
        return {
          success: false,
          error: { id: 'session-expired', text: 'Your session has expired' }
        }
      } else {
        return {
          success: true,
          user: {
            id: "019eeb5e-7e8a-42ce-b50c-b30e389ec822",
            username: "admin",
            name: "Admin1",
            role: "admin"
          }
        }
      }
    },
    put: params => {
      if (params.name === 'fail') {
        return {
          success: false,
          error: { id: 'error-updating-user', text: 'Could not update your account' }
        }
      } else {
        return {
          success: true
        }
      }
    }
  },
  '/expenses': {
    get: params => {
      return {
        "success": true,
        "expenses": [
          {
            "id": "cac44371-a922-4906-8563-1ca53e63bbe7",
            "datetime": "2017-07-01T15:30:00+00:00",
            "amount": "3.0",
            "description": "Food",
            "comment": "Burger"
          }, {
            "id": "1fbe2e26-dca3-4846-849a-09e12251db9d",
            "datetime": "2017-07-01T18:30:00+00:00",
            "amount": "10.5",
            "description": "Stuff",
            "comment": "Comment\nNew line!"
          }, {
            "id": "22222222-dca3-4846-849a-09e12251db9d",
            "datetime": "2017-06-28T10:00:00+00:00",
            "amount": "99.99",
            "description": "No comment",
            "comment": ""
          }
        ]
      }
    },
    post: params => {
      if (params.description === 'fail') {
        return {
          success: false,
          error: { id: 'error-creating-expense', text: 'Could not create this expense' }
        }
      } else {
        return {
          success: true,
          expenseId: '112bed0f-cdd6-42a2-b15f-6184efde41bd'
        }
      }
    }
  },
  '/expenses/112bed0f-cdd6-42a2-b15f-6184efde41bd': {
    put: params => {
      return {
        success: true
      }
    },
    delete: params => {
      return {
        success: true
      }
    }
  }
}

export default (method, route, params) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const response = mocks[route][method]
      if (_.isFunction(response)) {
        const res = response(params)
        console.log('MOCK API RESPONSE', method, route, res)
        if (res.success) {
          resolve({
            status: res.success? 200 : 401,
            data: res
          })
        } else {
          reject(new APIError(res))
        }
      } else if (response.success === true) {
        console.log('MOCK API RESPONSE', method, route, response)
        resolve({
          status: 200,
          data: response
        })
      } else {
        console.log('MOCK API RESPONSE', method, route, response)
        reject(new APIError(response))
      }
    }, DELAY)
  })
}
