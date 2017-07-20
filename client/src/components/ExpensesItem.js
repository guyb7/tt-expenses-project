import React from 'react'

const style = {
}

export default class ExpensesItem extends React.Component {
  render () {
    return (
      <div style={style.container}>
        {this.props.expense.time} | {this.props.expense.title}
      </div>
    )
  }
}
