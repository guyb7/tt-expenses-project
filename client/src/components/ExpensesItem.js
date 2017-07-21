import React from 'react'

const style = {
  container: {
    padding: 10
  }
}

export default class ExpensesItem extends React.Component {
  render () {
    return (
      <div style={style.container}>
        {this.props.expense.time} | {this.props.expense.description} | {this.props.expense.amount} | {this.props.expense.comment}
      </div>
    )
  }
}
