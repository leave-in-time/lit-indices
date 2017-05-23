import C from '../constants';
import { store } from '../store';
import { removeClue } from '../actions/clues';

const url = `${C.SERVER_HOST}:${C.SERVER_PORT}/api/clue/`;

const remove = (clueId, cb) => {
	fetch(url + clueId, { method: 'DELETE' }).then(res => {
		// TODO: handle error 500
		store.dispatch(removeClue(clueId));
		cb('Indice supprimé !');
	});
};

export default remove;
