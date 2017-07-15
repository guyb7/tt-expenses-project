import Authentication from '../Authentication'
import Db from '../Database'

export default {
  get: async (req, res) => {
    Db.pool.query('SELECT sid FROM user_sessions', [])
    .then(sessions => {
      res.json({
        sessions: sessions.rows,
        user: req.user
      })
    })
  },

  login: (req, res, next) => {
    Authentication.authenticate(req, res, next)
  },

  success: async (req, res) => {
    req.session.isLoggedIn = true
    req.session.save()
    res.json({
      success: true
    })
  },

  error: (err, req, res, next) => {
    req.session.isLoggedIn = false
    req.session.save()
    res.status(401).json({
      success: false,
      error: {
        id: 'invalid-credentials',
        text: 'Wrong username or password'
      }
    })
  }
}
