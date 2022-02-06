const User = require('../models/User');
const bcryptjs = require('bcryptjs');

const router = require('express').Router();

router.post('/register', async (req, res) => {
	const { userName, email, password } = req.body;
	const newUser = new User({
		userName,
		email,
		password
	});
	try {
		let salt = await bcryptjs.genSalt(10);
		let hash = await bcryptjs.hash(password, salt);
		newUser.password = hash;
		await newUser.save();
		res.status(200).json(newUser);
	} catch (error) {
		console.log(error);
	}
});

router.post('/login', async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email });
		if (!user) res.status(404).json('User not found');
		const validPassword = await bcryptjs.compare(password, user.password);
		!validPassword && res.status(400).json('Wrong password');
		res.status(200).json(user);
	} catch (error) {
		console.log(error);
	}
});
module.exports = router;
