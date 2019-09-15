const Todo = require("../models/todo");
const User = require("../models/user");

class TodoController {
  static getTodos(req, res, next) {
    console.log('req.decoded:', req.decoded)
    Todo.find({ userId: req.decoded._id })
      .then(todos => {
        if (!todos) {
          res.status(500).json({ message: "Collection is empty" });
        } else {
          console.log("get Todos success");
          res.status(200).json(todos);
        }
      })

      .catch(err => {
        console.log("error", err);
        res.status(500).json({ err: err.message });
        next(err)
      });
  }

  static getTodo(req, res, next) {
    Todo.findOne({ _id: req.params.id })
      .then(todo => {
        if (!todo) {
          res.status(500).json({ message: "Todo doesn't exist" });
        } else {
          console.log("get Todo success");
          res.status(200).json(todo);
        }
      })

      .catch(err => {
        console.log("error", err);
        res.status(500).json(err);
        next(err)
      });
  }

  static createTodo(req, res, next) {
    const { name, description, due } = req.body
    console.log(req.decoded._id, '<<<<<<<<<<<<<<<<<')
    Todo.create({
      name,
      description,
      status: "In Progress",
      due,
      userId : req.decoded._id
    })
      .then(data => {
        res.json(data)
      })
      .catch(err => {
        next(err)
      })
  }

  static updateStatus(req, res, next) {
    if (req.body.status === "In Progress") {
      req.body.status = "Completed";
    } else {
      req.body.status = "In Progress";
    }

    const updatedStatus = {
      status: req.body.status,
    };

    Todo.updateOne({
      _id: (req.params.id)
    }, {
        $set: updatedStatus
      })
      .then(updatedTodoStatus => {
        console.log("update Status success");
        res.status(200).json(updatedTodoStatus);
      })

      .catch(err => {
        console.log("error", err);
        res.status(500).json(err);
        next(err)
      });
  }

  static updateTodo(req, res, next) {
    const updatedTodo = {}
    const { name, description, status, due } = req.body
    if(name) updatedTodo.name = name
    if(description) updatedTodo.description = description
    if(status) updatedTodo.status = status
    if(due) updatedTodo.due = due

    console.log(req.body)

    Todo.updateOne({
      _id: (req.params.id)
    }, {
        $set: updatedTodo
      })
      .then(updateTodo => {
        console.log("update Todo success");
        res.status(200).json(updateTodo);
      })

      .catch(err => {
        console.log("error", err);
        res.status(500).json(err);
        next(err)
      });
  }

  static deleteTodo(req, res, next) {
    Todo.deleteOne({ _id: req.params.id })
      .then(todo => {
        console.log("delete Todo success");
        res.status(200).json(todo);
      })

      .catch(err => {
        console.log("error", err);
        res.status(500).json(err);
        next(err)
      });
  }
}

module.exports = TodoController;
