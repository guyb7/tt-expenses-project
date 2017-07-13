import React, { Component } from 'react'
import { Provider } from 'react-redux'
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import NavBar from './components/NavBar'
import SideDrawer from './components/SideDrawer'
import Home from './components/Home'

const baseUrl = process.env.NODE_ENV.toUpperCase() === 'TEST' ? '' : '/app'

class App extends Component {
  render() {
    return (
      <Provider store={ this.props.store }>
        <MuiThemeProvider>
          <Router basename={baseUrl}>
            <div>
              <NavBar />
              <SideDrawer />
              <Route exact path="/" component={Home}/>
            </div>
          </Router>
        </MuiThemeProvider>
      </Provider>
    )
  }
}

export default App
