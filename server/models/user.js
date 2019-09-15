const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    validate: {
      validator: function(username) {
        return User.findOne({ "username":  username })
          .then(members => {
            if (members) return false;
          })
      },
      message: props => `Username ${props.value} has been taken already.`,
    }
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  todos: [{
    type: Schema.Types.ObjectId,
    ref: "Todo",
  }],
});

const User = mongoose.model("User", userSchema);

module.exports = User;