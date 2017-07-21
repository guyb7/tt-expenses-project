import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import _ from 'lodash'

import API from '../API/API'
import * as actionCreators from '../store/action-creators'

import ExpensesWeek from '../components/ExpensesWeek'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import ArrowLeft from 'material-ui/svg-icons/navigation/chevron-left'
import ArrowRight from 'material-ui/svg-icons/navigation/chevron-right'
import FlatButton from 'material-ui/FlatButton'
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar'
import DatePicker from 'material-ui/DatePicker'

const style = {
  container: {
    height: '100%',
    paddingBottom: 100
  },
  fab: {
    position: 'fixed',
    bottom: 15,
    right: 15
  },
  datePrevBtn: {
    minWidth: 'none',
    marginRight: 0,
    paddingLeft: 20,
    paddingRight: 20,
  },
  dateNextBtn: {
    minWidth: 'none',
    marginLeft: 0,
    paddingLeft: 20,
    paddingRight: 20,
  },
  datePickBtn: {
    margin: 0,
    paddingLeft: 20,
    paddingRight: 20,
  }
}

class Expenses extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      is_loading: false,
      firstDay: moment().day('monday').hour(0).minute(0).second(0),
      expenses: [],
      firstWeekDay: 'monday'
    }
  }

  year() {
    return this.state.firstDay.year()
  }

  week() {
    return this.state.firstDay.week()
  }

  weekRangeText() {
    const lastDay = moment(this.state.firstDay).add(6, 'days')
    if (this.state.firstDay.month() === lastDay.month()) {
      return this.state.firstDay.format('D') + ' - ' + lastDay.format('D MMM')
    } else {
      return this.state.firstDay.format('D MMM') + ' - ' + lastDay.format('D MMM')
    }
  }

  componentDidMount() {
    this.props.dispatch(actionCreators.setNavTitle('Expenses'))
    //TODO read url query params
    this.getExpenses()
  }

  getExpenses() {
    this.setState({
      ...this.state,
      is_loading: true
    })
    API.get('/expenses', {
      params: {
        week: this.week(),
        year: this.year(),
        day: this.state.firstWeekDay
      }
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
    const firstDay = moment(this.state.firstDay)
    _.times(7, n => {
      const day = firstDay.format('YYYY-MM-DD')
      daysMap[day] = []
      firstDay.add(1, 'days')
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

  openDatepicker() {
    this.dateInput.focus()
  }

  onDatepickerUpdate(date) {
    this.setState({
      ...this.state,
      firstDay: moment(date).day(this.state.firstWeekDay).hour(0).minute(0).second(0)
    })
  }

  setDateToday() {
    this.setState({
      ...this.state,
      firstDay: moment().day(this.state.firstWeekDay).hour(0).minute(0).second(0)
    }, () => {
      this.getExpenses()
    })
  }

  setDateNextWeek() {
    this.setState({
      ...this.state,
      firstDay: moment(this.state.firstDay).add(7, 'days')
    }, () => {
      this.getExpenses()
    })
  }

  setDatePrevWeek() {
    this.setState({
      ...this.state,
      firstDay: moment(this.state.firstDay).subtract(7, 'days')
    }, () => {
      this.getExpenses()
    })
  }

  render () {
    return (
      <div style={style.container}>
        <Toolbar>
          <ToolbarGroup firstChild={true}>
            <FlatButton
              style={style.datePrevBtn}
              icon={<ArrowLeft/>}
              onTouchTap={e => this.setDatePrevWeek()} />
            <FlatButton
              style={style.datePickBtn}
              label={this.weekRangeText()}
              onTouchTap={e => this.openDatepicker()} />
            <FlatButton style={style.arrowButton}
              style={style.dateNextBtn}
              icon={<ArrowRight/>}
              onTouchTap={e => this.setDateNextWeek()} />
          </ToolbarGroup>
          <ToolbarGroup>
            <FlatButton label="Today" onTouchTap={e => this.setDateToday()} />
          </ToolbarGroup>
        </Toolbar>
        <DatePicker
          id="expenses-datepicker"
          style={{ visibility: 'hidden' }}
          ref={(input) => { this.dateInput = input }}
          onChange={(e, date) => this.onDatepickerUpdate(date)}
          value={this.state.firstDay.toDate()} />
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
