import '../env'
// process.env.PORT is 3003 - if changed, also modify testURL in package.json

import axios from 'axios'
import fs from 'fs'
import Db from './Database'
import Server from './Server'

const instance = axios.create({
  baseURL: 'http://127.0.0.1:3003/api/',
  withCredentials: true,
  timeout: 200
})

beforeAll(() => {
  const buildScriptSql = fs.readFileSync(__dirname + '/../db_migrations/latest.sql', 'utf8')
  return Db.pool.query(buildScriptSql)
    .then(Server.start)
    .catch(e => {
      if (e.message === 'schema "expenses" already exists') {
        console.log(`Make sure that the test DB is empty.\nMaybe the last run is not over or exited without cleaning?\nRun \`DROP SCHEMA expenses_test_db.expenses CASCADE;\` to drop the schema.`)
      }
    })
})

afterAll(() => {
  Server.shutDown()
    .then(Db.pool.query('DROP SCHEMA expenses CASCADE;'))
    .then(Db.disconnect)
})

describe('E2E Tests', () => {

  describe('API Sanity Tests', () => {
    test('Server is running', done => {
      instance.get('/status')
      .then((response) => {
        expect(response.data.success).toBe(true)
        done()
      })
      .catch(error => {
        console.log(error)
      })
    })
  })

  describe('Regular User Flow', () => {
    xtest('New user is able to register', done => {
      instance.post('/register', { username: 'user1', password: '12341234' })
      .then((response) => {
        expect(response.status).toBe(200)
        done()
      })
      .catch(error => {
        console.log(error)
      })
    })

    xtest('User is able to login', done => {
      done()
    })

    xtest('User is able to get his profile', done => {
      done()
    })

    xtest('User is able to update his profile', done => {
      done()
    })

    xtest('User is able to update his profile', done => {
      done()
    })

    xtest('User is able to create an expense', done => {
      done()
    })

    xtest('User is able to find an expense', done => {
      done()
    })

    xtest('User is able to view a specific expense', done => {
      done()
    })

    xtest('User is able to update a specific expense', done => {
      done()
    })

    xtest('User is able to delete a specific expense', done => {
      done()
    })

    xtest('User is able to logout', done => {
      done()
    })
  })

  describe('Manager User Flow', () => {
    xtest('Manager is able to list users', done => {
      done()
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
