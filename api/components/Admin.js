import Db from '../Database'
import Errors from '../Errors'
import Users from './Users'
import Authentication from '../Authentication'
import Promise from 'bluebird'
import _ from 'lodash'

const listUsers = (req, res) => {
  let queryPromise
  if (req.user.role === 'admin') {
    queryPromise = Db.pool.query('SELECT id, username, name, role FROM users WHERE is_deleted=false')
  } else {
    queryPromise = Db.pool.query('SELECT id, username, name, role FROM users WHERE role != $1 AND role != $2 AND is_deleted=false', ['admin', 'manager'])
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
  return Db.pool.query('UPDATE users SET is_deleted=true WHERE id=$1', [userId])
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
}
