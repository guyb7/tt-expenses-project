import express from 'express'
import Authentication from './Authentication'
import Admin from './components/Admin'
import Login from './components/Login'
import Users from './components/Users'
import Expenses from './components/Expenses'

const MountPublicRoutes = (app) => {
  app.post   ('/api/register', Users.register )
  app.post   ('/api/login', Login.login, Login.success, Login.error )
  app.get    ('/api/logout', Login.logout )
}

const MountAPIRoutes = (app) => {
  const ensureLogin = Authentication.ensureLogin
  app.get    ('/api/profile', ensureLogin, Users.getCurrent )
  app.put    ('/api/profile', ensureLogin, Users.update )
  app.get    ('/api/expenses', ensureLogin, Expenses.listExpenses )
  app.post   ('/api/expenses', ensureLogin, Expenses.createExpense )
  app.get    ('/api/expenses/:expenseId', ensureLogin, Expenses.getExpense )
  app.put    ('/api/expenses/:expenseId', ensureLogin, Expenses.updateExpense )
  app.delete ('/api/expenses/:expenseId', ensureLogin, Expenses.deleteExpense )
}

const MountAdminRoutes = (app) => {
  const ensureAdmin = Authentication.ensureAdmin
  app.get    ('/api/admin/users', ensureAdmin, Admin.listUsers )
  app.post   ('/api/admin/users', ensureAdmin, Users.register )
  app.get    ('/api/admin/users/:userId', ensureAdmin, Admin.getUser )
  app.put    ('/api/admin/users/:userId', ensureAdmin, Admin.updateUser )
  app.delete ('/api/admin/users/:userId', ensureAdmin, Admin.deleteUser )
  // app.get    ('/api/admin/users/:userId/expenses', ensureAdmin, Admin.getUserExpenses )
  // app.post   ('/api/admin/users/:userId/expenses', ensureAdmin, Admin.createExpenseForUser )
  // app.get    ('/api/admin/expenses/:expenseId', ensureAdmin, Admin.getExpense )
  // app.put    ('/api/admin/expenses/:expenseId', ensureAdmin, Admin.updateExpense )
  // app.delete ('/api/admin/expenses/:expenseId', ensureAdmin, Admin.deleteExpense )
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
    MountPublicRoutes(app)
    MountAPIRoutes(app)
    MountAdminRoutes(app)
    MountClientRoutes(app)
  }
}
