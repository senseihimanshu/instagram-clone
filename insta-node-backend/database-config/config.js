const mongoose = require('mongoose');
const url = "mongodb://localhost:27017/instaDB"

mongoose.Promise = global.Promise;

mongoose.connect(url, { useNewUrlParser: true, keepAlive: 1, useUnifiedTopology: true })
  .then(res => {
    console.log('Connected to Mongoose Client');
  })
  .catch(error => {
    console.log('Something bad occured while connecting to mongoose client');
  });

module.exports = mongoose;
