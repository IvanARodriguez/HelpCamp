const mongoose = require('mongoose');
const { Schema } = mongoose;

const campgroundSchema = new Schema({
	title: { type: String, required: true, trim: true },
	price: {
		type: Number,
		required: true,
		min: [1, 'Price must be greater than 1'],
	},
	image: {
		type: String,
		required: true,
		match: [/^https?:\/\//, 'Image must be a valid URL'],
	},
	description: { type: String, required: true, trim: true },
	location: { type: String, required: true, trim: true },
});

module.exports = mongoose.model('Campground', campgroundSchema);
