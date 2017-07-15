import Db from '../Database'
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
    Db.pool.query('INSERT INTO users (id, username, password, name, role) VALUES ($1, $2, $3, $4, $5);', params, (err, result) => {
      if (err || result.rowCount !== 1) {
        console.error('Create guest user failed', userId, err, result)
        reject (new Error('Could not create user'))
      } else {
        resolve({ req, userId })
      }
    })
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
    //TODO check for different errors
    console.log('Registration error', e)
    res.status(401).json({
      success: false,
      error: {
        id: 'wrong-registration-details',
        text: 'Could not create this account'
      }
    })
  })
}

const findUser = ({ id, username }) => {
  return new Promise((resolve, reject) => {
    let queryPromise
    if (id) {
      queryPromise = Db.pool.query('SELECT * FROM users WHERE id=$1 LIMIT 1', [id])
    } else if (username) {
      queryPromise = Db.pool.query('SELECT * FROM users WHERE username=$1 LIMIT 1', [username])
    }
    queryPromise
    .then(users => {
      if (users.rows.length !== 1) {
        reject(new Error('No such user'))
      } else {
        resolve({ user: users.rows[0] })
      }
    })
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
    console.log('Error getCurrent', e)
    res.status(400).json({
      success: false,
      error: {
        id: 'user-not-found',
        text: 'Could not find your user'
      }
    })
  })
}

export default {
  register,
  findUser,
  getCurrent
}
