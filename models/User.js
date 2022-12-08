const mongoose = require('mongoose')

const schema = mongoose.Schema


const UserModel = new schema({
    name: {type: String, required: true},
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    //Associate the tweet model
    tweets: [{
        type: schema.Types.ObjectId,
        ref: 'Tweet'
        }]
}, {
    timestamps: true
})


const User = mongoose.model('User', UserModel)

module.exports = User


