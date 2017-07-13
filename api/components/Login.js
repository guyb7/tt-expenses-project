import Db from '../Database'

export default {
  get: async (req, res) => {
    Db.pool.query('SELECT sid FROM user_sessions', [])
    .then(sessions => {
      res.json({
        sessions: sessions.rows
      })
    })
  },

  post: async (req, res) => {
    res.json({
      success: false,
      got: req.body
    })
  }
}
