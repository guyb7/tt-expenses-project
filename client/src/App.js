import React, { Component } from 'react'
import { Provider } from 'react-redux'
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import NavBar from './components/NavBar'
import SideDrawer from './components/SideDrawer'
import Login from './views/Login'
import Profile from './views/Profile'
import Expenses from './views/Expenses'
import AdminUsers from './views/AdminUsers'
import AdminUserExpenses from './views/AdminUserExpenses'
import ComingSoon from './views/ComingSoon'

const baseUrl = process.env.NODE_ENV.toUpperCase() === 'TEST' ? '' : '/app'

const style = {
  screen: {
    width: '100%',
    height: '100%'
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={ this.props.store }>
        <MuiThemeProvider>
          <Router basename={baseUrl}>
            <div style={style.screen}>
              <NavBar />
              <SideDrawer />
              <Route exact path="/" component={Expenses}/>
              <Route exact path="/login" component={Login}/>
              <Route exact path="/profile" component={Profile}/>
              <Route exact path="/expenses" component={Expenses}/>
              <Route exact path="/admin/users" component={AdminUsers}/>
              <Route exact path="/admin/users/:userId/expenses" component={AdminUserExpenses}/>
            </div>
          </Router>
        </MuiThemeProvider>
      </Provider>
    )
  }
}

export default App
