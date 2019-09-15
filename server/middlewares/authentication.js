const jwt = require('../helpers/jwt-helper')
const Todo = require('../models/todo')
function authentication(req, res, next) {
    console.log('masuk authentication')
    try {
      let decoded = jwt.verify(req.headers.token);
      req.decoded = decoded
      next()
  } catch (err) {
      next(err)
  }
}

function authorization(req, res, next) {
    Todo.findById(req.params.id)
        .then(todo => {
            if (todo) {
                if (todo.userId == req.decoded._id) {
                    next()
                } else {
                    res.status(401).json({ message: 'Unauthorized user' })
                }
            }
        })
        .catch(err => {
            res.status(500).json({ message: 'todo is not found' })
            next(err)
        })

}

module.exports = {
    authentication,
    authorization
}