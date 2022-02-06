const express = require('express');
const mongoose = require('mongoose');

const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();
const userRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');
const conversationRoute = require('./routes/conversations');
const messageRoute = require('./routes/messages');

const multer = require('multer');
const path = require('path');

const app = express();

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
	console.log('Connected to Mongo');
});

app.use('/images', express.static(path.join(__dirname, 'public/images')));

app.use(express.json());
app.use(helmet());
// app.use(morgan('common'));

const storage = multer.diskStorage({
	destination : (req, file, cb) => {
		cb(null, 'public/images');
	},
	filename    : (req, file, cb) => {
		cb(null, req.body.name);
	}
});

const upload = multer({ storage });

app.post('/api/upload', upload.single('file'), (req, res) => {
	try {
		return res.status(200).json('File uploaded successfully');
	} catch (error) {
		console.log(error);
	}
});

app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/posts', postRoute);
app.use('/api/conversations', conversationRoute);
app.use('/api/messages', messageRoute);

app.listen(8800, (err) => (err ? console.error(err) : console.log(`Server listening on port 8800`)));
