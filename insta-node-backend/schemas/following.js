const user = require('./user');
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
module.exports = {
    ownerId: {
        type: ObjectId,
        ref:'User'
    },
    followingId: {
        type: ObjectId,
        ref:'User'
    }
}