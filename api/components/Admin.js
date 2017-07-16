import Db from '../Database'
import Errors from '../Errors'

export default {
  test: (req, res) => {
    res.json({
      success: true,
      admin: true
    })
  }
}
