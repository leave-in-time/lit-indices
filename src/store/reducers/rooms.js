import C from '../../constants';

const initialState = [];

export default (state = initialState, action) => {
	switch (action.type) {
		case C.GET_ROOMS:
			return action.rooms;
		case C.REMOVE_ROOM:
			return state.filter((e) => e.roomId !== action.roomId);
		default:
			return state;
	}
};
