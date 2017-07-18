import session from 'express-session'
import connectPg from 'connect-pg-simple'
import uuid from 'uuid/v4'
import Db from './Database'

const pgSession = connectPg(session)

export default {
  mount: (app) => {
    const options = {
      store: new pgSession({
        pool: Db.pool,
        schemaName: 'expenses',
        tableName: 'user_sessions'
      }),
      name: 'session',
      secret: process.env.COOKIE_SECRET,
      resave: false,
      saveUninitialized: true,
      cookie: { maxAge: Number(process.env.COOKIE_DAYS_TOEXPIRE) * 24 * 60 * 60 * 1000 },
      genid: (req) => {
        return uuid()
      }
    }
    app.set('trust proxy', true)
    app.use(session(options))
  }
}
