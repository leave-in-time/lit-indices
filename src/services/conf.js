import C from '../constants';
const url = `${C.SERVER_HOST}:${C.SERVER_PORT}/api/conf/`;

const conf = cb => {
	fetch(url).then(res => {
		// TODO: handle error 500
		res.json().then(json => {
			cb(json);
		});
	});
};

export default conf;
