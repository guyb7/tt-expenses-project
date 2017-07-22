import React from 'react'
import moment from 'moment'

import ExpensesItem from './ExpensesItem'
import FlatButton from 'material-ui/FlatButton'
import { Card } from 'material-ui/Card';
import { teal500, grey200, grey400, grey700 } from 'material-ui/styles/colors'

const style = {
  card: {
    borderLeftWidth: 4,
    borderLeftStyle: 'solid',
    borderLeftColor: teal500
  },
  emptyCard: {
    borderLeftWidth: 3,
    borderLeftStyle: 'solid',
    borderLeftColor: grey400
  },
  container: {
    marginTop: 30,
    marginBottom: 30,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'start',
  },
  date: {
    width: 80,
    padding: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'start',
    borderRightWidth: 1,
    borderRightStyle: 'solid',
    borderRightColor: grey200,
    alignSelf: 'stretch'
  },
  dateMonthDay: {
    fontSize: 18,
    color: grey700,
  },
  dateWeekDay: {
    fontSize: 15,
    color: grey400,
  },
  expenses: {
    flex: 1
  },
  noExpensesMsg: {
    padding: 10,
    marginTop: 10,
    textAlign: 'center',
    fontSize: 13,
    color: grey400
  },
  addButton: {
    fontSize: 13,
    color: grey400,
    alignSelf: 'flex-end'
  }
}

export default class ExpensesDay extends React.Component {
  monthDay(date) {
    return moment(date).format('D')
  }

  weekDay(date) {
    return moment(date).format('ddd')
  }

  render () {
    return (
      <Card style={this.props.day.expenses.length > 0 ? style.card : style.emptyCard}>
        <div style={style.container}>
          <div style={style.date}>
            <div style={style.dateMonthDay}>
              {this.monthDay(this.props.day.date)}
            </div>
            <div style={style.dateWeekDay}>
              {this.weekDay(this.props.day.date)}
            </div>
          </div>
          <div style={style.expenses}>
            {
              this.props.day.expenses.map(e => {
                return (
                  <ExpensesItem expense={e} key={e.id} onExpenseOpen={this.props.onExpenseOpen} />
                )
              })
            }
            {
              this.props.day.expenses.length === 0 &&
              <div style={style.noExpensesMsg}>
                No expenses on this day
              </div>
            }
          </div>
          {
            false &&
            <FlatButton
              style={style.addButton}
              label="Add"
            />
          }
        </div>
      </Card>
    )
  }
}
