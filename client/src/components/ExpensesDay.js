import React from 'react'

import ExpensesItem from './ExpensesItem'

const style = {
}

export default class ExpensesDay extends React.Component {
  render () {
    return (
      <div style={style.container}>
        <h2>{this.props.day.date}</h2>
        {
          this.props.day.expenses.map(e => {
            return (
              <ExpensesItem expense={e} key={e.id} />
            )
          })
        }
      </div>
    )
  }
}
