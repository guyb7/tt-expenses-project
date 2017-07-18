import React, { Component } from 'react'
import { connect } from 'react-redux'

import * as actionCreators from '../store/action-creators'

import AppBar from 'material-ui/AppBar'
import Avatar from 'material-ui/Avatar'

class NavBar extends Component {
  openDrawer() {
    this.props.dispatch(actionCreators.setDrawer(true))
  }

  render() {
    return (
      <AppBar
        title={this.props.title}
        onLeftIconButtonTouchTap={() => this.openDrawer()}
        iconElementRight={this.props.user.logged_in ? <Avatar size={30}>Y</Avatar> : <Avatar size={30}>?</Avatar>}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    title: state.navbar.title,
    user: state.user
  }
}

const ConnectedNavBar = connect(mapStateToProps)(NavBar)

export default ConnectedNavBar
