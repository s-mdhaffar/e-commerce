const { Promise } = require('mongoose');
const Post = require('../models/Post');
const User = require('../models/User');

const router = require('express').Router();

router.post('/', async (req, res) => {
	const newPost = new Post(req.body);
	try {
		const savedPost = await newPost.save();
		res.status(200).json(savedPost);
	} catch (error) {
		res.status(500).json(error);
	}
});

router.put('/:id', async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (post.userId === req.body.userId) {
			await post.updateOne({ $set: req.body });
			res.status(200).json('Post updated');
		}
		else {
			res.status(403).json('you cant update this post');
		}
	} catch (error) {
		res.status(500).json(error);
	}
});

router.delete('/:id', async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (post.userId === req.body.userId) {
			await Post.findByIdAndRemove(req.params.id);
			res.status(200).json('Post deleted');
		}
		else {
			res.status(403).json('You can only delete your posts');
		}
	} catch (error) {
		res.status(500).json(error);
	}
});

router.put('/:id/like', async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post.likes.includes(req.body.userId)) {
			await post.updateOne({ $push: { likes: req.body.userId } });
			res.status(200).json('post liked');
		}
		else {
			await post.updateOne({ $pull: { likes: req.body.userId } });
			res.status(200).json('post unliked');
		}
	} catch (error) {
		res.status(500).json(error);
	}
});

router.get('/:id', async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		res.status(200).json(post);
	} catch (error) {
		res.status(500).json(error);
	}
});

router.get('/timeline/all', async (req, res) => {
	try {
		const currentUser = await User.findById(req.body.userId);
		const userPosts = await Post.find({ userId: currentUser._id });
		const friendPosts = await Promise.all(
			currentUser.followings.map((friendId) => {
				return Post.find({ userId: friendId });
			})
		);
		res.status(200).json(userPosts.concat(...friendPosts));
	} catch (error) {
		res.status(500).json(error);
	}
});

module.exports = router;
