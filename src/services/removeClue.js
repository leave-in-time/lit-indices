import C from '../constants';
import { store } from '../store';
import postCluesOrder from './postCluesOrder';
import { removeClue } from '../actions/clues';

const url = `${C.SERVER_HOST}:${C.SERVER_PORT}/api/clue/`;

const remove = (clueId, roomId, cb) => {
	fetch(url + clueId, { method: 'DELETE' }).then(res => {
		// TODO: handle error 500
		store.dispatch(removeClue(clueId));
		postCluesOrder(roomId, () => {
			cb('Indice supprimé !');
		});
	});
};

export default remove;
