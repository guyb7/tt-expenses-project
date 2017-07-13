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

export function loadTeams() {
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
