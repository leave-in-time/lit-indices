const moment = require('moment-timezone');

const toMS = time => {
	let m = Math.floor(time / 60);
	if (m < 10) m = `0${m}`;
	let s = time - m * 60;
	if (s < 10) s = `0${s}`;
	return `${m}:${s}`;
};

const processStat = stat => {
	const count = stat.events.filter(e => e.type === 'indice').length;
	const start = moment(stat.startTime).tz('Europe/Paris').format('DD/MM/YYYY HH:mm:ss');
	let lines = '';
	if (stat.events.length === 0) {
		const currentLine = [];
		currentLine.push(stat.gameMaster);
		currentLine.push(stat.roomId);
		currentLine.push(start);
		currentLine.push(toMS(stat.endTime));
		currentLine.push(stat.gameover);
		currentLine.push(`${count}\n`);
		lines += currentLine.join(',');
	} else {
		stat.events.forEach(event => {
			const currentLine = [];
			currentLine.push(stat.gameMaster);
			currentLine.push(stat.roomId);
			currentLine.push(start);
			currentLine.push(toMS(stat.endTime));
			currentLine.push(stat.gameover);
			currentLine.push(count);
			currentLine.push(event.type);
			currentLine.push(toMS(event.time));
			currentLine.push(event.media);
			currentLine.push(`${event.description}\n`);
			lines += currentLine.join(',');
		});
	}
	lines += '\n';
	return lines;
};

const processStats = (stats, cb) => {
	let csv = `game master,salle,début,fin,game over,nombre d'indices,type,temps,média,description\n`;
	stats.forEach(stat => (csv += processStat(stat)));
	cb(csv);
};

module.exports = processStats;
