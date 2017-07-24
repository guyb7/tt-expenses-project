import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

import * as actionCreators from '../store/action-creators'

import ErrorMessage from '../components/ErrorMessage'
import { Card, CardHeader, CardText } from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'

const style = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  },
  formContainer: {
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

class Profile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      is_loading: false,
      name: this.props.user.name || '',
      old_password: '',
      password: '',
      error_message: ''
    }
  }

  componentDidMount() {
    this.props.dispatch(actionCreators.setNavTitle('Profile'))
  }

  nameChange(e) {
    this.setState({
      ...this.state,
      name: e.target.value
    })
  }

  oldPasswordChange(e) {
    this.setState({
      ...this.state,
      old_password: e.target.value
    })
  }

  passwordChange(e) {
    this.setState({
      ...this.state,
      password: e.target.value
    })
  }

  saveProfile() {
    this.setState({
      ...this.state,
      is_loading: true
    })
    const params = {
      name: this.state.name
    }
    if (this.state.old_password.length > 0) {
      params.old_password = this.state.old_password
    }
    if (this.state.password.length > 0) {
      params.password = this.state.password
    }
    this.props.dispatch(actionCreators.requestUpdateProfile({
      profile: params,
      onSuccess: () => {
        this.setState({
          ...this.state,
          is_loading: false,
          old_password: '',
          password: ''
        })
      },
      onFail: e => {
        this.setState({
          ...this.state,
          is_loading: false,
          error_message: _.has(e, 'data.error.text') ? e.data.error.text : e.message
        })
      }
    }))
  }

  render () {
    return (
      <div style={style.container}>
        <Card style={style.formContainer}>
          <CardHeader
            title="Update Your Profile"
          />
          <CardText style={style.form}>
            <div style={style.fieldsContainer}>
              <ErrorMessage text={this.state.error_message}></ErrorMessage>
              <TextField
                floatingLabelText="Name"
                value={this.state.name}
                onChange={e => this.nameChange(e)}
                disabled={this.state.is_loading}
                ></TextField>
              <hr/>
              <TextField
                floatingLabelText="Current Password"
                value={this.state.old_password}
                onChange={e => this.oldPasswordChange(e)}
                type="password"
                disabled={this.state.is_loading}
                ></TextField>
              <TextField
                floatingLabelText="New Password"
                value={this.state.password}
                onChange={e => this.passwordChange(e)}
                type="password"
                disabled={this.state.is_loading}
                ></TextField>
              <RaisedButton
                label="Save"
                primary={true}
                disabled={this.state.is_loading}
                style={style.submitButton}
                onTouchTap={e => this.saveProfile()} />
            </div>
          </CardText>
        </Card>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

const ConnectedProfile = connect(mapStateToProps)(Profile)

export default ConnectedProfile
