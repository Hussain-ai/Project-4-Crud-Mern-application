const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    authorName: {
        type: String,
        required: true,
    },
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
