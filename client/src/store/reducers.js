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

const defaultUserState = {
  is_loading: false,
  logged_in: false,
  user_id: null,
  username: null,
  name: '',
  role: 'user'
}
export function user(state = defaultUserState, action) {
  switch (action.type) {
    case 'LOGIN_REQUEST':
      return state
    case 'LOGIN_FAILURE':
      return {
        ...state,
        logged_in: false
      }
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        logged_in: true
      }
    case 'REGISTER_REQUEST':
    case 'REGISTER_FAILURE':
    case 'REGISTER_SUCCESS':
      return state
    case 'PROFILE_REQUEST':
      return {
        ...state,
        is_loading: true
      }
    case 'PROFILE_FAILURE':
      return {
        ...state,
        is_loading: false
      }
    case 'PROFILE_SUCCESS':
      return {
        ...state,
        is_loading: false,
        logged_in: true,
        user_id: action.result.user_id,
        name: action.result.name,
        role: action.result.role
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
