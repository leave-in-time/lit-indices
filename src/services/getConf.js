import C from '../constants';
import { store } from '../store';
import { getConf } from '../actions/conf';

const url = `${C.SERVER_HOST}:${C.SERVER_PORT}/api/conf/`;

const get = (roomId) => {
	fetch(url + roomId).then((res) => {
		// TODO: handle error 500
		res.json().then((json) => {
			store.dispatch(getConf(json));
		});
	});
};

export default get;
