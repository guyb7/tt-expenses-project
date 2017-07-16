import Db from '../Database'
import Promise from 'bluebird'
import moment from 'moment'
import uuid from 'uuid/v4'
import _ from 'lodash'

const errors = {
  'something-went-wrong': 'Aww, something went wrong!',
  'error-creating-expense': 'Could not create this expense',
  'error-list-expenses': 'There was a problem listing your expenses',
  'no-such-expense': 'This expense does not exist',
  'error-get-expense': 'This expense could not be found',
  'error-update-expense': 'This expense does not exist or could not be updated',
  'error-delete-expense': 'This expense does not exist or could not be deleted'
}
const handleError = (res, err, defaultMessage = 'something-went-wrong') => {
  console.log('[ERR]', defaultMessage, err)
  res.status(401).json({
    success: false,
    error: {
      id: err.message || defaultMessage,
      text: errors[err.message] || err.message || errors[defaultMessage] || defaultMessage
    }
  })
}

const createExpense = (req, res) => {
  const expenseId = uuid()
  const params = [
    expenseId,
    req.user.id,
    moment(req.body.datetime).format(),
    req.body.amount,
    req.body.description || '',
    req.body.comment || ''
  ]
  Db.pool.query('INSERT INTO expenses (id, user_id, datetime, amount, description, comment) VALUES ($1, $2, $3, $4, $5, $6);', params)
  .then((result) => {
    if (result.rowCount !== 1) {
      console.error('Create expense failed', userId, req.body, err, result)
      reject(new Error())
    } else {
      res.json({
        success: true,
        expenseId
      })
    }
  })
  .catch(e => {
    handleError(res, e, 'error-creating-expense')
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
  const range = getDateRange(req.query)
  const params = [
    req.user.id,
    range.from,
    range.until
  ]
  Db.pool.query('SELECT id, datetime, amount, description, comment FROM expenses WHERE user_id = $1 AND datetime >= $2 AND datetime < $3;', params)
  .then((result) => {
    res.json({
      success: true,
      expenses: _.map(result.rows, normalizeRow)
    })
  })
  .catch(e => {
    handleError(res, e, 'error-list-expenses')
  })
}

const getExpense = (req, res) => {
  const params = [
    req.user.id,
    req.params.expenseId
  ]
  Db.pool.query('SELECT id, datetime, amount, description, comment FROM expenses WHERE user_id = $1 AND id = $2;', params)
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
    handleError(res, e, 'error-get-expense')
  })
}

const updateExpense = (req, res) => {
  const sqlFields = {
    // datetime: '2017-01-01 20:00:00',
    // amount: 3.30,
    // description: 'Party hats',
    // comment: 'New year'
  }
  _.each(['datetime', 'amount', 'description', 'comment'], f => {
    if (_.has(req.body, f)) {
      if (f === 'datetime') {
        sqlFields[f] = moment(req.body[f]).format()
      } else {
        sqlFields[f] = req.body[f]
      }
    }
  })
  if (_.keys(sqlFields).length === 0) {
    // Nothing to update
    return res.json({
      success: true
    })
  }
  const sql = []
  const params = []
  let n = 3
  _.each(sqlFields, (v, k) => {
    sql.push(k + '=$' + n)
    params.push(v)
    n++
  })
  Db.pool.query('UPDATE expenses SET ' + sql.join(', ') + ' WHERE user_id=$1 AND id=$2;', [req.user.id, req.params.expenseId, ...params])
  .then((result) => {
    if (result.rowCount !== 1) {
      throw new Error()
    } else {
      res.json({
        success: true
      })
    }
  })
  .catch(e => {
    handleError(res, e, 'error-update-expense')
  })
}

const deleteExpense = (req, res) => {
  Db.pool.query('DELETE FROM expenses WHERE user_id=$1 AND id=$2;', [req.user.id, req.params.expenseId])
  .then((result) => {
    if (result.rowCount !== 1) {
      throw new Error()
    } else {
      res.json({
        success: true
      })
    }
  })
  .catch(e => {
    handleError(res, e, 'error-delete-expense')
  })
}

export default {
  createExpense,
  listExpenses,
  getExpense,
  updateExpense,
  deleteExpense
}
