import C from '../constants';
import { store } from '../store';
import { getRooms } from '../actions/rooms';

const url = `${C.SERVER_HOST}:${C.SERVER_PORT}/api/rooms/`;

const get = () => {
	fetch(url).then((res) => {
		// TODO: handle error 500
		res.json().then((json) => {
			store.dispatch(getRooms(json));
		});
	});
};

export default get;
