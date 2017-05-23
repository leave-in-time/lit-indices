import C from '../../constants';

const initialState = [];

export default (state = initialState, action) => {
	switch (action.type) {
		case C.GET_CLUES:
			return action.clues;
		case C.ADD_CLUE:
			return state.concat([action.clue]);
		case C.REMOVE_CLUE:
			return state.filter(e => e._id !== action.clueId);
		default:
			return state;
	}
};
