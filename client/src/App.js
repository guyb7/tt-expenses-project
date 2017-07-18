import React, { Component } from 'react'
import { Provider } from 'react-redux'
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import * as actionCreators from './store/action-creators'

import NavBar from './components/NavBar'
import SideDrawer from './components/SideDrawer'
import Home from './components/Home'
import ComingSoon from './components/ComingSoon'

const baseUrl = process.env.NODE_ENV.toUpperCase() === 'TEST' ? '' : '/app'

class App extends Component {
  componentWillMount() {
    // If not on /login page, check if logged in and redirect to /login if not
    // this.props.history.push('/login')
    this.props.store.dispatch(actionCreators.requestProfile())
  }

  render() {
    return (
      <Provider store={ this.props.store }>
        <MuiThemeProvider>
          <Router basename={baseUrl}>
            <div>
              <NavBar />
              <SideDrawer />
              <Route exact path="/" component={Home}/>
              <Route exact path="/login" component={ComingSoon}/>
              <Route exact path="/profile" component={ComingSoon}/>
              <Route exact path="/expenses" component={ComingSoon}/>
              <Route exact path="/expenses/:expenseId" component={ComingSoon}/>
              <Route exact path="/admin" component={ComingSoon}/>
              <Route exact path="/admin/users" component={ComingSoon}/>
              <Route exact path="/admin/users/:userId" component={ComingSoon}/>
              <Route exact path="/admin/users/:userId/expenses" component={ComingSoon}/>
              <Route exact path="/admin/expense/:expenseId" component={ComingSoon}/>
            </div>
          </Router>
        </MuiThemeProvider>
      </Provider>
    )
  }
}

export default App
