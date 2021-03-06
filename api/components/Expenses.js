import Db from '../Database'
import Errors from '../Errors'
import Promise from 'bluebird'
import moment from 'moment'
import uuid from 'uuid/v4'
import _ from 'lodash'

const createExpense = (req, res) => {
  createExpenseToUser({ userId: req.user.id, expense: req.body })
  .then(({ expenseId }) => {
    res.json({
      success: true,
      expenseId
    })
  })
  .catch(e => {
    Errors.handleError(req, res, e, 'error-creating-expense')
  })
}

const createExpenseToUser = ({ userId, expense }) => {
  return new Promise((resolve, reject) => {
    const expenseId = uuid()
    const params = [
      expenseId,
      userId,
      moment(expense.datetime).format(),
      expense.amount,
      expense.description || '',
      expense.comment || ''
    ]
    Db.query('INSERT INTO expenses (id, user_id, datetime, amount, description, comment) VALUES ($1, $2, $3, $4, $5, $6);', params)
    .then((result) => {
      if (result.rowCount !== 1) {
        reject()
      } else {
        resolve({ expenseId })
      }
    })
    .catch(reject)
  })
}

const getDateRange = (query) => {
  const from = {
    year: moment().year(),
    week: moment().week(),
    day: 'monday'
  }
  if (query.week) {
    from.week = Number(query.week)
    if (query.year) {
      from.year = Number(query.year)
    }
  }
  if (query.day && _.indexOf(['sunday', 'monday'], query.day) > -1) {
    from.day = query.day
  }
  const start = moment().utc().year(from.year).week(from.week).day(from.day).hour(0).minute(0).second(0)
  return {
    from: start.format(),
    until: moment(start).add(1, 'weeks').format()
  }
}

const normalizeRow = row => {
  if (row.datetime) {
    row.datetime = moment(row.datetime).format()
  }
  return row
}

const listExpenses = (req, res) => {
  findExpenses(req.user.id, req.query)
  .then(({ expenses }) => {
    res.json({
      success: true,
      expenses
    })
  })
  .catch(e => {
    Errors.handleError(req, res, e, 'error-list-expenses')
  })
}

const findExpenses = (userId, query) => {
  return new Promise((resolve, reject) => {
    const range = getDateRange(query)
    const params = [
      userId,
      range.from,
      range.until
    ]
    Db.query('SELECT id, datetime, amount, description, comment FROM expenses WHERE user_id = $1 AND datetime >= $2 AND datetime < $3;', params)
    .then((result) => {
      resolve({
        expenses: _.map(result.rows, normalizeRow)
      })
    })
    .catch(reject)
  })
}

const getExpense = (req, res) => {
  const params = [
    req.user.id,
    req.params.expenseId
  ]
  Db.query('SELECT id, datetime, amount, description, comment FROM expenses WHERE user_id = $1 AND id = $2;', params)
  .then((result) => {
    if (result.rows.length !== 1) {
      throw new Error('no-such-expense')
    }
    res.json({
      success: true,
      expense: normalizeRow(result.rows[0])
    })
  })
  .catch(e => {
    Errors.handleError(req, res, e, 'error-get-expense')
  })
}

const getExpenseId = (id) => {
  return new Promise((resolve, reject) => {
    Db.query('SELECT e.id, datetime, amount, description, comment, user_id, u.username, u.role AS user_role FROM expenses e JOIN users u ON e.user_id = u.id WHERE e.id = $1;', [id])
    .then((result) => {
      if (result.rows.length !== 1) {
        reject(new Error('no-such-expense'))
      } else {
        resolve({
          expense: normalizeRow(result.rows[0])
        })
      }
    })
    .catch(reject)
  })
}

const updateExpense = (req, res) => {
  updateExpenseId({ userId: req.user.id, expenseId: req.params.expenseId, reqBody: req.body })
  .then(() => {
    res.json({
      success: true
    })
  })
  .catch(e => {
    Errors.handleError(req, res, e, 'error-update-expense')
  })
}

const updateExpenseId = ({ userId, expenseId, reqBody }) => {
  return new Promise((resolve, reject) => {
    const sqlFields = {
      // datetime: '2017-01-01 20:00:00',
      // amount: 3.30,
      // description: 'Party hats',
      // comment: 'New year'
    }
    _.each(['datetime', 'amount', 'description', 'comment'], f => {
      if (_.has(reqBody, f)) {
        if (f === 'datetime') {
          sqlFields[f] = moment(reqBody[f]).format()
        } else {
          sqlFields[f] = reqBody[f]
        }
      }
    })
    if (_.keys(sqlFields).length === 0) {
      resolve() // Nothing to update
    }
    const sql = []
    const params = []
    let n = 3
    _.each(sqlFields, (v, k) => {
      sql.push(k + '=$' + n)
      params.push(v)
      n++
    })
    Db.query('UPDATE expenses SET ' + sql.join(', ') + ' WHERE user_id=$1 AND id=$2;', [userId, expenseId, ...params])
    .then((result) => {
      if (result.rowCount !== 1) {
        throw new Error()
      } else {
        resolve()
      }
    })
    .catch(reject)
  })
}

const deleteExpense = (req, res) => {
  deleteExpenseId({ userId: req.user.id, expenseId: req.params.expenseId })
  .then(() => {
    res.json({
      success: true
    })
  })
  .catch(e => {
    Errors.handleError(req, res, e, 'error-delete-expense')
  })
}

const deleteExpenseId = ({ userId, expenseId }) => {
  return new Promise((resolve, reject) => {
    Db.query('DELETE FROM expenses WHERE user_id=$1 AND id=$2;', [userId, expenseId])
    .then(result => {
      if (result.rowCount !== 1) {
        reject()
      } else {
        resolve()
      }
    })
    .catch(reject)
  })
}

export default {
  createExpense,
  listExpenses,
  getExpense,
  updateExpense,
  deleteExpense,
  findExpenses,
  getExpenseId,
  updateExpenseId,
  createExpenseToUser,
  deleteExpenseId
}
