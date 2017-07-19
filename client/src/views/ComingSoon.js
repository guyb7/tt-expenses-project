import React from 'react'
import { connect } from 'react-redux'

import * as actionCreators from '../store/action-creators'

class ComingSoon extends React.Component {
  componentDidMount() {
    this.props.dispatch(actionCreators.setNavTitle('Under Construction'))
  }

  render () {
    return (
      <div>
        This page is comming soon :)
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {}
}

const ConnectedComingSoon = connect(mapStateToProps)(ComingSoon)

export default ConnectedComingSoon
