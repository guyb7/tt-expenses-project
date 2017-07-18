import Db from '../Database'
import Errors from '../Errors'
import bcrypt from 'bcrypt'
import Promise from 'bluebird'
import uuid from 'uuid/v4'
import _ from 'lodash'

const saltRounds = 10

const validateRegistrationRequest = ({ req }) => {
  return new Promise((resolve, reject) => {
    if (!req.body.username) {
      reject(new Error('Missing username parameter'))
    } else if (req.body.username.length < 4) {
      reject(new Error('username must be at least 4 characters long'))
    } else if (!req.body.password) {
      reject(new Error('Missing password parameter'))
    } else if (req.body.password.length < 4) {
      reject(new Error('password must be at least 4 characters long'))
    } else if (req.body.role && _.indexOf(['user', 'manager', 'admin'], req.body.role) === -1) {
      reject(new Error('Invalid role'))
    } else if ((req.body.role === 'admin' || req.body.role === 'manager') && req.user.role !== 'admin') {
      reject(new Error('You are not permitted to create admin accounts'))
    }
    resolve({ req })
  })
}

const getHash = ({ req }) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(req.body.password, saltRounds).then((hash) => {
      resolve({ req, hash })
    })
  })
}

const createNewUser = ({ req, hash }) => {
  // { username, password_hash, name, role }
  return new Promise((resolve, reject) => {
    const userId = uuid()
    const params = [
      userId,
      req.body.username,
      hash,
      req.body.name || 'User',
      req.body.role || 'user'
    ]
    Db.query('INSERT INTO users (id, username, password, name, role) VALUES ($1, $2, $3, $4, $5);', params)
    .then(result => {
      if (result.rowCount !== 1) {
        reject (new Error('error-creating-user'))
      } else {
        resolve({ req, userId })
      }
    })
    .catch(reject)
  })
}

const register = (req, res) => {
  validateRegistrationRequest({ req })
  .then(getHash)
  .then(createNewUser)
  .then(({ userId }) => {
    res.json({
      success: true,
      userId
    })
  })
  .catch(e => {
    Errors.handleError(req, res, e, 'wrong-registration-details')
  })
}

const findUser = ({ id, username, unknown }) => {
  return new Promise((resolve, reject) => {
    if (unknown) {
      if (unknown.length === 36 ) {
        id = unknown
      } else {
        username = unknown
      }
    }
    let queryPromise
    if (id) {
      queryPromise = Db.query('SELECT * FROM users WHERE id=$1 AND is_deleted=false LIMIT 1', [id])
    } else if (username) {
      queryPromise = Db.query('SELECT * FROM users WHERE username=$1 AND is_deleted=false LIMIT 1', [username])
    }
    queryPromise
    .then(users => {
      if (users.rows.length !== 1) {
        reject(new Error('no-such-user'))
      } else {
        resolve({ user: users.rows[0] })
      }
    })
    .catch(reject)
  })
}

const getCurrent = (req, res) => {
  findUser({ id: req.user.id })
  .then(({ user }) => {
    res.json({
      success: true,
      user: _.pick(user, ['id', 'username', 'name', 'role'])
    })
  })
  .catch(e => {
    Errors.handleError(req, res, e, 'user-not-found')
  })
}

const update = (req, res) => {
  updateUser(req.user.id, { name: req.body.name })
  .then(result => {
    res.json({
      success: true
    })
  })
  .catch(e => {
    Errors.handleError(req, res, e, 'error-updating-user')
  })
}

const updateUser = (id, { name }) => {
  return new Promise((resolve, reject) => {
    Db.query('UPDATE users SET name=$2 WHERE id=$1 AND is_deleted=false', [id, name])
    .then(result => {
      resolve()
    })
    .catch(reject)
  })
}

export default {
  register,
  findUser,
  getCurrent,
  update,
  updateUser
}
