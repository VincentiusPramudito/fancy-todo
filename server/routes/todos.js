const express = require("express");
const router = express.Router();
const {authentication, authorization } = require("../middlewares/authentication")

const TodoController = require("../controllers/todo");
const authorizationUser = require("../middlewares/authorization-user");

router.use(authentication)
router.get("/", TodoController.getTodos);
router.post("/", TodoController.createTodo);

router.get("/:id", authorization, TodoController.getTodo);  
router.put("/:id", authorization, TodoController.updateTodo);
router.patch("/:id/status", authorization, TodoController.updateStatus);
router.delete("/:id", authorization, TodoController.deleteTodo);

module.exports = router;