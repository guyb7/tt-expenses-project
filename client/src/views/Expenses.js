import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'

// import API from '../API/API'
// import * as actionCreators from '../store/action-creators'

import ExpensesWeek from '../components/ExpensesWeek'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'

const style = {
  container: {
    height: '100%'
  },
  fab: {
    position: 'absolute',
    bottom: 15,
    right: 15
  }
}

class Expenses extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      is_loading: false,
      year: moment().year(),
      week: moment().week(),
      expenses: [],
      days: [
        {
          date: '2017-07-20', // Should be moment
          expenses: [
            {
              id: '1234',
              title: 'Expense title',
              time: '18:00' // Should be moment
            }
          ]
        },
        {
          date: '2017-07-21', // Should be moment
          expenses: [
            {
              id: '4321',
              title: 'Expense title 2',
              time: '12:30' // Should be moment
            }
          ]
        }
      ],
      firstWeekDay: 'monday'
    }
  }

  render () {
    return (
      <div style={style.container}>
        Year: {this.state.year} | Week: {this.state.week}
        <ExpensesWeek days={this.state.days} />
        <FloatingActionButton secondary={true} style={style.fab}>
          <ContentAdd />
        </FloatingActionButton>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

const ConnectedExpenses = connect(mapStateToProps)(Expenses)

export default ConnectedExpenses
