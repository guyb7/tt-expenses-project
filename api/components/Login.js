import Authentication from '../Authentication'
import Db from '../Database'
import Errors from '../Errors'

export default {
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
    Errors.handleError(req, res, undefined, 'invalid-credentials')
  },

  logout: (req, res) => {
    req.session.isLoggedIn = false
    req.session.save()
    req.session.destroy()
    req.logout()
    res.json({
      success: true
    })
  }
}
