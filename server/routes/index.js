const express = require("express");
const router = express.Router();
const todosRouter = require('./todos')

const UserController = require("../controllers/user");

router.post("/login", UserController.login);
router.post("/google-login", UserController.googleLogin);
router.post("/register", UserController.createUser);
router.use("/todos", todosRouter)

module.exports = router;