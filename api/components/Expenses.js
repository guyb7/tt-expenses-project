import Db from '../Database'
import Promise from 'bluebird'
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

export default {
  createExpense,
  // findExpenses,
  // updateExpense,
  // deleteExpense
}
