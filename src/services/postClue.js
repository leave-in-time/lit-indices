import C from '../constants';
import { store } from '../store';
import { addClue } from '../actions/clues';

const url = `${C.SERVER_HOST}:${C.SERVER_PORT}/api/upload/clue`;

const post = (data, cb) => {
	const fd = new FormData();
	for (let key in data) {
		if (data.hasOwnProperty(key)) fd.append(key, data[key]);
	}
	fetch(url, { method: 'POST', body: fd }).then((res) => {
		res.json().then((json) => {
			if (res.status === 200) {
				store.dispatch(addClue(json));
				const message = data.atmosphere ? 'Ambiance ajoutée !' : 'Indice ajouté !';
				cb(message);
			}
			else cb('Problème lors de l\'ajout, veuillez réessayer.');
		});
	});
};

export default post;
