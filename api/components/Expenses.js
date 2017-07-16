import Db from '../Database'
import Promise from 'bluebird'
import moment from 'moment'
import uuid from 'uuid/v4'
import _ from 'lodash'

const createExpense = (req, res) => {
  const expenseId = uuid()
  const params = [
    expenseId,
    req.user.id,
    req.body.datetime,
    req.body.amount,
    req.body.description || '',
    req.body.comment || ''
  ]
  Db.pool.query('INSERT INTO expenses (id, user_id, datetime, amount, description, comment) VALUES ($1, $2, $3, $4, $5, $6);', params)
  .then((result) => {
    if (result.rowCount !== 1) {
      console.error('Create expense failed', userId, req.body, err, result)
      reject (new Error('Could not create expense'))
    } else {
      res.json({
        success: true,
        expenseId
      })
    }
  })
  .catch(e => {
    //TODO check for different errors
    console.log('Create expense failed', e)
    res.status(401).json({
      success: false,
      error: {
        id: 'error-creating-expense',
        text: 'Could not create this expense'
      }
    })
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
      expenses: result.rows
    })
  })
  .catch(e => {
    //TODO check for different errors
    console.log('List expenses failed', e)
    res.status(401).json({
      success: false,
      error: {
        id: 'error-list-expenses',
        text: 'There was a problem listing your expenses'
      }
    })
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
      throw new Error('This expense does not exist')
    }
    res.json({
      success: true,
      expense: result.rows[0]
    })
  })
  .catch(e => {
    //TODO check for different errors
    console.log('Get expense failed', e)
    res.status(401).json({
      success: false,
      error: {
        id: 'error-get-expense',
        text: 'This expense could not be found'
      }
    })
  })
}

export default {
  createExpense,
  listExpenses,
  getExpense,
  // updateExpense,
  // deleteExpense
}
