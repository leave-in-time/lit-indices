import C from '../constants';
import { store } from '../store';
import { removeRoom } from '../actions/rooms';

const url = `${C.SERVER_HOST}:${C.SERVER_PORT}/api/room/`;

const remove = (roomId, cb) => {
	fetch(url + roomId, { method: 'DELETE' }).then((res) => {
		// TODO: handle error 500
		store.dispatch(removeRoom(roomId));
		cb('Salle supprimée !')
	});
};

export default remove;
