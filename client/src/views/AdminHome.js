import React from 'react'
import { connect } from 'react-redux'

import * as actionCreators from '../store/action-creators'
import RaisedButton from 'material-ui/RaisedButton'
import UsersListIcon from 'material-ui/svg-icons/action/supervisor-account'
import UsersAddIcon from 'material-ui/svg-icons/social/person-add'
import ExpensesIcon from 'material-ui/svg-icons/editor/attach-money'
import ExpensesAddIcon from 'material-ui/svg-icons/content/add'
import { grey700 } from 'material-ui/styles/colors'

const style = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 50
  },
  header: {
    color: grey700,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'normal',
    marginBottom: 20
  },
  linkButton: {
    display: 'block',
    maxWidth: 250,
    marginBottom: 20
  }
}

class AdminHome extends React.Component {
  componentDidMount() {
    this.props.dispatch(actionCreators.setNavTitle('Admin'))
  }

  changePage(page) {
    this.props.history.push(page)
  }

  render () {
    return (
      <div style={style.container}>
        <div>
          <h2 style={style.header}>Users</h2>
          <RaisedButton
            style={style.linkButton}
            primary={true}
            label="List all users"
            onTouchTap={e => this.changePage('/admin/users')}
            icon={<UsersListIcon />}
          />
          <RaisedButton
            style={style.linkButton}
            primary={true}
            onTouchTap={e => this.changePage('/admin/users')}
            icon={<UsersAddIcon />}
            label="Create new user"
          />
        </div>
        <div>
          <h2 style={style.header}>Expenses</h2>
          <RaisedButton
            style={style.linkButton}
            primary={true}
            onTouchTap={e => this.changePage('/admin/expenses')}
            label="Search expenses"
            icon={<ExpensesIcon />}
          />
          <RaisedButton
            style={style.linkButton}
            primary={true}
            onTouchTap={e => this.changePage('/admin/expenses')}
            icon={<ExpensesAddIcon />}
            label="Add expense"
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {}
}

const ConnectedAdminHome = connect(mapStateToProps)(AdminHome)

export default ConnectedAdminHome
