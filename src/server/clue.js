const mongoose = require('mongoose');

const clueSchema = mongoose.Schema({
	description: String,
	type: String,
	roomId: String,
	fileName: String
});

const Clue = mongoose.model('Clue', clueSchema);

module.exports = Clue;
