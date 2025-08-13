const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const methodOverride = require('method-override');
const morgan = require('morgan');
const ejsMate = require('ejs-mate');
const AppError = require('./utils/error');

mongoose.connect('mongodb://localhost:27017/help-camp');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'database connection error'));
db.once('open', () => console.log('Database connected'));

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, 'public')));

function catchAsyncErrors(fn) {
	return function (req, res, next) {
		fn(req, res, next).catch((e) => next(e));
	};
}

app.get('/', (req, res) => {
	res.render('home');
});

app.get(
	'/campgrounds',
	catchAsyncErrors(async (req, res) => {
		const campgrounds = await Campground.find({});
		res.render('campgrounds/index', { campgrounds });
	})
);

app.get(
	'/campgrounds/create',
	catchAsyncErrors(async (req, res) => {
		res.render('campgrounds/create');
	})
);

app.post(
	'/campgrounds',
	catchAsyncErrors(async (req, res) => {
		if (!req.body || !req.body.campground) {
			throw new AppError('missing campground in request', 400);
		}
		const { campground } = await req.body;
		const camp = new Campground(campground);
		await camp.save();
		return res.redirect(`/campgrounds/${camp._id}`);
	})
);

app.get('/campgrounds/:id/edit', async (req, res, next) => {
	const campground = await Campground.findById(req.params.id);
	if (!campground) {
		const notFoundError = new AppError('Campground was not found', 404);
		return next(notFoundError);
	}
	res.render('campgrounds/edit', { campground });
});

app.get('/campgrounds/:id', async (req, res, next) => {
	const campground = await Campground.findById(req.params.id);
	if (!campground) {
		const notFoundError = new AppError('Campground was not found', 404);
		return next(notFoundError);
	}
	const formattedPrice = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	}).format(campground.price);
	res.render('campgrounds/show', { campground, formattedPrice });
});

app.put('/campgrounds/:id', async (req, res) => {
	const campground = await Campground.findByIdAndUpdate(req.params.id, {
		...req.body.campground,
	});
	res.redirect(`/campgrounds/${campground._id}`);
});

app.delete('/campgrounds/:id', async (req, res) => {
	await Campground.findByIdAndDelete(req.params.id);
	res.redirect('/campgrounds');
});

app.use((req, res, next) => {
	next(new AppError('Page NotFound', 404));
});

app.use((err, req, res, next) => {
	const { status = 500 } = err;
	if (!err.message) err.message = 'Something went wrong on our side';
	res.status(status).render('error', { err });
});

app.listen('3000', () => {
	console.log('App running on http://localhost:3000');
});
