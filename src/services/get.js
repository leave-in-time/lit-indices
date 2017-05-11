import { store } from '../store';
import { getClues } from '../actions/clues';

const url = 'http://localhost:3030/api/room/';

const get = (roomId) => {
	fetch(url + roomId).then((res) => {
		// TODO: handle error 500
		res.json().then((json) => {
			store.dispatch(getClues(json));
		});
	});
};

export default get;
