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

let folder = 'public';
let port = 3030;
if (process.env.NODE_ENV === 'production') {
	folder = 'build';
	port = 3000;
}
const public = path.join(__dirname, '..', '..', folder);
const uploads = path.join(public, 'uploads');

// ---------------------
// express configuration
// ---------------------
const app = express();
app.use(express.static(public));
app.use('/start', express.static(public));
app.use('/admin/*', express.static(public));
app.use('/user/*', express.static(public));
app.use('/display/*', express.static(public));
app.use(cors());

// upload a new clue
app.post('/api/upload/clue', (req, res) => {
	const form = new formidable.IncomingForm();
	form.keepExtensions = true;
	form.uploadDir = uploads;
	form.parse(req, (err, fields, files) => {
		if (err) res.status(500).send(err);
		else {
			const values = Object.assign(
				{},
				fields
			);
			if (fields.type !== 'text' && files.newFile) values.fileName = path.basename(files.newFile.path);
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
			const values = Object.assign(
				{},
				fields
			);
			if (files.newFile) values.clueSound = path.basename(files.newFile.path);
			Conf.remove({ roomId: values.roomId }, (err, result) => {
				// TODO: handle error 500
				const conf = new Conf(values);
				conf.save((err, saved) => {
					if (err) res.status(500).send(err);
					else res.status(200).json(saved);
				});
			})
		}
	});
});

// get room configuration for the given ip
app.get('/api/conf', (req, res) => {
	const ip = req.ip.startsWith('::ffff:') ? req.ip.split('::ffff:')[1] : req.ip;
	console.log(ip);
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
	Conf.find({}, null, { sort: { roomId: 1 }}, (err, rooms) => {
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
					fs.remove(path.join(uploads, clue.fileName), (err) => {
						// TODO: handle error
						cb();
					});
				}
				else cb();
			},
			(err) => {
				Clue.remove({ roomId: req.params.roomId }, (err) => {
					// TODO: handle error
					Conf.remove({ roomId: req.params.roomId }, (err) => {
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
				fs.remove(path.join(uploads, clue.fileName), (err) => {
					// TODO: handle error 500
					res.status(200).send();
				});
			}
			else res.status(200).send();
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
	io.on('connection', (socket) => {
		socket.on('admin', (roomId) => {
			console.log(`An admin is joining admin-${roomId}`);
			socket.join(`admin-${roomId}`);
		});
		socket.on('display', (roomId) => {
			console.log(`A display is joining ${roomId}`);
			socket.join(roomId);
		});
		socket.on('leave', (roomId) => {
			console.log(`A display is leaving ${roomId}`);
			socket.leave(roomId);
		});
		socket.on('send intro', (roomId) => {
			socket.broadcast.to(roomId).emit('intro');
		});
		socket.on('send clue', (clue) => {
			socket.broadcast.to(clue.roomId).emit('clue', clue);
		});
		socket.on('send atmosphere', (atmosphere) => {
			socket.broadcast.to(atmosphere.roomId).emit('atmosphere', atmosphere);
		});
		socket.on('send clock', (data) => {
			socket.broadcast.to(data.roomId).emit('clock', data);
		});
		socket.on('send end', (roomId) => {
			socket.broadcast.to(roomId).emit('end');
		});
		socket.on('send volume', (data) => {
			socket.broadcast.to(data.roomId).emit('volume', data.volume);
		});
		socket.on('intro end', (roomId) => {
			socket.broadcast.to(`admin-${roomId}`).emit('start');
		});
	});
});
