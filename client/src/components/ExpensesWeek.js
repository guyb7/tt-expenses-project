import React from 'react'
import _ from 'lodash'

import ExpensesDay from './ExpensesDay'
import { grey400 } from 'material-ui/styles/colors'

const style = {
  container: {
    maxWidth: 600,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  stats: {
    color: grey400,
    padding: 10,
    fontSize: 13,
    marginBottom: 30
  },
  statsItem: {
    padding: 10
  }
}

export default class ExpensesWeek extends React.Component {
  sumExpenses() {
    return _.reduce(this.props.days, (res, d) => {
      return res += _.reduce(d.expenses, (res, e) => {
        return res += parseFloat(e.amount)
      }, 0)
    }, 0).toFixed(2)
  }

  avgExpenses() {
    return (this.sumExpenses()/7).toFixed(2)
  }

  render () {
    return (
      <div style={style.container}>
        {
          this.props.days.map(d => {
            return (
              <ExpensesDay day={d} key={d.date} onExpenseOpen={this.props.onExpenseOpen} />
            )
          })
        }
        <div style={style.stats}>
          <div style={style.statsItem}>
            Total weekly expenses: ${this.sumExpenses()}
          </div>
          <div style={style.statsItem}>
            Average daily expense: ${this.avgExpenses()}
          </div>
        </div>
      </div>
    )
  }
}
