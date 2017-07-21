import React from 'react'
import moment from 'moment'

import ExpensesDay from './ExpensesDay'

const style = {
  container: {
    maxWidth: 600,
    marginLeft: 'auto',
    marginRight: 'auto',
  }
}

export default class ExpensesWeek extends React.Component {
  render () {
    return (
      <div style={style.container}>
        {
          this.props.days.map(d => {
            return (
              <ExpensesDay day={d} key={d.date} />
            )
          })
        }
      </div>
    )
  }
}
