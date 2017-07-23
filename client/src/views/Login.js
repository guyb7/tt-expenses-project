import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import * as actionCreators from '../store/action-creators'

import { getParams } from '../components/Utils'
import LoginForm from '../components/LoginForm'
import CircularProgress from 'material-ui/CircularProgress'

const style = {
  container: {
    display: 'flex',
    direction: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  }
}

class Login extends React.Component {
  componentDidMount() {
    this.props.dispatch(actionCreators.setNavTitle(''))
    if (this.props.user.logged_in !== true) {
      this.props.dispatch(actionCreators.requestProfile({
        onSuccess: () => { this.returnToURL() },
        onFail: () => {}
      }))
    }
  }

  returnToURL() {
    const queryParams = getParams(this.props.history.location.search)
    if (queryParams.returnUrl) {
      this.props.history.push(queryParams.returnUrl)
    } else {
      this.props.history.push('/')
    }
  }

  showForm() {
    return this.props.user.is_loading === false && this.props.user.logged_in === false
  }

  render () {
    return (
      <div style={style.container}>
        {
          this.props.user.is_loading &&
          <CircularProgress size={40} thickness={3} />
        }
        <div className={this.showForm() ? '' : 'hidden'}>
          <LoginForm onSuccess={() => {this.returnToURL()}}></LoginForm>
        </div>
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
