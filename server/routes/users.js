const router = require('express').Router();
const bcryptjs = require('bcryptjs');
const { Router } = require('express');
const { findById } = require('../models/User');
const User = require('../models/User');

router.put('/:id', async (req, res) => {
	if (req.body.userId === req.params.id || req.body.isAdmin) {
		if (req.body.password) {
			try {
				let salt = await bcryptjs.genSalt(10);
				req.body.password = await bcryptjs.hash(req.body.password, salt);
			} catch (error) {
				res.status(500).json(error);
			}
		}
		try {
			const user = await User.findByIdAndUpdate(req.params.id, { $set: req.body });
			res.status(200).json(user);
		} catch (error) {
			return res.status(500).json(error);
		}
	}
	else {
		return res.status(403).json('You can update your account only');
	}
});

router.delete('/:id', async (req, res) => {
	if (req.body.userId === req.params.id || req.body.isAdmin) {
		try {
			await User.findByIdAndRemove(req.params.id);
			return res.status(200).json('User deleted');
		} catch (error) {
			return res.status(500).json(error);
		}
	}
	else {
		return res.status(403).json('You can delete your account only');
	}
});

router.get('/:id', async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		const { password, updatedAt, ...others } = user._doc;
		res.status(200).json(others);
	} catch (error) {
		return res.status(500).json(error);
	}
});

router.put('/:id/follow', async (req, res) => {
	if (req.body.userId !== req.params.id) {
		try {
			const user = await User.findById(req.params.id);
			const currentUser = await User.findById(req.body.userId);
			if (!user.followers.includes(req.body.userId)) {
				await user.updateOne({ $push: { followers: req.body.userId } });
				await currentUser.updateOne({ $push: { followings: req.params.id } });
				res.status(200).json('User has been followed');
			}
			else {
				res.status(403).json('You already follow this user');
			}
		} catch (error) {
			res.status(500).json(error);
		}
	}
	else {
		res.status(403).json('you cant follow yourself');
	}
});

router.put('/:id/unFollow', async (req, res) => {
	if (req.body.userId !== req.params.id) {
		try {
			const user = await User.findById(req.params.id);
			const currentUser = await User.findById(req.body.userId);
			if (user.followers.includes(req.body.userId)) {
				await user.updateOne({ $pull: { followers: req.body.userId } });
				await currentUser.updateOne({ $pull: { followings: req.params.id } });
				res.status(200).json('User has been unfollowed');
			}
			else {
				res.status(403).json('You already dont follow this user');
			}
		} catch (error) {
			res.status(500).json(error);
		}
	}
	else {
		res.status(403).json('you cant unfollow yourself');
	}
});

module.exports = router;
