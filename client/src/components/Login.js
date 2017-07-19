import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import * as actionCreators from '../store/action-creators'

import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card'
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'

const style = {
  container: {
    display: 'flex',
    direction: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  },
  form: {
    maxWidth: 300
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
      password_error: ''
    }
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
    if (this.validateFields()) {
      this.setState({
        ...this.state,
        is_loading: true
      })
      this.props.onLogin({
        username: this.state.username,
        password: this.state.password
      })
    }
  }

  register() {
    if (this.validateFields()) {
      this.setState({
        ...this.state,
        is_loading: true
      })
      console.log('REGISTER', this.state.username, this.state.password)
    }
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
      <Card style={style.form}>
        <CardHeader title="Login" />
        <CardText>
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
        </CardText>
        <CardActions>
          <RaisedButton
            label="Login"
            primary={true}
            disabled={this.state.is_loading}
            onTouchTap={e => this.login()} />
          <FlatButton
            label="Register"
            disabled={this.state.is_loading}
            onTouchTap={e => this.register()} />
        </CardActions>
      </Card>
    )
  }
}

class Login extends React.Component {
  componentDidMount() {
    if (this.props.user.logged_in !== true) {
      this.props.dispatch(actionCreators.requestProfile({
        successRedirect: () => { this.returnToURL() }
      }))
    }
  }

  returnToURL() {
    const queryParams = this.getParams(this.props.history.location.search)
    if (queryParams.returnUrl) {
      this.props.history.push(queryParams.returnUrl)
    } else {
      this.props.history.push('/')
    }
  }

  getParams(query) {
    if (!query) {
      return {}
    }
    return (/^[?#]/.test(query) ? query.slice(1) : query)
      .split('&')
      .reduce((params, param) => {
        let [ key, value ] = param.split('=')
        params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : ''
        return params;
      }, { })
  }

  onLogin({ username, password }) {
    this.props.dispatch(actionCreators.requestLogin({
      username,
      password,
      onSuccess: () => { this.returnToURL() },
      onFail: () => {
        console.log('FAIL LOGIN')
      }
    }))
  }

  render () {
    return (
      <div style={style.container}>
        {
          this.props.user.is_loading &&
          <CircularProgress size={40} thickness={3} />
        }
        {
          !this.props.user.is_loading &&
          !this.props.user.logged_in &&
          <LoginForm onLogin={params => { this.onLogin(params) }}></LoginForm>
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

const ConnectedLogin = connect(mapStateToProps)(Login)

export default withRouter(ConnectedLogin)
