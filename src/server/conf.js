const mongoose = require('mongoose');

const confSchema = mongoose.Schema({
	roomId: String,
	ip: String,
	clueSound: String,
	color: String
});

const Conf = mongoose.model('Conf', confSchema);

module.exports = Conf;
