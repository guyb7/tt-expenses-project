import API from '../API/API'
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

export function requestLogin({ username, password, onSuccess, onFail }) {
  return {
    types: ['LOGIN_REQUEST', 'LOGIN_SUCCESS', 'LOGIN_FAILURE'],
    promise: () => {
      return new Promise((resolve, reject) => {
        API.post('/login', { username, password })
        .then(res => {
          onSuccess(res)
          resolve()
        })
        .catch(e => {
          onFail(e)
          reject(e)
        })
      })
    }
  }
}

export function requestRegister({ username, password, name, onSuccess, onFail }) {
  return {
    types: ['REGISTER_REQUEST', 'REGISTER_SUCCESS', 'REGISTER_FAILURE'],
    promise: () => {
      return new Promise((resolve, reject) => {
        API.post('/register', { username, password, name })
        .then(res => {
          onSuccess(res)
          resolve()
          return null
        })
        .catch(e => {
          onFail(e)
          reject(e)
        })
      })
    }
  }
}

export function requestProfile({ onSuccess, onFail }) {
  return {
    types: ['PROFILE_REQUEST', 'PROFILE_SUCCESS', 'PROFILE_FAILURE'],
    promise: () => {
      return new Promise((resolve, reject) => {
        API.get('/profile')
        .then(res => {
          onSuccess(res)
          resolve()
        })
        .catch(e => {
          onFail(e)
          reject(e)
        })
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
