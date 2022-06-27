const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const Post = require('../../models/Post');
const User = require('../../models/User');
const mongoose = require('mongoose');

// @route   POST api/posts
// @desc    create a post
// @access  Private
router.post(
    '/',
    auth,
    [
        check('title', 'Title is required').not().isEmpty(),
        check('option1', 'Option 1 is required').not().isEmpty(),
        check('option2', 'Option 2 is required').not().isEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const user = await User.findById(req.user.id).select('-password');

            // destructure the request
            const {
                title,
                option1,
                option2,
                // spread the rest of the fields we don't need to check
                ...rest
            } = req.body;

            const postFields = {
                userID: user._id,
                userName: user.name,
                title,
                option1,
                option2,
                ...rest
            }

            const newPost = new Post({
                ...postFields
            });
            
            const saved = await newPost.save();
            return res.json(saved);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
)

// @route   GET api/posts/:id
// @desc    get a post by post id
// @access  Public
router.get(
    '/:id',
    async (req, res)  => {
        const id = req.params.id;

        const validId = mongoose.Types.ObjectId.isValid(id);
        if (validId) {
            try {
                const post = await Post.findById(id);
    
                if (post) {
                    return res.json(post);
                } else {
                    return res.status(400).json('No post found');
                }
            } catch (err) {
                console.error(err.message);
                res.status(500).send('Server Error');
            }
        } else {
            res.status(400).send('No post found');
        }

    }
)

// @route   GET api/posts
// @desc    get all posts by user id
// @access  Private
router.get(
    '/',
    auth,
    async (req, res)  => {
        const id = req.user.id;

        try {
            const post = await Post.find({userID: id});
            return res.json(post);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
)

// @route   PUT api/posts/vote
// @desc    add vote to a post
// @access  Private
router.put(
    '/',
    auth,
    [
        check('id', 'ID is required').not().isEmpty(),
        check('option', 'Option is required').not().isEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const post_id = req.body.id;
            const user_id = req.user.id;

            // Getting the post by id
            const post = await Post.findById(post_id);

            if (post.userID == user_id) {
                return res.status(400).send('You are the author of the post silly!')
            }
            
            // Checking if user has already voted
            const votes1 = post.option1.votes;
            for (let i = 0; i < votes1.length; i++) {
                if (user_id == votes1[i]) {
                    return res.status(400).send('You have already voted silly!');
                }
            }
            const votes2 = post.option2.votes;
            for (let i = 0; i < votes2.length; i++) {
                if (user_id == votes2[i]) {
                    return res.status(400).send('You have already voted silly!');
                }
            }

            if (req.body.option === 'option1') {                
                // Updating the votes
                post.option1.votes = [...post.option1.votes, user_id];
            } else if (req.body.option === 'option2') {
                // Updating the votes
                post.option2.votes = [...post.option2.votes, user_id];
            }

            post.save()
            res.json(post);
        } catch(err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    }
)

// @route   PUT api/posts/vote
// @desc    add vote to a post
// @access  Private
router.delete(
    '/',
    auth,
    [
        check('id', 'ID is required').not().isEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const post_id = req.body.id;

            await Post.findByIdAndDelete(post_id);

            res.status(200).send('Post deleted');
        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    }
)


module.exports = router;
