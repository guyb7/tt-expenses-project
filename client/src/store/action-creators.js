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

const delayCallback = (cb) => {
  setTimeout(() => {
    cb()
  }, 20)
}

export function requestLogin({ username, password, onSuccess, onFail }) {
  return {
    types: ['LOGIN_REQUEST', 'LOGIN_SUCCESS', 'LOGIN_FAILURE'],
    promise: () => {
      return new Promise((resolve, reject) => {
        API.post('/login', { username, password })
        .then(res => {
          if (onSuccess) {
            delayCallback(() => onSuccess(res))
          }
          resolve(res)
        })
        .catch(e => {
          if (onFail) {
            delayCallback(() => onFail(e))
          }
          reject(e)
        })
      })
    }
  }
}

export function requestLogout() {
  return {
    types: ['LOGOUT_REQUEST', 'LOGOUT_SUCCESS', 'LOGOUT_FAILURE'],
    promise: () => {
      return new Promise((resolve, reject) => {
        API.get('/logout')
        .then(res => {
          window.location.href = '/'
          resolve(res)
        })
        .catch(e => {
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
          if (onSuccess) {
            delayCallback(() => onSuccess(res))
          }
          resolve(res)
          return null
        })
        .catch(e => {
          if (onFail) {
            delayCallback(() => onFail(e))
          }
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
          if (onSuccess) {
            delayCallback(() => onSuccess(res))
          }
          resolve(res)
        })
        .catch(e => {
          if (onFail) {
            delayCallback(() => onFail(e))
          }
          reject(e)
        })
      })
    }
  }
}

export function requestUpdateProfile({ profile, onSuccess, onFail }) {
  return {
    types: ['PROFILE_UPDATE_REQUEST', 'PROFILE_UPDATE_SUCCESS', 'PROFILE_UPDATE_FAILURE'],
    promise: () => {
      return new Promise((resolve, reject) => {
        API.put('/profile', profile)
        .then(res => {
          if (onSuccess) {
            delayCallback(() => onSuccess({ name: profile.name }))
          }
          resolve({ name: profile.name })
        })
        .catch(e => {
          if (onFail) {
            delayCallback(() => onFail(e))
          }
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
