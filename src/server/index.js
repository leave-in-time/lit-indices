const express = require('express');
const formidable = require('formidable');
const cors = require('cors');
const path = require('path');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const fs = require('fs-extra');

const Clue = require('./clue');
const Conf = require('./conf');

const public = path.join(__dirname, '..', '..', 'public');
const uploads = path.join(public, 'uploads');

// ---------------------
// express configuration
// ---------------------
const app = express();
app.use(express.static(public));
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
			Conf.remove({ ip: values.ip }, (err, result) => {
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
	const server = app.listen(3030, () => {
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
		socket.on('intro end', (roomId) => {
			socket.broadcast.to(`admin-${roomId}`).emit('start');
		});
	});
});
