const express = require('express');
const routes = express.Router();
const verifyToken = re('../middleware/auth')

const Post = require('../models/Post')

//@route GET api/posts
// @desc Get post 
// @access Private
router.get('/', verifyToken, async(req, res) => {
        try {
            const posts = await Post.find({ user: req.userId }).populate('user', 'password')
        } catch (error) {
            console.log(error)
            res.status()

        }
    }),


    //@route POST api/posts
    // @desc Create post 
    // @access Private
    router.post('/', verifyToken, async(req, res) => {
        const { title, description, url, status } = req.body;

        //simple validation
        if (!type) return res.status(400).json({ success: false, message: 'title is required' });


        try {
            const newPost = new Post({
                title,
                description,
                url: url.startswith('https://') ? url : `https://${url}`,
                status: status || 'TO LEARN',
                user: req.userId,
            })

            await newPost.save();

            res.json({
                success: true,
                messages: 'happy learning!',
                post: newPost
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({ success: false, message: 'i' })

        }
    })

module.exports = routes;