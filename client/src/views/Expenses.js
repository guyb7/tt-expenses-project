import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import _ from 'lodash'

import API from '../API/API'
import * as actionCreators from '../store/action-creators'

import ExpensesWeek from '../components/ExpensesWeek'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'

const style = {
  container: {
    height: '100%'
  },
  fab: {
    position: 'fixed',
    bottom: 15,
    right: 15
  }
}

class Expenses extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      is_loading: false,
      year: 2017,
      week: 26,
      // year: moment().year(),
      // week: moment().week(),
      expenses: [],
      firstWeekDay: 'monday'
    }
  }

  componentDidMount() {
    this.props.dispatch(actionCreators.setNavTitle('Expenses'))
    this.getExpenses()
  }

  getExpenses() {
    this.setState({
      ...this.state,
      is_loading: true
    })
    API.get('/expenses', {
      week: this.state.week,
      year: this.state.year,
      day: this.state.firstWeekDay
    })
    .then(res => {
      this.setState({
        ...this.state,
        is_loading: false,
        expenses: res.data.expenses
      })
    })
    .catch(e => {
      console.log('e', e)
      this.setState({
        ...this.state,
        is_loading: false
      })
    })
  }

  calcDays() {
    console.log('Recalculating')
    const daysMap = {}
    const firstDay = moment()
      .year(this.state.year)
      .week(this.state.week)
      .day(this.state.firstWeekDay)
    _.times(7, n => {
      const day = firstDay.add('days', 1).format('YYYY-MM-DD')
      daysMap[day] = []
    })
    _.each(this.state.expenses, e => {
      const date = moment(e.datetime).utc()
      const day = date.format('YYYY-MM-DD')
      if (daysMap[day]) {
        daysMap[day].push({
          id: e.id,
          time: date.format('HH:mm'),
          amount: e.amount,
          description: e.description,
          comment: e.comment
        })
      } else {
        console.log('Day out of range', day, e)
      }
    })
    const days = []
    _.each(daysMap, (v, k) => {
      days.push({
        date: k,
        expenses: v
      })
    })
    return days
  }

  render () {
    return (
      <div style={style.container}>
        Year: {this.state.year} | Week: {this.state.week}
        <ExpensesWeek days={this.calcDays()} />
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
