// We import the Model to communicate with the Database
const Tweet = require('../models/Tweet')

async function getAllTweets(req,res) {
    const allTweets = await Tweet.find()
    res.json(allTweets)
}

async function createTweet(req,res) {
    console.log('Req Body! ', req.body)
    // Method 3
    // Tweet.create({
    //     name: req.body.name,
    //     content: req.body.content
    // })
    Tweet.create(req.body)
    .then(newTweet => res.json(newTweet))
    .catch(err => res.json(err))
    
    // Method 2
    // let newTweet = await Tweet.create({
    //     name: req.body.name,
    //     content: req.body.content
    // })
    // Method 1
    // let newTweet = new Tweet(
    //     name: req.body.name
    //     content: req.body.content
    // )
    // await newTweet.save()
}

async function updateTweet(req, res) {
    try {
    // await Tweet.findOne({ _id: ... })
    let updatedTweet = await Tweet.findByIdAndUpdate(
        req.params._id,
        req.body //form body
        // {content: req.body.content}
    )
        res.status(200).json({message: 'Tweet updated Successfully!'})
    // res.json(updatedTweet)
    } catch (err) {
        res.json(err)
    }
}


async function deleteTweet(req,res) {
    try {
        await Tweet.findByIdAndDelete(
            req.params._id
        )
        res.json({message: 'Tweet Deleted Successfully'})
    } catch (err) {
        res.json(err)
    }
}


async function getTweet(req,res) {
    try {
        const tweet = await Tweet.findById(req.params._id)
        res.json(tweet)
    } catch (err) {
        res.json(err)
    }
}

// Exporting/Sharing our functions
module.exports = {
    getAllTweets,
    getTweet,
    createTweet,
    updateTweet,
    deleteTweet
}




