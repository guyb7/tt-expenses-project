import React from 'react'
import moment from 'moment'

import API from '../API/API'

import ErrorMessage from './ErrorMessage'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'
import DatePicker from 'material-ui/DatePicker'
import TimePicker from 'material-ui/TimePicker'
import { blue500 } from 'material-ui/styles/colors'

const style = {
  content: {
    maxWidth: 450
  },
  title: {
    color: blue500
  },
  body: {
    width: '100%'
  },
  datetime: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  amount: {
    maxWidth: 100
  },
  description: {
    width: '100%'
  },
  comment: {
    width: '100%'
  }
}

const emptyExpense = {
  id: false,
  datetime: moment().utc().minute(0).second(0).millisecond(0),
  amount: 0,
  description: '',
  comment: ''
}

export default class ExpensesDialog extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      is_loading: false,
      open: this.props.open,
      error_message: '',
      ...emptyExpense,
      ...this.props.expense,
      expensesBaseUrl: props.username ? '/admin/expenses' : '/expenses',
      userExpensesBaseUrl: props.username ? '/admin/users/' + props.username + '/expenses' : '/expenses',
    }
  }

  componentWillReceiveProps(props) {
    this.setState({
      ...this.state,
      open: props.open,
      ...emptyExpense,
      ...props.expense
    })
  }

  handleClose() {
    this.setState({
      ...this.state,
      is_loading: false,
      error_message: '',
      open: false
    }, () => {
      if (this.props.onClear) {
        this.props.onClear()
      }
    })
  }

  saveExpense() {
    this.setState({
      ...this.state,
      is_loading: true,
      error_message: ''
    })
    const expense = {
      datetime: this.state.datetime,
      amount: this.state.amount,
      description: this.state.description,
      comment: this.state.comment
    }
    if (this.state.id) {
      // Update
      API.put(this.state.expensesBaseUrl + '/' + this.state.id, expense)
      .then(res => {
        if (this.props.onSuccess) {
          this.props.onSuccess({
            id: this.state.id,
            ...expense
          })
        }
        this.handleClose()
      })
      .catch(e => {
        this.setError(e.message)
      })
    } else {
      // Create
      API.post(this.state.userExpensesBaseUrl, expense)
      .then(res => {
        if (this.props.onSuccess) {
          this.props.onSuccess({
            id: res.data.expenseId,
            ...expense
          })
        }
        this.handleClose()
      })
      .catch(e => {
        this.setError(e.message)
      })
    }
  }

  deleteExpense() {
    API.delete(this.state.expensesBaseUrl + '/' + this.state.id)
    .then(res => {
      if (this.props.onSuccess) {
        this.props.onSuccess({
          id: this.state.id,
          is_deleted: true
        })
      }
      this.handleClose()
    })
    .catch(e => {
      this.setError(e.message)
    })
  }

  dateChange(date) {
    // Artificially adjusting timeszone offset because MUI time-picker doesn't support specifying timezones
    const prevDate = moment(date).add(moment().utcOffset(), 'minutes').utc()
    const newDate = moment(this.state.datetime.utc())
      .year(prevDate.year())
      .month(prevDate.month())
      .date(prevDate.date())
    this.setState({
      ...this.state,
      datetime: newDate
    })
  }

  timeChange(date) {
    // Artificially adjusting timeszone offset because MUI time-picker doesn't support specifying timezones
    const prevDate = moment(date).add(moment().utcOffset(), 'minutes').utc()
    const newDate = moment(this.state.datetime).utc()
      .hour(prevDate.hour())
      .minute(prevDate.minute())
    this.setState({
      ...this.state,
      datetime: newDate
    })
  }

  amountChange(e) {
    this.setState({
      ...this.state,
      amount: e.target.value
    })
  }

  descriptionChange(e) {
    this.setState({
      ...this.state,
      description: e.target.value
    })
  }

  commentChange(e) {
    this.setState({
      ...this.state,
      comment: e.target.value
    })
  }

  setError(errMessage) {
    this.setState({
      ...this.state,
      is_loading: false,
      error_message: errMessage
    })
  }

  dateInUTC(date) {
    // Artificially adjusting timeszone offset because MUI time-picker doesn't support specifying timezones
    return moment(date).subtract(moment().utcOffset(), 'minutes').format('YYYY-MM-DD')
  }

  timeInUTC() {
    // Artificially adjusting timeszone offset because MUI time-picker doesn't support specifying timezones
    return moment(this.state.datetime).subtract(moment().utcOffset(), 'minutes').toDate()
  }

  render () {
    const actions = [
      <FlatButton
        label="Cancel"
        disabled={this.state.is_loading}
        onTouchTap={() => this.handleClose()}
      />
    ]
    if (this.state.id) {
      actions.push(<FlatButton
        label="Delete"
        secondary={true}
        disabled={this.state.is_loading}
        onTouchTap={() => this.deleteExpense()}
      />)
    }
    actions.push(<FlatButton
      label="Save"
      primary={true}
      disabled={this.state.is_loading}
      onTouchTap={() => this.saveExpense()}
    />)

    return (
      <Dialog
        title={this.state.id ? 'Edit Expense' : 'New Expense'}
        actions={actions}
        modal={false}
        open={this.state.open}
        titleStyle={style.title}
        contentStyle={style.content}
        bodyStyle={style.body}
        onRequestClose={() => this.handleClose()}
      >
        <div style={style.datetime}>
          <DatePicker
            floatingLabelText="Date"
            value={this.state.datetime.toDate()}
            formatDate={this.dateInUTC}
            onChange={(e, date) => this.dateChange(date)}
            disabled={this.state.is_loading}
            />
          <TimePicker
            floatingLabelText="Time"
            value={this.timeInUTC()}
            minutesStep={5}
            onChange={(e, date) => this.timeChange(date)}
            disabled={this.state.is_loading}
            />
        </div>
        <div>
          $&nbsp;
          <TextField
            floatingLabelText="Amount"
            type="number"
            value={this.state.amount}
            onChange={e => this.amountChange(e)}
            disabled={this.state.is_loading}
            style={style.amount}
            />
        </div>
        <TextField
          floatingLabelText="Description"
          value={this.state.description}
          onChange={e => this.descriptionChange(e)}
          disabled={this.state.is_loading}
          style={style.description}
          />
        <TextField
          floatingLabelText="Comment"
          multiLine={true}
          value={this.state.comment}
          onChange={e => this.commentChange(e)}
          disabled={this.state.is_loading}
          style={style.comment}
          />
        <ErrorMessage text={this.state.error_message}></ErrorMessage>
      </Dialog>
    )
  }
}
