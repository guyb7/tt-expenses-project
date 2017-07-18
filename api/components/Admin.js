import Db from '../Database'
import Errors from '../Errors'
import Users from './Users'
import Expenses from './Expenses'
import Authentication from '../Authentication'
import Promise from 'bluebird'
import _ from 'lodash'

const listUsers = (req, res) => {
  let queryPromise
  if (req.user.role === 'admin') {
    queryPromise = Db.query('SELECT id, username, name, role FROM users WHERE is_deleted=false')
  } else {
    queryPromise = Db.query('SELECT id, username, name, role FROM users WHERE role != $1 AND role != $2 AND is_deleted=false', ['admin', 'manager'])
  }
  queryPromise
  .then(users => {
    res.json({
      success: true,
      users: users.rows
    })
  })
  .catch(e => {
    Errors.handleError(req, res, e, 'error-listing-users')
  })
}

const getUser = (req, res) => {
  Users.findUser({ unknown: req.params.userId })
  .then(({ user }) => ensurePermission({ user: req.user, resource: { role: user.role }, payload: user }))
  .then((user) => {
    res.json({
      success: true,
      user: _.pick(user, ['id', 'username', 'name', 'role'])
    })
  })
  .catch(e => {
    Errors.handleError(req, res, e, 'no-such-user')
  })
}

const updateUser = (req, res) => {
  Users.findUser({ unknown: req.params.userId })
  .then(({ user }) => ensurePermission({ user: req.user, resource: { role: user.role }, payload: user }))
  .then((user) => {
    Users.updateUser(user.id, { name: req.body.name })
    .then(() => {
      res.json({
        success: true
      })
    })
  })
  .catch(e => {
    Errors.handleError(req, res, e, 'no-such-user')
  })
}

const deleteUser = (req, res) => {
  Users.findUser({ unknown: req.params.userId })
  .then(({ user }) => ensurePermission({ user: req.user, resource: { role: user.role }, payload: user }))
  .then((user) => {
    markDeletedUser(user.id)
    .then(Authentication.destroyUserSession({ userId: user.id }))
    .then(() => {
      res.json({
        success: true
      })
    })
  })
  .catch(e => {
    Errors.handleError(req, res, e, 'no-such-user')
  })
}

const markDeletedUser = (userId) => {
  return Db.query('UPDATE users SET is_deleted=true WHERE id=$1', [userId])
}

const listUserExpenses = (req, res) => {
  Users.findUser({ unknown: req.params.userId })
  .then(({ user }) => ensurePermission({ user: req.user, resource: { role: user.role }, payload: user }))
  .then((user) => {
    Expenses.findExpenses(user.id, req.query)
    .then(({ expenses }) => {
      res.json({
        success: true,
        expenses
      })
    })
    .catch(e => {
      Errors.handleError(req, res, e, 'error-list-expenses')
    })
  })
  .catch(e => {
    Errors.handleError(req, res, e, 'no-such-user')
  })
}

const getExpense = (req, res) => {
  Expenses.getExpenseId(req.params.expenseId)
  .then(({ expense }) => ensurePermission({ user: req.user, resource: { role: expense.user_role }, payload: expense }))
  .then(( expense ) => {
    res.json({
      success: true,
      expense
    })
  })
  .catch(e => {
    Errors.handleError(req, res, e, 'no-such-expense')
  })
}

const createExpenseForUser = (req, res) => {
  Users.findUser({ unknown: req.params.userId })
  .then(({ user }) => ensurePermission({ user: req.user, resource: { role: user.role }, payload: user }))
  .then(( user ) => Expenses.createExpenseToUser({ userId: user.id, expense: req.body }))
  .then(() => {
    res.json({
      success: true
    })
  })
  .catch(e => {
    Errors.handleError(req, res, e, 'no-such-user')
  })
}

const updateExpense = (req, res) => {
  Expenses.getExpenseId(req.params.expenseId)
  .then(({ expense }) => ensurePermission({ user: req.user, resource: { role: expense.user_role }, payload: expense }))
  .then(( expense ) => Expenses.updateExpenseId({ userId: expense.user_id, expenseId: expense.id, reqBody: req.body }))
  .then(() => {
    res.json({
      success: true
    })
  })
  .catch(e => {
    Errors.handleError(req, res, e, 'no-such-expense')
  })
}

const deleteExpense = (req, res) => {
  Expenses.getExpenseId(req.params.expenseId)
  .then(({ expense }) => ensurePermission({ user: req.user, resource: { role: expense.user_role }, payload: expense }))
  .then(( expense ) => Expenses.deleteExpenseId({ userId: expense.user_id, expenseId: expense.id }))
  .then(() => {
    res.json({
      success: true
    })
  })
  .catch(e => {
    Errors.handleError(req, res, e, 'no-such-expense')
  })
}

const ensurePermission = ({ user, resource, payload }) => {
  return new Promise((resolve, reject) => {
    const unauthorizedErr = new Error('unauthorized')
    if (user.role === 'admin') {
      resolve(payload)
    }
    if (resource.role) {
      if (user.role === 'manager') {
        if (resource.role === 'user') {
          resolve(payload)
        } else {
          reject(unauthorizedErr)
        }
      } else {
        reject(unauthorizedErr)
      }
    }
    reject(unauthorizedErr)
  })
}

export default {
  test: (req, res) => {
    res.json({
      success: true,
      admin: true
    })
  },

  listUsers,
  getUser,
  updateUser,
  deleteUser,
  listUserExpenses,
  getExpense,
  updateExpense,
  createExpenseForUser,
  deleteExpense
}
