import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import * as actionCreators from '../store/action-creators'

import Drawer from 'material-ui/Drawer'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import Divider from 'material-ui/Divider'
import HomeIcon from 'material-ui/svg-icons/action/home'
import ExpensesIcon from 'material-ui/svg-icons/editor/attach-money'
import AdminIcon from 'material-ui/svg-icons/hardware/security'
import UserIcon from 'material-ui/svg-icons/social/person'
import LogoutIcon from 'material-ui/svg-icons/action/exit-to-app'

class SideDrawer extends Component {
  onRequestChange(open) {
    this.props.dispatch(actionCreators.setDrawer(open))
  }

  changePage(page) {
    this.props.history.push(page)
    this.onRequestChange(false)
  }

  logout() {
    this.props.dispatch(actionCreators.requestLogout())
  }

  render() {
    return (
      <Drawer
        docked={false}
        width={200}
        open={this.props.is_open}
        onRequestChange={(open) => this.onRequestChange(open)}
      >
        <Menu>
          <MenuItem
            primaryText="Expenses"
            leftIcon={<ExpensesIcon />}
            onTouchTap={() => this.changePage('/')} />

          {
            this.props.user.role !== 'user' &&
            <MenuItem
              primaryText="Admin"
              leftIcon={<AdminIcon />}
              onTouchTap={() => this.changePage('/admin')} />
          }
          
          <Divider />

          <MenuItem
            primaryText="Profile"
            leftIcon={<UserIcon />}
            onTouchTap={() => this.changePage('/profile')} />

          <MenuItem
            primaryText="Logout"
            leftIcon={<LogoutIcon />}
            onTouchTap={() => this.logout()} />
        </Menu>
      </Drawer>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    is_open: state.drawer.is_open,
    user: state.user
  }
}

const ConnectedSideDrawer = connect(mapStateToProps)(SideDrawer)

export default withRouter(ConnectedSideDrawer)
