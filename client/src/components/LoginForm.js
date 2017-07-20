import React from 'react'
import { connect } from 'react-redux'

import * as actionCreators from '../store/action-creators'

import ErrorMessage from './ErrorMessage'
import { Card, CardText } from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'
import { Tabs, Tab } from 'material-ui/Tabs'
import TextField from 'material-ui/TextField'


const style = {
  container: {
    maxWidth: 300,
  },
  form: {
    padding: 0
  },
  fieldsContainer: {
    padding: 20,
    paddingBottom: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  submitButton: {
    marginTop: 20,
    marginBottom: 10,
    alignSelf: 'flex-end'
  }
}

class LoginForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      is_loading: false,
      username: '',
      password: '',
      username_error: '',
      password_error: '',
      other_error: ''
    }
  }

  clearErrors() {
    this.setState({
      ...this.state,
      username_error: '',
      password_error: '',
      other_error: ''
    })
  }

  usernameChange(e) {
    this.setState({
      ...this.state,
      username: e.target.value,
      username_error: this.state.username_error && this.isUsernameInvalid()
    })
  }

  passwordChange(e) {
    this.setState({
      ...this.state,
      password: e.target.value,
      password_error: this.state.password_error && this.isPasswordInvalid()
    })
  }

  login() {
    this.clearErrors()
    if (this.validateFields()) {
      this.setState({
        ...this.state,
        is_loading: true
      })
      this.props.dispatch(actionCreators.requestLogin({
        username: this.state.username,
        password: this.state.password,
        onSuccess: () => { this.onLoginSuccess() },
        onFail: e => this.onLoginFail(e)
      }))
    }
  }

  onLoginSuccess() {
    this.props.dispatch(actionCreators.requestProfile({
      onSuccess: response => {
        this.setState({
          ...this.state,
          is_loading: false
        })
        this.props.onSuccess()
      },
      onFail: e => {
        this.setState({
          ...this.state,
          is_loading: false
        })
      }
    }))
  }

  onLoginFail(e) {
    this.setState({
      ...this.state,
      is_loading: false,
      other_error: e.message
    })
    console.log(e)
  }

  register() {
    this.clearErrors()
    if (this.validateFields()) {
      this.setState({
        ...this.state,
        is_loading: true
      })
      this.props.dispatch(actionCreators.requestRegister({
        username: this.state.username,
        password: this.state.password,
        name: this.state.name,
        onSuccess: () => { this.onRegisterSuccess() },
        onFail: e => this.onRegisterFail(e)
      }))
    }
  }

  onRegisterSuccess() {
    this.props.dispatch(actionCreators.requestLogin({
      username: this.state.username,
      password: this.state.password,
      onSuccess: () => { this.onLoginSuccess() },
      onFail: e => this.onLoginFail(e)
    }))
  }

  onRegisterFail(e) {
    this.setState({
      ...this.state,
      is_loading: false,
      other_error: e.message
    })
    console.log(e)
  }

  validateFields() {
    let valid = true
    const newState = {
      ...this.state
    }
    const username_error = this.isUsernameInvalid()
    if (username_error) {
      valid = false
      newState.username_error = username_error
    }
    const password_error = this.isPasswordInvalid()
    if (password_error) {
      valid = false
      newState.password_error = password_error
    }
    if (!valid) {
      this.setState(newState)
    }
    return valid
  }

  isUsernameInvalid() {
    if (this.state.username.length < 4) {
      return 'Username must be at least 4 characters'
    } else {
      return false
    }
  }

  isPasswordInvalid() {
    if (this.state.password.length < 4) {
      return 'Password is too short'
    } else {
      return false
    }
  }

  render () {
    return (
      <Card style={style.container}>
        <CardText style={style.form}>
          <Tabs onChange={() => this.clearErrors()}>
            <Tab label="Login">
              <div style={style.fieldsContainer}>
                <ErrorMessage text={this.state.other_error}></ErrorMessage>
                <TextField
                  floatingLabelText="Username"
                  errorText={this.state.username_error}
                  value={this.state.username}
                  onChange={e => this.usernameChange(e)}
                  disabled={this.state.is_loading}
                  ></TextField>
                <TextField
                  type="password"
                  floatingLabelText="Password"
                  errorText={this.state.password_error}
                  value={this.state.password}
                  onChange={e => this.passwordChange(e)}
                  disabled={this.state.is_loading}
                  ></TextField>
                <RaisedButton
                  label="Login"
                  primary={true}
                  disabled={this.state.is_loading}
                  style={style.submitButton}
                  onTouchTap={e => this.login()} />
              </div>
            </Tab>
            <Tab label="Register" >
              <div style={style.fieldsContainer}>
                <ErrorMessage text={this.state.other_error}></ErrorMessage>
                <TextField
                  floatingLabelText="Username"
                  errorText={this.state.username_error}
                  value={this.state.username}
                  onChange={e => this.usernameChange(e)}
                  disabled={this.state.is_loading}
                  ></TextField>
                <TextField
                  type="password"
                  floatingLabelText="Password"
                  errorText={this.state.password_error}
                  value={this.state.password}
                  onChange={e => this.passwordChange(e)}
                  disabled={this.state.is_loading}
                  ></TextField>
                <TextField
                  floatingLabelText="Name"
                  ></TextField>
                <RaisedButton
                  label="Register"
                  primary={true}
                  disabled={this.state.is_loading}
                  style={style.submitButton}
                  onTouchTap={e => this.register()} />
              </div>
            </Tab>
          </Tabs>
        </CardText>
      </Card>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

const ConnectedLoginForm = connect(mapStateToProps)(LoginForm)
export default ConnectedLoginForm
