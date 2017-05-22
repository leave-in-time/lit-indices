import C from '../constants';
const url = `${C.SERVER_HOST}:${C.SERVER_PORT}/api/upload/conf`;

const postConf = (data, cb) => {
	const fd = new FormData();
	for (let key in data) {
		if (data.hasOwnProperty(key)) fd.append(key, data[key]);
	}
	fetch(url, { method: 'POST', body: fd }).then((res) => {
		res.json().then((json) => {
			if (res.status === 200) {
				cb('Configuration effectuée !')
			}
			else cb('Problème lors de la configuration, veuillez réessayer.');
		});
	});
};

export default postConf;
