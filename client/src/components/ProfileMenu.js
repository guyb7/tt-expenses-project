import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import * as actionCreators from '../store/action-creators'

import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import UserIcon from 'material-ui/svg-icons/social/person'
import Divider from 'material-ui/Divider'
import { blue800 } from 'material-ui/styles/colors'

const style = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    marginTop: -4
  },
  icon: {
    color: blue800
  },
  text: {
    color: '#fff',
    fontSize: 13
  }
}

class ProfileMenu extends Component {
  onItemClick(item) {
    switch (item.props.primaryText) {
      case 'Profile':
        this.props.history.push('/profile')
        break;
      case 'Logout':
        this.logout()
        break;
      default:
    }
  }

  logout() {
    this.props.dispatch(actionCreators.requestLogout())
  }

  render() {
    return (
      <div style={style.container}>
        <div style={style.text}>{this.props.user.name}</div>
        <IconMenu
          iconButtonElement={<IconButton><UserIcon /></IconButton>}
          anchorOrigin={{horizontal: 'right', vertical: 'top'}}
          targetOrigin={{horizontal: 'right', vertical: 'top'}}
          iconStyle={style.icon}
          onItemTouchTap={(e, child) => { this.onItemClick(child) }}
        >
          <MenuItem primaryText="Profile" />
          <MenuItem primaryText="Settings" disabled={true} />
          <Divider />
          <MenuItem primaryText="Logout" />
        </IconMenu>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

const ConnectedProfileMenu = connect(mapStateToProps)(ProfileMenu)

export default withRouter(ConnectedProfileMenu)
