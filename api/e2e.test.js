import '../env'
// process.env.PORT is 3003 - if changed, also modify testURL in package.json

import Promise from 'bluebird'
global.Promise = Promise
import axios from 'axios'
import axiosCookieJarSupport from '@3846masa/axios-cookiejar-support'
import tough from 'tough-cookie'
import fs from 'fs'
import Db from './Database'
import Server from './Server'

const BASE_URL = 'http://127.0.0.1:3003/api'
axiosCookieJarSupport(axios)

beforeAll(() => {
  const buildScriptSql = fs.readFileSync(__dirname + '/../db_migrations/latest.sql', 'utf8')
  return Db.query(buildScriptSql)
    .then(Db.query('SET search_path = expenses'))
    .then(Server.start)
    .catch(e => {
      if (e.message === 'schema "expenses" already exists') {
        console.log(`Make sure that the test DB is empty.\nMaybe the last run is not over or exited without cleaning?\nRun \`DROP SCHEMA expenses_test_db.expenses CASCADE;\` to drop the schema.`)
      }
    })
})

afterAll(() => {
  return Server.shutDown()
    .then(Db.query('DROP SCHEMA expenses CASCADE;'))
    .then(Db.disconnect)
})

describe('E2E Tests', () => {
  const user = {
    username: 'user1',
    password: '12341234',
    name: 'User1'
  }

  const expense = {
    "datetime": "2017-07-01 18:30:00",
    "amount": 10.50,
    "description": "Office supplies",
    "comment": "Paper clips"
  }

  const manager = {
    username: 'manager1',
    password: '12341234',
    name: 'Manager1'
  }

  describe('API Sanity Tests', () => {
    test('Server is running', () => {
      expect.assertions(1)
      return axios.get(BASE_URL + '/status')
      .then(response => {
        expect(response.data.success).toBe(true)
      })
    })
  })

  describe('Regular User Flow', () => {
    const userCookies = new tough.CookieJar()
    const userSession = axios.create({
      baseURL: BASE_URL,
      withCredentials: true,
      jar: userCookies,
      timeout: 200
    })

    test('New user is able to register', () => {
      expect.assertions(1)
      return userSession.post('/register', user)
      .then(response => {
        expect(response.status).toBe(200)
      })
    })

    test('User is able to login', () => {
      expect.assertions(1)
      return userSession.post('/login', user)
      .then(response => {
        expect(response.status).toBe(200)
      })
    })

    test('User is able to get his profile', () => {
      expect.assertions(1)
      return userSession.get('/profile')
      .then(response => {
        user.id = response.data.user.id
        expect(response.data.user.name).toEqual(user.name)
      })
    })

    test('User is able to update his profile', () => {
      const newName = 'User11'
      expect.assertions(1)
      return userSession.put('/profile', { name: newName })
      .then(response => userSession.get('/profile'))
      .then(response => {
        expect(response.data.user.name).toEqual(newName)
      })
    })

    test('User is able to create an expense', () => {
      expect.assertions(1)
      return userSession.post('/expenses', expense)
      .then(response => {
        expense.id = response.data.expenseId
        expect(response.data.expenseId).toBeDefined()
      })
    })

    test('User is able to find an expense', () => {
      expect.assertions(1)
      return userSession.get('/expenses?week=26&year=2017&day=monday')
      .then(response => {
        expect(response.data.expenses[0].id).toEqual(expense.id)
      })
    })

    test('User is able to view a specific expense', () => {
      expect.assertions(1)
      return userSession.get('/expenses/' + expense.id)
      .then(response => {
        expect(response.data.expense.description).toEqual(expense.description)
      })
    })

    test('User is able to update a specific expense', () => {
      const newDescription = 'Pizza!'
      expect.assertions(1)
      return userSession.put('/expenses/' + expense.id, { description: newDescription })
      .then(response => userSession.get('/expenses/' + expense.id))
      .then(response => {
        expense.description = newDescription
        expect(response.data.expense.description).toEqual(newDescription)
      })
    })

    test('User is able to delete a specific expense', () => {
      expect.assertions(1)
      return userSession.delete('/expenses/' + expense.id)
      .then(response => userSession.get('/expenses'))
      .then(response => {
        expect(response.data.expenses.length).toEqual(0)
      })
    })

    test('User is able to logout', () => {
      expect.assertions(1)
      return userSession.get('/logout')
      .then(response => {
        expect(response.status).toEqual(200)
      })
    })
  })

  describe('Manager User Flow', () => {
    const managerCookies = new tough.CookieJar()
    const managerSession = axios.create({
      baseURL: BASE_URL,
      withCredentials: true,
      jar: managerCookies,
      timeout: 200
    })

    beforeAll(() => {
      return managerSession.post('/register', manager)
        .then(response => {
          return Db.query('UPDATE users SET role=$2 WHERE username=$1;', [manager.username, 'manager'])
        })
        .then(response => managerSession.post('/login', manager))
    })

    test('Manager has a manger role', () => {
      expect.assertions(1)
      return managerSession.get('/profile')
      .then(response => {
        expect(response.data.user.role).toEqual('manager')
      })
    })

    test('Manager is able to list users', () => {
      expect.assertions(1)
      return managerSession.get('/admin/users')
      .then(response => {
        expect(response.data.users[0].id).toEqual(user.id)
      })
    })

    xtest('Manager is able to create users', done => {
      done()
    })

    xtest('Manager is able to view a specific user', done => {
      done()
    })

    xtest('Manager is able to update a specific user', done => {
      done()
    })

    xtest('Manager is able to delete a specific user', done => {
      done()
    })

    xtest('Manager is able to list expenses of a specific user', done => {
      done()
    })

    xtest('Manager is able to create an expense for a specific user', done => {
      done()
    })

    xtest('Manager is able to update an expense of a specific user', done => {
      done()
    })

    xtest('Manager is able to delete an expense of a specific user', done => {
      done()
    })
  })

  describe('Admin User Flow', () => {
    xtest('Admin is able to list managers', done => {
      done()
    })

    xtest('Admin is able to create managers', done => {
      done()
    })

    xtest('Admin is able to delete a manager', done => {
      done()
    })
  })

  describe('Security', () => {
    xtest('Users cannot register with an existing username', done => {
      done()
    })

    xtest('Users cannot login with a wrong password', done => {
      done()
    })

    xtest('Users cannot login after being deleted', done => {
      done()
    })

    xtest('Users cannot access other users', done => {
      done()
    })

    xtest('Managers cannot access other managers or admins', done => {
      done()
    })

    xtest('Sessions are terminated after deleting users', done => {
      done()
    })
  })

})
