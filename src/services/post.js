import { store } from '../store';
import { addClue } from '../actions/clues';

const url = 'http://localhost:3030/api/upload/clue';

const post = (data, cb) => {
	const fd = new FormData();
	for (let key in data) {
		if (data.hasOwnProperty(key)) fd.append(key, data[key]);
	}
	fetch(url, { method: 'POST', body: fd }).then((res) => {
		res.json().then((json) => {
			if (res.status === 200) {
				store.dispatch(addClue(json));
				cb('Indice ajouté!')
			}
			else cb('Problème lors de l\'ajout, veuillez réessayer.');
		});
	});
};

export default post;
