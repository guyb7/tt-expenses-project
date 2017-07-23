import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

import API from '../API/API'
import * as actionCreators from '../store/action-creators'
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import CheckIcon from 'material-ui/svg-icons/navigation/check'
import CancelIcon from 'material-ui/svg-icons/navigation/close'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import { orange100 } from 'material-ui/styles/colors'
import Snackbar from 'material-ui/Snackbar'

const style = {
  input: {
    width: '100%'
  },
  selectInput: {
    width: '100%',
    top: 7
  },
  actionButton: {
    minWidth: 'none',
    paddingLeft: 20,
    paddingRight: 20,
  },
  row: {},
  changedRow: {
    backgroundColor: orange100
  }
}

class UserRow extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ...props,
      is_loading: false,
      has_changes: false,
      originalProps: props,
      is_deleted: false,
      error_message: false
    }
  }

  onNameChange(val) {
    this.setState({
      ...this.state,
      name: val,
      has_changes: true
    })
  }

  onRoleChange(val) {
    this.setState({
      ...this.state,
      role: val,
      has_changes: true
    })
  }

  onRowSave() {
    this.setState({
      ...this.state,
      is_loading: true
    })
    API.put('/admin/users/' + this.state.id, {
      name: this.state.name,
      role: this.state.role
    })
    .then(res => {
      this.setState({
        ...this.state,
        has_changes: false
      })
    })
    .catch(e => {
      console.log('e', e)
    })
    .finally(() => {
      this.setState({
        ...this.state,
        is_loading: false
      })
    })
  }

  onRowDelete() {
    this.setState({
      ...this.state,
      is_loading: true
    })
    API.delete('/admin/users/' + this.state.id)
    .then(res => {
      this.setState({
        ...this.state,
        is_deleted: true
      })
    })
    .catch(e => {
      console.log('e', e)
      this.showErrorMessage(e.message)
    })
    .finally(() => {
      this.setState({
        ...this.state,
        is_loading: false
      })
    })
  }

  onRowReset() {
    this.setState({
      ...this.state.originalProps,
      has_changes: false
    })
  }

  showErrorMessage(message) {
    this.setState({
      ...this.state,
      error_message: message
    })
  }

  hideErrorMessage() {
    this.setState({
      ...this.state,
      error_message: false
    })
  }

  render() {
    if (this.state.is_deleted === true) {
      return null
    }
    return (
      <TableRow style={this.state.has_changes ? style.changedRow : style.row}>
        <TableRowColumn>
          <TextField
            id={"username-field-" + this.state.id}
            value={this.state.username}
            style={style.input}
            disabled={true}
          />
        </TableRowColumn>
        <TableRowColumn>
          <TextField
            id={"name-field-" + this.state.id}
            value={this.state.name}
            style={style.input}
            onChange={(e, val) => this.onNameChange(val)}
            disabled={this.state.is_loading}
          />
        </TableRowColumn>
        {
          this.state.is_admin &&
          <TableRowColumn>
            <SelectField
              value={this.state.role}
              style={style.input}
              menuStyle={style.selectInput}
              onChange={(e, n, val) => this.onRoleChange(val)}
              disabled={this.state.is_loading}
            >
              <MenuItem value="user" primaryText="User" />
              <MenuItem value="manager" primaryText="Manager" />
              <MenuItem value="admin" primaryText="Admin" />
            </SelectField>
          </TableRowColumn>
        }
        <TableRowColumn>
          {
            this.state.has_changes &&
            <FlatButton
              icon={<CancelIcon />}
              style={style.actionButton}
              onTouchTap={e => this.onRowReset()}
              disabled={this.state.is_loading}
            />
          }
          {
            this.state.has_changes &&
            <FlatButton
              icon={<CheckIcon />}
              style={style.actionButton}
              onTouchTap={e => this.onRowSave()}
              disabled={this.state.is_loading}
            />
          }
          {
            !this.state.has_changes &&
            <FlatButton
              icon={<DeleteIcon />}
              style={style.actionButton}
              onTouchTap={e => this.onRowDelete()}
              disabled={this.state.is_loading}
            />
          }
          <Snackbar
            open={this.state.error_message && this.state.error_message.length > 0}
            message={this.state.error_message}
            autoHideDuration={3000}
            onRequestClose={() => this.hideErrorMessage()}
          />
        </TableRowColumn>
      </TableRow>
    )
  }
}

class AdminUsers extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      users: []
    }
  }

  componentDidMount() {
    this.props.dispatch(actionCreators.setNavTitle('Admin - Users'))
    this.getUsers()
  }

  getUsers() {
    this.setState({
      ...this.state,
      is_loading: true
    })
    API.get('/admin/users')
    .then(res => {
      this.setState({
        ...this.state,
        users: _.sortBy(res.data.users, 'username')
      })
    })
    .catch(e => {
      console.log('e', e)
      this.setState({
        ...this.state
      })
    })
  }

  isAdmin() {
    return this.props.user.role === 'admin'
  }

  render () {
    return (
      <div style={style.container}>
        <Table className="tableHiddenCheckboxes" selectable={false}>
          <TableHeader>
            <TableRow>
              <TableHeaderColumn>Username</TableHeaderColumn>
              <TableHeaderColumn>Name</TableHeaderColumn>
              {
                this.isAdmin() &&
                <TableHeaderColumn>Role</TableHeaderColumn>
              }
              <TableHeaderColumn>Actions</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody showRowHover={true}>
            {
              this.state.users.map(u => {
                return (<UserRow
                  key={u.id}
                  id={u.id}
                  username={u.username}
                  name={u.name}
                  role={u.role}
                  is_admin={this.isAdmin()}
                />)
              })
            }
          </TableBody>
        </Table>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

const ConnectedAdminUsers = connect(mapStateToProps)(AdminUsers)

export default ConnectedAdminUsers
