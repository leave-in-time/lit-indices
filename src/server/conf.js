const mongoose = require('mongoose');

const confSchema = mongoose.Schema({
	roomId: String,
	ip: String,
	idleVideo: String
});

const Conf = mongoose.model('Conf', confSchema);

module.exports = Conf;
