import React from 'react'
import { connect } from 'react-redux'

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
import DeleteIcon from 'material-ui/svg-icons/action/delete'

const style = {
}

class UserRow extends React.Component {
  render() {
    return (
      <TableRow>
        <TableRowColumn>
          <TextField
            id={"username-field-" + this.props.id}
            value={this.props.username}
          />
        </TableRowColumn>
        <TableRowColumn>
          <TextField
            id={"name-field-" + this.props.id}
            value={this.props.name}
          />
        </TableRowColumn>
        <TableRowColumn>
          <SelectField
            value={this.props.role}
          >
            <MenuItem value="user" primaryText="User" />
            <MenuItem value="manager" primaryText="Manager" />
            <MenuItem value="admin" primaryText="Admin" />
          </SelectField>
        </TableRowColumn>
        <TableRowColumn>
          <FlatButton
            icon={<CheckIcon />}
          />
          <FlatButton
            icon={<DeleteIcon />}
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
        users: res.data.users
      })
    })
    .catch(e => {
      console.log('e', e)
      this.setState({
        ...this.state
      })
    })
  }

  render () {
    return (
      <div style={style.container}>
        <Table className="tableHiddenCheckboxes" selectable={false}>
          <TableHeader>
            <TableRow>
              <TableHeaderColumn>Username</TableHeaderColumn>
              <TableHeaderColumn>Name</TableHeaderColumn>
              <TableHeaderColumn>Role</TableHeaderColumn>
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
  return {}
}

const ConnectedAdminUsers = connect(mapStateToProps)(AdminUsers)

export default ConnectedAdminUsers
