const express = require('express');
const mongoose = require('mongoose');

const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();
const userRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

const app = express();

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
	console.log('Connected to Mongo');
});

app.use(express.json());
app.use(helmet());
app.use(morgan('common'));

app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/posts', postRoute);

app.listen(8800, (err) => (err ? console.error(err) : console.log(`Server listening on port PORT`)));
