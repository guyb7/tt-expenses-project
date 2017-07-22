import React from 'react'
import { connect } from 'react-redux'

import * as actionCreators from '../store/action-creators'

class AdminHome extends React.Component {
  componentDidMount() {
    this.props.dispatch(actionCreators.setNavTitle('Admin'))
  }

  render () {
    return (
      <div>
        <h2>Admin</h2>
        <h3>Users</h3>
        <h3>Expenses</h3>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {}
}

const ConnectedAdminHome = connect(mapStateToProps)(AdminHome)

export default ConnectedAdminHome
