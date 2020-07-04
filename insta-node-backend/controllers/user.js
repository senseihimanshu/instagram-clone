const model = require("../models");
const jwtHandler = require("../jwtHandler");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const bcrypt = require("bcrypt");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = `./uploads/${req.user.data.instaHandle}`;
    fs.exists(dir, exist => {
      if (!exist) return fs.mkdir(dir, error => cb(error, dir));

      return cb(null, `./uploads/${req.user.data.instaHandle}`);
    });
  },

  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) return cb(null, true);
    return cb("Error: Images Only");
  }
}).single("image");

class user {
  constructor() {
  }

  async checkIfDuplicate(req, res) {
    const user = await model.user.get(req.body);
    if (user[0] == null) {
      res.status(200).send({ success: true, message: "does not exists" });
    } else {
      res.status(406).send({ success: true, message: "duplicate key" });
    }
  }

  async update(req, res) {
    var exists = false;
    if (jwtHandler.tokenVerifier(req.headers.token)) {
      let instaHandle = req.body.instaHandle;
      if (instaHandle != null) {
        let user = await model.user.get({ instaHandle: instaHandle });
        if (user[0] == null || user[0]._id == req.params.id) {
          exists = false;
        } else {
          exists = true;
        }

      }
      try {
        if (exists == false) {
          let updateObject = {};
          updateObject = { ...updateObject, ...req.body };
          const userObj = await model.user.update(
            { _id: req.params.id },
            updateObject
          );
          res.status(200).send(userObj);
        } else {
          res.status(406).send({ message: "This username isn't available!!" });
        }
      } catch (error) {
        res.status(406).send({
          message:
            "Email is already in use!!."
        });
      }
    } else {
      res.status(401).send({ message: "Unauthorized" });
    }
  }

  async deleteAccount(req, res) {
    const token = jwtHandler.tokenVerifier(req.headers.token);
    if (token) {
      const deleteObj = await model.user.delete({ _id: req.params.id });
      res.send(deleteObj);
    } else {
      res.status(401).send("Unauthorized");
    }
  }

  async show(req, res) {
    console.log(req.headers.token);
    if (jwtHandler.tokenVerifier(req.headers.token)) {
      var obj = req.query;
      if (obj.id != "null") {
        var userObj = await model.user.get({ _id: obj.id });
      } else {
        userObj = await model.user.get({ instaHandle: obj.instaHandle });
      }

      if (userObj[0] != null) {
        res.status(200).send({ user: userObj['0'], bufferedImage: userObj[0].image ? fs.readFileSync(userObj[0].image) : null });
      } else {
        res.status(404).send({
          message: "not a user"
        });
      }
    } else {
      res.status(401).send({ message: "Unauthorized" });
    }
  }

  async showAll(req, res) {
    const token = jwtHandler.tokenVerifier(req.headers.token);
    if (token) {
      const userObj = await model.user.get();
      res.send(userObj);
    } else {
      res.status(401).send("Unauthorized");
    }
  }

  async changePassword(req, res) {
    const passwordObj = req.body
    const token = jwtHandler.tokenVerifier(req.headers.token);
    const checkPassword = await model.user.checkPassword({ _id: req.params.id }, passwordObj.oldPassword)

    if (token) {

      try {
        if (passwordObj.newPassword != passwordObj.confirmNewPassword) {
          res.status(400).send({
            success: false,
            message: "Please make sure both passwords match."
          })
        }

        else if (passwordObj.oldPassword == passwordObj.newPassword) {
          res.status(400).send({
            success: false,
            message: "Create a new password that isn't your current password."
          })
        }

        else if (checkPassword == false) {
          res.status(400).send({
            success: false,
            message: "Your old password was entered incorrectly. Please enter it again."
          })
        }

        else {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(passwordObj.newPassword, salt);
          let obj = await model.user.update({ _id: req.params.id }, { password: hashedPassword })
          res.status(200).send({
            success: true,
            message: "Password Changed Successfully."
          })
        }
      }
      catch{
        res.status(401).send({ message: "Some error occured" })
      }

    }

    else {
      res.status(401).send("Unauthorized");
    }
  }

  async changeProfilePic(req, res) {
    upload(req, res, async error => {
      if (error) {
        return res.status(400).send({
          success: false,
          payload: {
            message: error
          }
        });
      }

      const file = req.file;


      if (!file) {
        const error = new Error("No File");
        return res.status(400).send({
          success: false,
          payload: {
            message: error
          }
        });
      }

      await model.user.update({ _id: req.user.data._id }, { image: file.path });

      return res.send({
        success: true,
        payload: {
          data: {
            file
          },
          message: "File Uploaded Successfully!"
        }
      });
    });
  }
  async index(req, res) {
    const userList = await model.user.get();
    res.send(userList);
  }
}
module.exports = new user();
