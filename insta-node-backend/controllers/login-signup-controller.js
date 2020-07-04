const model = require("../models");
const jwtHandler = require("../jwtHandler");
const bcrypt = require("bcrypt");

class employee {
  constructor() { }

  async createUser(req, res) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    try {
      let user = await model.user.getOne({ instaHandle: req.body.instaHandle });
      if (user == null) {
        let userObject = {
          name: req.body.name,
          instaHandle: req.body.instaHandle,
          phone: req.body.phone,
          email: req.body.email,
          password: hashedPassword,
        };

        var instaUser = await model.user.save(userObject);
        let message = "user created";
        res.status(200).send({
          userObject,
        });
      }
    } catch (error) {
      let message =
        error.message;

      res.status(406).send({
        success: false,
        message: message,
      });
    }
  }

  async checkUserAuthentication(req, res) {
    try {
      let user = await model.user.get({
        $or: [
          { instaHandle: req.body.instaHandle },
          { email: req.body.instaHandle },
          { phone: req.body.instaHandle },
        ],
      });
      console.log(user, req.body);
      //</expressionN> let user = await model.user.get({"instaHandle": req.body.instaHandle});
      if (user[0] != null) {
        let checkUser = await model.user.checkPassword(
          {
            $and: [
              {
                $or: [
                  { instaHandle: req.body.instaHandle },
                  { email: req.body.instaHandle },
                  { phone: req.body.instaHandle },
                ],
              },
            ],
          },
          req.body.password
        );

        if (checkUser == true) {
          let token = jwtHandler.tokenGenerator(user);
          if (token != null) {
            let resBody = {
              token: token,
            };
            res.status(200).send(resBody);
          } else {
          }
        } else {
          let message =
            "Sorry, your password was incorrect. Please double-check your password.";
          res.status(401).send({
            success: false,
            message: message,
          });
        }
      } else {
        let message =
          "The username you entered doesn't belong to an account. Please check your username and try again.";
        res.status(401).send({
          success: false,
          message: message,
        });
      }
    } catch (e) {
      res.status(500).send({
        success: false,
        message: 'Something Went Wrong'
      });
    }
  }
}

module.exports = new employee();
