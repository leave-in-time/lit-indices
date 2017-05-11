const url = 'http://localhost:3030/api/conf/';

const conf = (cb) => {
	fetch(url).then((res) => {
		// TODO: handle error 500
		res.json().then((json) => {
			cb(json);
		});
	});
};

export default conf;
