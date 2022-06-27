const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    userName: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false,
        default: 'This poll has no description.'
    },
    option1: {
        url: {
            type: String,
            required: true
        },
        votes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user'
            }
        ]
    },
    option2: {
        url: {
            type: String,
            required: true
        },
        votes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user'
            }
        ]
    },
    date: {
        type: Date,
        required: false,
        default: Date.now
    }
});

module.exports = mongoose.model('post', PostSchema);
