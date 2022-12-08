const mongoose = require('mongoose')

const Schema = mongoose.Schema
//Creating our Tweet Schema
const TweetModel = new Schema({
    name: {type: String, required: true},
    content: {type: String, required: true}
}, {
    timestamps: true
})
//Storing our Schema as a model
const Tweet = mongoose.model('Tweet', TweetModel)
// Exporting our Model 
module.exports = Tweet;


