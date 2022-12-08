const User = require('../models/User')
const Tweet = require('../models/Tweet')

// Require bcrypt 
const bcrypt = require('bcrypt');
const salt = 10;

// Require jsonwebtoken
const jwt = require("jsonwebtoken");

async function createUser(req,res) {
    try {
        // Plain Text to Ecrypted String
        let hashedPassword = bcrypt.hashSync(req.body.password, salt)
        console.log(hashedPassword);

        const newUser = await User.create({
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        })
        res.json(newUser)
    } catch (err) {
        res.json(err)
    }
}

const auth_sigin_post = async (req, res) =>{
    let {email, password} = req.body;
    console.log(email);

    try{
        let user = await User.findOne({email}); // email: email
        console.log(user);

        if(!user){
            return res.json({message: "User not found"}).status(400);
        }

        // Password Comparison
        const isMatch = await bcrypt.compareSync(password, user.password);
        console.log(password); // Plaintext password
        console.log(user.password); // Encrypted password

        if(!isMatch) {
            return res.json({message: "Password not matched"}).status(401);
        }

        // JWT Token
        const payload = {
            user: {
                id: user._id,
                name: user.name
            }
        }

        jwt.sign(
            payload,
            process.env.SECRET,
            { expiresIn: 36000000},
            (err, token) => {
                if(err) throw err;
                res.json({token}).status(200);
            }
        )
    } catch (error) {
        console.log(error)
        res.json({message: "You are not loggedin!. Try again later."}).status(400);
    }
} 

async function createUserTweet(req,res) {
    // Find the user that created the tweet
    let user = await User.findById(req.params.userId)
    //Create the tweet
    let newTweet = await Tweet.create(req.body)
    // Push the new tweet ID into the user's 'tweets' property
    user.tweets.push(newTweet._id)
    // Save our changes to the user
    await user.save()
    // Respond with the user data
    // Populate the tweet data
    await user.populate('tweets')
    res.json(user)
}


async function updateUser() {
    try {
    let updatedUser = await User.findByIdAndUpdate(
        req.params._id,
        req.body
    )
    res.json({message: 'User updated Successfully!'})
    // res.json(updatedUser)
    } catch (err) {
        res.json(err)
    }
}

async function deleteUser(req, res) {
    try {
        await User.findByIdAndDelete(req.params._id)
        res.json({message: 'User deleted successfully!'})
    } catch (err) {
        res.json(err)
    }
}


async function getAllUsers(req, res) {
    try {
        const allUsers = await User.find().populate('tweets')
        res.json(allUsers)
    } catch (err) {
        res.json(err)
    }
}

module.exports = {
    createUser,
    getAllUsers,
    createUserTweet,
    updateUser,
    deleteUser,
    auth_sigin_post
}