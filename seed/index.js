const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelper');

mongoose.connect('mongodb://localhost:27017/help-camp');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'database connection error'));
db.once('open', () => console.log('Database connected'));

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDatabase = async (quantity) => {
	console.log('Seeding started...');
	await Campground.deleteMany({});
	const promises = [];
	console.log('All campgrounds have been deleted');
	for (let i = 0; i < quantity ?? 0; i++) {
		const random1000 = Math.floor(Math.random() * 1000);
		const campground = new Campground({
			location: `${cities[random1000].city}, ${cities[random1000].state}`,
			title: `${sample(descriptors)} ${sample(places)}`,
			price: Math.floor(Math.random() * 20) + 10,
			image: `https://picsum.photos/400?random=${Math.random()}`,
			description:
				'Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias laboriosam dolore in, exercitationem officia nobis, expedita reprehenderit magni natus cumque deleniti quisquam corrupti. Harum ad quas nobis nihil id laboriosam.',
		});

		promises.push(campground.save());
	}

	await Promise.all(promises);
	console.log('All campgrounds have been created');
};

seedDatabase(50)
	.then(() => console.log('Seeding completed'))
	.catch((e) => console.error(`seeding failed: ${e}`))
	.finally(async () => {
		await mongoose.connection.close();
	});
