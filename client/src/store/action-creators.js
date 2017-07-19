import Promise from 'bluebird'

export function setDrawer(value) {
  return {
    type: 'SET_DRAWER',
    is_open: value
  }
}

export function setNavTitle(value) {
  return {
    type: 'SET_NAV_TITLE',
    title: value
  }
}

export function requestLogin({ username, password, successRedirect }) {
  return {
    types: ['LOGIN_REQUEST', 'LOGIN_SUCCESS', 'LOGIN_FAILURE'],
    promise: () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve({
            success: true,
            username
          })
        }, 200)
      })
    }
  }
}

export function requestProfile({ successRedirect }) {
  return {
    types: ['PROFILE_REQUEST', 'PROFILE_SUCCESS', 'PROFILE_FAILURE'],
    promise: () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // successRedirect()
          // resolve({
          //   success: true,
          //   user_id: 1234,
          //   name: 'User90',
          //   role: 'user'
          // })
          reject(new Error('not-logged-in'))
        }, 2000)
      })
    }
  }
}

export function loadExpenses() {
  return {
    types: ['LOAD_EXPENSES_REQUEST', 'LOAD_EXPENSES_SUCCESS', 'LOAD_EXPENSES_FAILURE'],
    promise: () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve({
            expenses: [
              {}
            ]
          })
        }, 200)
      })
    }
  }
}
