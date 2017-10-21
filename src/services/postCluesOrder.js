import C from '../constants';
import { store } from '../store';

const url = `${C.SERVER_HOST}:${C.SERVER_PORT}/api/cluesOrder`;

const postCluesOrder = (roomId, cb) => {
	const fd = new FormData();
	fd.append('roomId', roomId);
	fd.append('order', store.getState().clues.map(e => e._id));
	fetch(url, { method: 'POST', body: fd }).then(res => {
		res.json().then(json => {
			if (res.status === 200) {
				cb('Réorganisation effectuée !');
			} else cb('Problème lors de la réorganisation, veuillez réessayer.');
		});
	});
};

export default postCluesOrder;
