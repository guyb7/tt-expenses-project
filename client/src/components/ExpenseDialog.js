import React from 'react'
import moment from 'moment'

import API from '../API/API'

import ErrorMessage from './ErrorMessage'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'
import DatePicker from 'material-ui/DatePicker'
import TimePicker from 'material-ui/TimePicker'

const style = {
  container: {
  }
}

const emptyExpense = {
  id: false,
  datetime: moment().minute(0).second(0).millisecond(0),
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
      ...this.props.expense
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
      open: false
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
      API.put('/expenses/' + this.state.id, expense)
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
      API.post('/expenses', expense)
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

  dateChange(date) {
    const prevDate = moment(date)
    const newDate = moment(this.state.datetime)
      .year(prevDate.year())
      .month(prevDate.month())
      .date(prevDate.date())
    this.setState({
      ...this.state,
      datetime: newDate
    })
  }

  timeChange(date) {
    const prevDate = moment(date)
    const newDate = moment(this.state.datetime)
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

  render () {
    const actions = [
      <FlatButton
        label="Cancel"
        disabled={this.state.is_loading}
        onTouchTap={() => this.handleClose()}
      />,
      <FlatButton
        label="Save"
        primary={true}
        disabled={this.state.is_loading}
        onTouchTap={() => this.saveExpense()}
      />,
    ]

    return (
      <Dialog
        title={this.state.id ? 'Edit Expense' : 'New Expense'}
        actions={actions}
        modal={false}
        open={this.state.open}
        onRequestClose={() => this.handleClose()}
      >
        <DatePicker
          hintText="Date"
          value={this.state.datetime.toDate()}
          onChange={(e, date) => this.dateChange(date)}
          disabled={this.state.is_loading}
          />
        <TimePicker
          hintText="Time"
          value={this.state.datetime.toDate()}
          minutesStep={5}
          onChange={(e, date) => this.timeChange(date)}
          disabled={this.state.is_loading}
          />
        <TextField
          floatingLabelText="Amount"
          type="number"
          value={this.state.amount}
          onChange={e => this.amountChange(e)}
          disabled={this.state.is_loading}
          />
        <TextField
          floatingLabelText="Description"
          value={this.state.description}
          onChange={e => this.descriptionChange(e)}
          disabled={this.state.is_loading}
          />
        <TextField
          floatingLabelText="Comment"
          multiLine={true}
          value={this.state.comment}
          onChange={e => this.commentChange(e)}
          disabled={this.state.is_loading}
          />
        <ErrorMessage text={this.state.error_message}></ErrorMessage>
      </Dialog>
    )
  }
}
