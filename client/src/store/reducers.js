export function drawer(state = { is_open: false }, action) {
  switch (action.type) {
    case 'SET_DRAWER':
      return {
        ...state,
        is_open: action.is_open
      }
    default:
      return state
  }
}

export function navbar(state = { title: '' }, action) {
  switch (action.type) {
    case 'SET_NAV_TITLE':
      return {
        ...state,
        title: action.title
      }
    default:
      return state
  }
}

export function expenses(state = { is_loading: false, data: [] }, action) {
  switch (action.type) {
    case 'LOAD_EXPENSES_REQUEST':
      return {
        ...state,
        is_loading: true
      }
    case 'LOAD_EXPENSES_FAILURE':
      return {
        ...state,
        is_loading: false
      }
    case 'LOAD_EXPENSES_SUCCESS':
      return {
        ...state,
        is_loading: false,
        data: action.result.expenses
      }
    default:
      return state
  }
}
