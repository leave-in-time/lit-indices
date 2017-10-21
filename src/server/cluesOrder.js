const mongoose = require('mongoose');

const cluesOrderSchema = mongoose.Schema({
	roomId: String,
	order: [String],
});

const CluesOrder = mongoose.model('CluesOrder', cluesOrderSchema);

module.exports = CluesOrder;
