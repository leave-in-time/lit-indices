const express = require('express');
const formidable = require('formidable');
const cors = require('cors');
const path = require('path');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const fs = require('fs-extra');
const async = require('async');

const Clue = require('./clue');
const Conf = require('./conf');
const Stat = require('./stat');

const processStats = require('./processStats');

let folder = 'public';
let port = 3030;
if (process.env.NODE_ENV === 'production') {
	folder = 'build';
	port = 3000;
}
const publicFolder = path.join(__dirname, '..', '..', folder);
const uploads = path.join(publicFolder, 'uploads');

// ---------------------
// express configuration
// ---------------------
const app = express();
app.use(express.static(publicFolder));
app.use('/start', express.static(publicFolder));
app.use('/stats', express.static(publicFolder));
app.use('/JBJU2A', express.static(publicFolder));
app.use('/JBJU2A/*', express.static(publicFolder));
app.use('/user/*', express.static(publicFolder));
app.use('/display/*', express.static(publicFolder));
app.use(cors());

// upload a new clue
app.post('/api/upload/clue', (req, res) => {
	const form = new formidable.IncomingForm();
	form.keepExtensions = true;
	form.uploadDir = uploads;
	form.parse(req, (err, fields, files) => {
		if (err) res.status(500).send(err);
		else {
			const values = Object.assign({}, fields);
			if (fields.type !== 'text' && files.newFile)
				values.fileName = path.basename(files.newFile.path);
			const clue = new Clue(values);
			clue.save((err, saved) => {
				if (err) res.status(500).send(err);
				else res.status(200).json(saved);
			});
		}
	});
});

// upload a new conf
app.post('/api/upload/conf', (req, res) => {
	const form = new formidable.IncomingForm();
	form.keepExtensions = true;
	form.uploadDir = uploads;
	form.parse(req, (err, fields, files) => {
		if (err) res.status(500).send(err);
		else {
			const values = Object.assign({}, fields);
			if (files.newFile) values.clueSound = path.basename(files.newFile.path);
			Conf.remove({ roomId: values.roomId }, (err, result) => {
				// TODO: handle error 500
				const conf = new Conf(values);
				conf.save((err, saved) => {
					if (err) res.status(500).send(err);
					else res.status(200).json(saved);
				});
			});
		}
	});
});

// get room configuration for the given ip
app.get('/api/conf', (req, res) => {
	const ip = req.ip.startsWith('::ffff:') ? req.ip.split('::ffff:')[1] : req.ip;
	Conf.findOne({ ip }, (err, conf) => {
		res.status(200).send(conf);
	});
});

// get room configuration
app.get('/api/conf/:roomId', (req, res) => {
	Conf.findOne({ roomId: req.params.roomId }, (err, conf) => {
		res.status(200).send(conf || {});
	});
});

// get all the rooms
app.get('/api/rooms', (req, res) => {
	Conf.find({}, null, { sort: { roomId: 1 } }, (err, rooms) => {
		// TODO: handle error 500
		res.status(200).send(rooms);
	});
});

// delete the room and its related clues
app.delete('/api/room/:roomId', (req, res) => {
	Clue.find({ roomId: req.params.roomId }, (err, clues) => {
		async.each(
			clues,
			(clue, cb) => {
				if (clue.type !== 'text') {
					fs.remove(path.join(uploads, clue.fileName), err => {
						// TODO: handle error
						cb();
					});
				} else cb();
			},
			err => {
				Clue.remove({ roomId: req.params.roomId }, err => {
					// TODO: handle error
					Conf.remove({ roomId: req.params.roomId }, err => {
						// TODO: handle error 500
						res.status(200).send();
					});
				});
			}
		);
	});
});

// get clues for a given room
app.get('/api/room/:roomId', (req, res) => {
	Clue.find({ roomId: req.params.roomId }, (err, clues) => {
		// TODO: handle error 500
		res.status(200).send(clues);
	});
});

