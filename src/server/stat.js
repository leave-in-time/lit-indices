const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
	type: String,
	time: Number,
	media: String,
	description: String,
});

const statSchema = mongoose.Schema({
	startTime: Date,
	gameMaster: String,
	roomId: String,
	endTime: Number,
	gameover: Boolean,
	events: [eventSchema],
});

const Stat = mongoose.model('Stat', statSchema);

module.exports = Stat;
