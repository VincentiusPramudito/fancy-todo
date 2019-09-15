const bcrypt = require("../helpers/bcryptjs-helper");
const jwt = require("../helpers/jwt-helper");
const User = require("../models/user");

class UserController {
  static createUser(req, res, next) {
    User.create({
      username: req.body.username.toLowerCase() ,
      password: bcrypt.hashSync(req.body.password),
    })
      .then(user => {
        console.log(user, 'create new user non gsign')
        const { username, _id } = user
        const token = jwt.sign({ username, _id })
        res.status(201).json({ token, username });
      })
      .catch(err => {
        console.log(err);
        next(err);
      });
  }

  static login(req, res, next) {
    User.findOne({ username: req.body.username.toLowerCase() })
      .then(user => {
        if (user) {
          console.log(user, 'login successfully')
          if (bcrypt.compareSync(req.body.password, user.password)) {
            const { username, _id } = user
            const token = jwt.sign({ username, _id })
            res.status(201).json({ token, username });
          } else {
            res.status(404).json({ message: 'invalid password/username' })
          }
        } else {
          res.status(404).json({ message: 'invalid password/username' })
        }
      })

      .catch(err => {
        console.log(err);
        next(err);
      });
  }

  static googleLogin(req, res, next) {
    const { OAuth2Client } = require("google-auth-library");
    const client = new OAuth2Client(process.env.CLIENT_ID);
    console.log(client)

    client.verifyIdToken({
      idToken: req.body.token,
      audience: process.env.CLIENT_ID
      /*  Specify the CLIENT_ID of the app that accesses the backend
          Or, if multiple clients access the backend:
          [CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
      */
    })
      .then(ticket => {
        const payload = ticket.getPayload();
        /*
        If request specified a G Suite domain:
        const domain = payload['hd'];

        const userid = payload["sub"];
        console.log(userid);
        */

        User.findOne({
          username: payload.email
        })
          .then(data => {
            if (data) {
              console.log('user exist on database')
              let { username, _id } = data
              username = username.slice(0, username.indexOf('@'))
              const token = jwt.sign({
                _id,
                username,
              }, process.env.JWT_SECRET)
              req.headers.token = token
              res.status(201).json({ token, username })
            } else {
              console.log('creating new user in database')
              const { email } = payload
              const username = email
              User.create({
                username,
                password: bcrypt.hashSync(process.env.DEFAULT_PASSWORD)
              })
                .then(newUser => {
                  if (newUser) {
                    let { username, _id } = newUser
                    username = username.slice(0, email.indexOf('@'))
                    const token = jwt.sign({
                      _id,
                      username,
                    }, process.env.JWT_SECRET)
                    req.headers.token = token
                    res.status(201).json({ token, username })
                  }
                })
                .catch(err => {
                  console.log(err, 'error create new user with gsign')
                  next(err)
                })
            }
          })
          .catch(err => {
            console.log(err, 'error access database')
            next(err)
          })
      })
      .catch(err => {
        console.log(err, 'error create new data with gsign')
        next(err)
      })
  }
}

module.exports = UserController;
