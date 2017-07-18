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

  const admin = {
    username: 'admin1',
    password: '12341234',
    name: 'Admin1'
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
    const user2 = {
      username: 'user2',
      password: '12341234',
      name: 'User2'
    }

    const expense2 = {
      "datetime": "2017-07-01 18:30:00",
      "amount": 2.50,
      "description": "Soda",
      "comment": "Pepsi"
    }

    const managerCookies = new tough.CookieJar()
    const managerSession = axios.create({
      baseURL: BASE_URL,
      withCredentials: true,
      jar: managerCookies,
      timeout: 200,
      validateStatus: (status) => {
        return status < 500;
      }
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

    test('Manager is able to create users', () => {
      expect.assertions(1)
      return managerSession.post('/admin/users', user2)
      .then(response => {
        user2.id = response.data.userId
        return managerSession.get('/admin/users')
      })
      .then(response => {
        expect(response.data.users.length).toEqual(2)
      })
    })

    test('Manager is able to view a specific user', () => {
      expect.assertions(1)
      return managerSession.get('/admin/users/' + user2.username)
      .then(response => {
        expect(response.data.user.id).toEqual(user2.id)
      })
    })

    test('Manager is able to update a specific user', () => {
      const newName = 'User22'
      expect.assertions(1)
      return managerSession.put('/admin/users/' + user2.username, { name: newName })
      .then(response => managerSession.get('/admin/users/' + user2.username))
      .then(response => {
        user2.name = newName
        expect(response.data.user.name).toEqual(newName)
      })
    })

    test('Manager is able to create an expense for a specific user', () => {
      expect.assertions(1)
      return managerSession.post('/admin/users/' + user2.username + '/expenses', expense2)
      .then(response => {
        expense2.id = response.data.expenseId
        expect(response.status).toEqual(200)
      })
    })

    test('Manager is able to view an expense of another user', () => {
      expect.assertions(1)
      return managerSession.get('/admin/expenses/' + expense2.id)
      .then(response => {
        expect(response.data.expense.user_id).toEqual(user2.id)
      })
    })

    test('Manager is able to update an expense of another user', () => {
      const newDescription = 'Drinks!'
      expect.assertions(1)
      return managerSession.put('/admin/expenses/' + expense2.id, { description: newDescription })
      .then(response => {
        expense2.description = newDescription
        return managerSession.get('/admin/expenses/' + expense2.id)
      })
      .then(response => {
        expect(response.data.expense.decsription).toEqual(expense2.decsription)
      })
    })

    test('Manager is able to list expenses of a specific user', () => {
      expect.assertions(1)
      return managerSession.get('/admin/users/' + user2.username + '/expenses', { params: {
        week: 26,
        year: 2017,
        day: 'monday'
      }})
      .then(response => {
        expect(response.data.expenses[0].id).toEqual(expense2.id)
      })
    })

    test('Manager is able to delete an expense of another user', () => {
      expect.assertions(1)
      return managerSession.delete('/admin/expenses/' + expense2.id)
      .then(response => managerSession.get('/admin/users/' + user2.username + '/expenses', { params: {
        week: 26,
        year: 2017,
        day: 'monday'
      }}))
      .then(response => {
        expect(response.data.expenses.length).toEqual(0)
      })
    })

    test('Manager is able to delete a specific user', () => {
      expect.assertions(2)
      return managerSession.delete('/admin/users/' + user2.username)
      .then(response => {
        return managerSession.get('/admin/users/' + user2.id)
        .then(response => {
          expect(response.data.success).toEqual(false)
          expect(response.data.error.id).toEqual('no-such-user')
        })
      })
    })
  })

  describe('Admin User Flow', () => {
    const manager2 = {
      username: 'manager2',
      password: '12341234',
      name: 'Manager2',
      role: 'manager'
    }

    const adminCookies = new tough.CookieJar()
    const adminSession = axios.create({
      baseURL: BASE_URL,
      withCredentials: true,
      jar: adminCookies,
      timeout: 200,
      validateStatus: (status) => {
        return status < 500;
      }
    })

    beforeAll(() => {
      return adminSession.post('/register', admin)
      .then(response => {
        return Db.query('UPDATE users SET role=$2 WHERE username=$1;', [admin.username, 'admin'])
      })
      .then(response => adminSession.post('/login', admin))
    })

    test('Admin has a manger role', () => {
      expect.assertions(1)
      return adminSession.get('/profile')
      .then(response => {
        expect(response.data.user.role).toEqual('admin')
      })
    })

    test('Admin is able to create managers', () => {
      expect.assertions(2)
      return adminSession.post('/admin/users', manager2)
      .then(response => {
        manager2.id = response.data.userId
        return adminSession.get('/admin/users')
      })
      .then(response => adminSession.get('/admin/users/' + manager2.username))
      .then(response => {
        expect(response.data.user.id).toEqual(manager2.id)
        expect(response.data.user.role).toEqual('manager')
      })
    })

    test('Admin is able to list managers', () => {
      expect.assertions(1)
      return adminSession.get('/admin/users')
      .then(response => {
        const managers = response.data.users.filter(u => u.role === 'manager')
        expect(managers.length).toBeGreaterThan(0)
      })
    })

    test('Admin is able to delete a manager', () => {
      expect.assertions(2)
      return adminSession.delete('/admin/users/' + manager2.username)
      .then(response => {
        return adminSession.get('/admin/users/' + manager2.id)
        .then(response => {
          expect(response.data.success).toEqual(false)
          expect(response.data.error.id).toEqual('no-such-user')
        })
      })
    })
  })

  describe('Security', () => {
    const user3 = {
      username: 'user3',
      password: '12341234',
      name: 'User3'
    }
    const user4 = {
      username: 'user4',
      password: '12341234',
      name: 'User4'
    }
    const manager3 = {
      username: 'manager3',
      password: '12341234',
      name: 'Manager3',
      role: 'manager'
    }

    const userCookies = new tough.CookieJar()
    const userSession = axios.create({
      baseURL: BASE_URL,
      withCredentials: true,
      jar: userCookies,
      timeout: 200,
      validateStatus: (status) => {
        return status < 500;
      }
    })

    const adminCookies = new tough.CookieJar()
    const adminSession = axios.create({
      baseURL: BASE_URL,
      withCredentials: true,
      jar: adminCookies,
      timeout: 200,
      validateStatus: (status) => {
        return status < 500;
      }
    })

    test('Users cannot register with an existing username', () => {
      expect.assertions(2)
      return userSession.post('/register', user3)
      .then(response => userSession.post('/register', user3))
      .then(response => {
        expect(response.data.success).toEqual(false)
        expect(response.data.error.id).toEqual('error-creating-user')
      })
    })

    test('Users cannot login with a wrong password', () => {
      expect.assertions(2)
      return userSession.post('/login', {
        username: user3.username,
        password: user3.password + '_nope'
      })
      .then(response => {
        expect(response.data.success).toEqual(false)
        expect(response.data.error.id).toEqual('invalid-credentials')
      })
    })

    test('Users cannot login after being deleted', () => {
      expect.assertions(2)
      return adminSession.post('/login', admin)
      .then(response => adminSession.delete('/admin/users/' + user3.username))
      .then(response => {
        return userSession.post('/login', user3)
        .then(response => {
          expect(response.data.success).toEqual(false)
          expect(response.data.error.id).toEqual('invalid-credentials')
        })
      })
    })

    test('Users cannot access other users', () => {
      expect.assertions(2)
      return userSession.post('/register', user4)
      .then(response => userSession.post('/login', user4))
      .then(response => userSession.get('/admin/users/' + user.username))
      .then(response => {
        expect(response.data.success).toEqual(false)
        expect(response.data.error.id).toEqual('unauthorized')
      })
    })

    test('Managers cannot access other managers or admins', () => {
      expect.assertions(4)
      return adminSession.post('/login', admin)
      .then(response => adminSession.post('/admin/users', manager3))
      .then(response => userSession.post('/login', manager3))
      .then(response => userSession.get('/admin/users/' + manager.username))
      .then(response => {
        expect(response.data.success).toEqual(false)
        expect(response.data.error.id).toEqual('unauthorized')
      })
      .then(response => userSession.get('/admin/users/' + admin.username))
      .then(response => {
        expect(response.data.success).toEqual(false)
        expect(response.data.error.id).toEqual('unauthorized')
      })
    })
  })
})
