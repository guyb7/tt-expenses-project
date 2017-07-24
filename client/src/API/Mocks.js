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
            "datetime": "2017-07-25T15:30:00+00:00",
            "amount": "3.0",
            "description": "Food",
            "comment": "Burger"
          }, {
            "id": "1fbe2e26-dca3-4846-849a-09e12251db9d",
            "datetime": "2017-07-25T18:30:00+00:00",
            "amount": "10.5",
            "description": "Stuff",
            "comment": "Comment\nNew line!"
          }, {
            "id": "22222222-dca3-4846-849a-09e12251db9d",
            "datetime": "2017-07-27T10:00:00+00:00",
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
  },
  '/expenses/1fbe2e26-dca3-4846-849a-09e12251db9d': {
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
  },
  '/admin/users': {
    get: {
      success: true,
      users: [
        {
          id: "ffffffff-7172-4f40-b5a6-eb16d44079ff",
          username: "user",
          name: "User1",
          role: "user"
        }, {
          id: "55555555-8fd7-47db-8a3a-990115368d3e",
          username: "admin",
          name: "Admin1",
          role: "admin"
        }
      ]
    },
    post: params => {
      if (params.name === 'fail') {
        return {
          success: false,
          error: { id: 'error-creating-user', text: 'This username already exists' }
        }
      } else {
        return {
            success: true,
            userId: "48b2857b-9720-4f27-8056-66484e4edcb3"
        }
      }
    }
  },
  '/admin/users/ffffffff-7172-4f40-b5a6-eb16d44079ff': {
    put: params => {
      return {
        success: true
      }
    },
    delete: {
      success: true
    }
  },
  '/admin/users/55555555-8fd7-47db-8a3a-990115368d3e': {
    put: params => {
      return {
        success: false,
        error: { id: 'user-not-found', text: 'This user does not exist' }
      }
    },
    delete: {
      success: false,
      error: { id: 'user-not-found', text: 'This user does not exist' }
    }
  },
  '/admin/users/user/expenses': {
    get: {
      success: true,
      "expenses": [
        {
          id: "3ee26fc8-37ac-4550-9715-64e7a7392a13",
          datetime: "2017-07-24T18:30:00+00:00",
          amount: "10.5",
          description: "User expense - Office supplies",
          comment: "Paper clips"
        }, {
          id: "02128ffa-40ae-4c40-98d8-e100e708fe8c",
          datetime: "2017-07-25T15:30:00+00:00",
          amount: "10.5",
          description: "User expense - Expense from admin",
          comment: "Adminn"
        }, {
          id: "cb8a0f76-1b20-40c9-b3dd-46f8b8e03e81",
          datetime: "2017-07-25T11:30:00+00:00",
          amount: "10.5",
          description: "User expense - Expense from admin",
          comment: "Adminn"
        }
      ]
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
  '/admin/users/user/expenses/3ee26fc8-37ac-4550-9715-64e7a7392a13': {
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
      let response
      try {
        response = mocks[route][method]
      } catch (e) {
        console.log('mock-not-found', route, params)
        return reject(new APIError({ success: false, error: { text: 'Mock not found'}}))
      }
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
