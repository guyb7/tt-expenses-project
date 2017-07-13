import express from 'express'
import Login from './components/Login'

const MountAPIRoutes = (app) => {
  app.get('/api/login', Login.get )
}

const MountClientRoutes = (app) => {
  app.get('/', function (req, res) {
    res.sendFile('/public/index.html', { 'root': __dirname + '/../' })
  })
}

export default {
  mount: (app) => {
    MountAPIRoutes(app)
    MountClientRoutes(app)
  }
}
