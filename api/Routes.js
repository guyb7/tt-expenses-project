import express from 'express'
import Authentication from './Authentication'
import Users from './components/Users'
import Login from './components/Login'

const MountAPIRoutes = (app) => {
  app.post('/api/register', Users.register )
  // app.get ('/api/login', Authentication.ensureLogin, Login.get )
  app.post('/api/login', Login.login, Login.success, Login.error )
  app.get ('/api/logout', Login.logout )
  app.get ('/api/profile', Authentication.ensureLogin, Users.getCurrent )
  app.put ('/api/profile', Authentication.ensureLogin, Users.update )
}

const MountClientRoutes = (app) => {
  app.get ('/app/?.*', function (req, res) {
    res.sendFile('/client/build/index.html', { 'root': __dirname + '/../' })
  })

  app.get ('/', function (req, res) {
    res.sendFile('/public/index.html', { 'root': __dirname + '/../' })
  })

  app.use ('/app', express.static('client/build'))
  app.use(express.static('public'))
}

export default {
  mount: (app) => {
    MountAPIRoutes(app)
    MountClientRoutes(app)
  }
}
