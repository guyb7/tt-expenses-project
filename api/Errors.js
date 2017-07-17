const errors = {
  'something-went-wrong': 'Aww, something went wrong!',
  'invalid-credentials': 'Wrong username or password',
  'session-expired': 'Your session has expired',
  'unauthorized': 'You are not authorized to make this request',
  'error-creating-expense': 'Could not create this expense',
  'error-list-expenses': 'There was a problem listing your expenses',
  'no-such-expense': 'This expense does not exist',
  'error-get-expense': 'This expense could not be found',
  'error-update-expense': 'This expense does not exist or could not be updated',
  'error-delete-expense': 'This expense does not exist or could not be deleted',
  'error-creating-user': 'This username already exists',
  'wrong-registration-details': 'Could not create this account',
  'no-such-user': 'This user does not exist',
  'user-not-found': 'Could not find your user',
  'error-updating-user': 'Could not update your account',
  'error-listing-users': 'Could not get the users list',
}

export default {
  handleError: (req, res, err = new Error(), defaultMessage = 'something-went-wrong') => {
    console.log('[ERR]', req.method, req.originalUrl)
    console.log(req.body, req.user)
    console.log(defaultMessage, err)
    res.status(401).json({
      success: false,
      error: {
        id: err.message || defaultMessage,
        text: errors[err.message] || err.message || errors[defaultMessage] || defaultMessage
      }
    })
  }
}
