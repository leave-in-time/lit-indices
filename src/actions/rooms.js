import C from '../constants';

export const getRooms = rooms => {
	return (dispatch, getState) => {
		dispatch({
			type: C.GET_ROOMS,
			rooms,
		});
	};
};

export const removeRoom = roomId => {
	return (dispatch, getState) => {
		dispatch({
			type: C.REMOVE_ROOM,
			roomId,
		});
	};
};
