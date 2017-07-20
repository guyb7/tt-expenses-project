import React from 'react'

import AlertError from 'material-ui/svg-icons/alert/error'
import { red500 } from 'material-ui/styles/colors'

const style = {
  error: {
    color: red500,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }
}

class ErrorMessage extends React.Component {
  render() {
    return(
      <div className={this.props.text ? '' : 'hidden'}>
        <div style={style.error}>
          <AlertError color={red500} style={{ marginRight: 10 }}></AlertError>
          {this.props.text}
        </div>
      </div>
    )
  }
}

export default ErrorMessage
