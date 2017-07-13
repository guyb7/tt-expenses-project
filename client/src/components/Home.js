import React from 'react'
import { connect } from 'react-redux'

import * as actionCreators from '../store/action-creators'

class Home extends React.Component {
  componentDidMount() {
    this.props.dispatch(actionCreators.setNavTitle('Home'))
  }

  

  render () {
    return (
      <div>
        Home
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {}
}

const ConnectedHome = connect(mapStateToProps)(Home)

export default ConnectedHome
