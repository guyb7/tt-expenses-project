import React from 'react'

import { teal50, teal500, grey200, grey400, grey700 } from 'material-ui/styles/colors'

const style = {
  container: {
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
    color: grey700,
    paddingTop: 10,
    paddingBottom: 10,
    cursor: 'pointer'
  },
  containerHover: {
    backgroundColor: teal50
  },
  time: {
    paddingTop: 2,
    width: 50,
    textAlign: 'center',
    fontSize: 13,
    color: grey400,
  },
  amount: {
    paddingTop: 2,
    width: 100,
    textAlign: 'center',
    fontSize: 13
  },
  descriptionContainer: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontStyle: 'bold',
    marginBottom: 5
  },
  comment: {
    color: grey400,
    fontStyle: 'italic',
    fontSize: 14,
    whiteSpace: 'pre'
  }
}

export default class ExpensesItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hover: false
    }
  }

  mouseOver() {
    this.setState({
      ...this.state,
      hover: true
    })
  }

  mouseOut() {
    this.setState({
      ...this.state,
      hover: false
    })
  }

  containerStyle() {
    let hoverStyle = this.state.hover ? style.containerHover : {}
    return {
      ...style.container,
      ...hoverStyle
    }
  }

  render () {
    return (
      <div style={this.containerStyle()}
        onClick={() => this.props.onExpenseOpen(this.props.expense)}
        onMouseEnter={() => this.mouseOver()}
        onMouseLeave={() => this.mouseOut()}>
        <div style={style.time}>
          {this.props.expense.datetime.format('HH:mm')}
        </div>
        <div style={style.amount}>
          ${this.props.expense.amount}
        </div>
        <div style={style.descriptionContainer}>
          <div style={style.description}>
            {this.props.expense.description}
          </div>
          <div style={style.comment}>
            {this.props.expense.comment}
          </div>
        </div>
      </div>
    )
  }
}
