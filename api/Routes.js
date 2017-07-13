import express from 'express'
import Login from './components/Login'

const MountAPIRoutes = (app) => {
  app.get('/api/login', Login.get )
  app.post('/api/login', Login.post )
}

const MountClientRoutes = (app) => {
  app.get('/app/?.*', function (req, res) {
    res.sendFile('/client/build/index.html', { 'root': __dirname + '/../' })
  })

  app.get('/', function (req, res) {
    res.sendFile('/public/index.html', { 'root': __dirname + '/../' })
  })

  app.use('/app', express.static('client/build'))
  app.use(express.static('public'))
}

export default {
  mount: (app) => {
    MountAPIRoutes(app)
    MountClientRoutes(app)
  }
}