// delete the given clue
app.delete('/api/clue/:clueId', (req, res) => {
	Clue.findOne({ _id: req.params.clueId }, (err, clue) => {
		Clue.remove({ _id: req.params.clueId }, (err, result) => {
			if (clue.fileName) {
				fs.remove(path.join(uploads, clue.fileName), err => {
					// TODO: handle error 500
					res.status(200).send();
				});
			} else res.status(200).send();
		});
	});
});

// get stats
app.get('/api/stats/:start/:end', (req, res) => {
	const start = req.params.start.split('-');
	const startDate = new Date();
	startDate.setDate(start[0]);
	startDate.setMonth(start[1] - 1);
	startDate.setFullYear(start[2]);
	startDate.setHours(0, 0, 0, 0);
	const end = req.params.end.split('-');
	const endDate = new Date();
	endDate.setDate(end[0]);
	endDate.setMonth(end[1] - 1);
	endDate.setFullYear(end[2]);
	endDate.setHours(23, 59, 59, 999);
	Stat.find({ startTime: { $gte: startDate, $lte: endDate } }, (err, stats) => {
		processStats(stats, csv => {
			res.attachment(`stats_${req.params.start}_${req.params.end}.csv`);
			res.status(200).send(csv);
		});
	});
});

// ---------------------
// mongoose configuration
// ---------------------
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/lit-indices');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
	const server = app.listen(port, () => {
		console.log('Listening on port %d', server.address().port);
	});
	// ---------------------
	// socket.io configuration
	// ---------------------
	const io = socketIO(server);
	io.on('connection', socket => {
		let currentStat = {
			events: [],
		};
		let currentTime;
		socket.on('admin', roomId => {
			console.log(`An admin is joining admin-${roomId}`);
			socket.join(`admin-${roomId}`);
		});
		socket.on('display', roomId => {
			console.log(`A display is joining ${roomId}`);
			socket.join(roomId);
		});
		socket.on('leave', roomId => {
			console.log(`A display is leaving ${roomId}`);
			socket.leave(roomId);
		});
		socket.on('send intro', data => {
			console.log(`Game started: ${data.roomId} by ${data.name}`);
			currentStat.startTime = new Date();
			currentStat.gameMaster = data.name;
			currentStat.roomId = data.roomId;
			socket.broadcast.to(data.roomId).emit('intro');
		});
		socket.on('send clue', clue => {
			console.log(`Clue sent: ${clue} at ${currentTime}`);
			if (clue.type) {
				currentStat.events.push({
					type: 'indice',
					time: currentTime,
					media: clue.type,
					description: clue.description,
				});
			}
			socket.broadcast.to(clue.roomId).emit('clue', clue);
		});
		socket.on('send atmosphere', atmosphere => {
			console.log(`Atmosphere sent: ${atmosphere} at ${currentTime}`);
			currentStat.events.push({
				type: 'atmosphere',
				time: currentTime,
				media: atmosphere.type,
				description: atmosphere.description,
			});
			socket.broadcast.to(atmosphere.roomId).emit('atmosphere', atmosphere);
		});
		socket.on('send clock', data => {
			currentTime = data.time;
			socket.broadcast.to(data.roomId).emit('clock', data);
		});
		socket.on('send end', data => {
			console.log(`Game ended at ${currentTime}, gameover: ${data.gameover}`);
			socket.broadcast.to(data.roomId).emit('end', data.gameover);
			currentStat.endTime = currentTime;
			currentStat.gameover = data.gameover;
			const stat = new Stat(currentStat);
			stat.save((err, saved) => {
				currentStat = {};
				currentStat.events = [];
			});
		});
		socket.on('send volume', data => {
			socket.broadcast.to(data.roomId).emit('volume', data.volume);
		});
		socket.on('intro end', roomId => {
			socket.broadcast.to(`admin-${roomId}`).emit('start');
		});
	});
});
