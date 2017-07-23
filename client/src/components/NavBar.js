import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import * as actionCreators from '../store/action-creators'

import ProfileMenu from './ProfileMenu'
import AppBar from 'material-ui/AppBar'

let maxRedirects = 10

class NavBar extends Component {
  openDrawer() {
    this.props.dispatch(actionCreators.setDrawer(true))
  }

  componentDidMount() {
    this.props.history.listen((location, action) => {
      this.checkToPromptLogin()
    })
    if (this.props.user.logged_in !== true) {
      this.checkToPromptLogin()
    }
  }

  checkToPromptLogin() {
    // If not on /login page, check if logged in and redirect to /login if not
    setImmediate(() => {
      if (this.props.history.location.pathname !== '/login' && this.props.user.logged_in !== true) {
        if (maxRedirects > 0) {
          this.props.history.push('/login?returnUrl=' + encodeURIComponent(this.props.history.location.pathname))
        } else {
          maxRedirects--
        }
      }
    })
  }

  render() {
    return (
      <AppBar
        title={this.props.title}
        onLeftIconButtonTouchTap={() => this.openDrawer()}
        iconElementRight={this.props.user.logged_in ? <ProfileMenu></ProfileMenu> : null}
        className="printHide"
      />
    )
  }
}

const mapStateToProps = (state) => {
  return {
    title: state.navbar.title,
    user: state.user
  }
}

const ConnectedNavBar = connect(mapStateToProps)(NavBar)

export default withRouter(ConnectedNavBar)
