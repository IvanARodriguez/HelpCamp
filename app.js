const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');

mongoose.connect('mongodb://localhost:27017/help-camp');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'database connection error'));
db.once('open', () => console.log('Database connected'));

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
	res.render('home');
});

app.get('/campgrounds', async (req, res) => {
	const campgrounds = await Campground.find({});
	res.render('campgrounds/index', { campgrounds });
});

app.get('/campgrounds/create', async (req, res) => {
	res.render('campgrounds/create');
});

app.post('/campgrounds', async (req, res) => {
	const { campground } = req.body;
	if (!campground) {
		res.status(400);
		return res.json({ message: 'campground is missing' });
	}

	const camp = new Campground(campground);
	await camp.save();
	return res.redirect(`/campgrounds/${camp._id}`);
});

app.get('/campgrounds/:id', async (req, res) => {
	const campground = await Campground.findById(req.params.id);
	console.log(campground);
	res.render('campgrounds/show', { campground });
});

app.listen('3000', () => {
	console.log('App running on http://localhost:3000');
});
