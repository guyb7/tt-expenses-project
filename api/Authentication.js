import passport from 'passport'
import LocalStrategy from 'passport-local'
import Promise from 'bluebird'
import bcrypt from 'bcrypt'
import _ from 'lodash'
import Db from './Database'
import Users from './components/Users'
import Errors from './Errors'

const findUser = (username, password) => {
  return new Promise((resolve, reject) => {
    Users.findUser({ username })
    .then(user => resolve({ user: user.user, password }))
    .catch(e => reject(e))
  })
}

const validatePassword = ({ user, password }) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, user.password).then((res) => {
      if (res === true) {
        resolve({ user })
      } else {
        reject(new Error('Invalid password'))
      }
    })
    .catch(e => reject(e))
  })
}

const SetupPassport = (app) => {
  passport.use(new LocalStrategy(
    (username, password, done) => {
      findUser(username, password)
      .then(validatePassword)
      .then(({ user }) => {
        done(null, user)
      })
      .catch(e => {
        done(null, false, { message: 'Incorrect username or password.' })
      })
    }
  ))

  passport.serializeUser((user, done) => {
    done(null, { id: user.id, username: user.username, name: user.name, role: user.role })
  })

  passport.deserializeUser((id, done) => {
    console.error('deserializeUser', id)
    done(null, null)
  })

  app.use(passport.initialize())
}

const ensureLogin = (req, res, next) => {
  if (req.session && req.session.isLoggedIn === true) {
    req.user = req.session.passport.user
    return next()
  }
  req.session.isLoggedIn = false
  req.session.save()
  Errors.handleError(req, res, undefined, 'session-expired')
}

const ensureAdmin = (req, res, next) => {
  ensureLogin(req, res, () => {
    if (_.has(req, 'session.passport.user.role') && req.session.isLoggedIn === true && _.indexOf(['admin', 'manager'], req.session.passport.user.role) > -1) {
      return next()
    }
    Errors.handleError(req, res, undefined, 'unauthorized')
  })
}

const destroyUserSession = ({ userId, username }) => {
  return new Promise((resolve, reject) => {
    const query = { passport: {user: {}}}
    if (!_.isNil(userId)) {
      query.passport.user.id = userId
    }
    if (!_.isNil(username)) {
      query.passport.user.username = username
    }
    if (_.keys(query.passport.user).length === 0) {
      return resolve()
    }
    Db.query('DELETE FROM user_sessions WHERE sess::jsonb @> $1::jsonb;', [query])
      .then(res => {
        resolve()
      })
      .catch(e => {
        reject(e)
      })
  })
}

export default {
  mount: (app) => {
    SetupPassport(app)
  },

  authenticate: passport.authenticate('local', { failWithError: true }),

  ensureLogin,
  
  ensureAdmin,

  destroyUserSession,

  findUser,

  validatePassword
}
