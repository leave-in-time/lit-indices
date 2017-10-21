import { arrayMove } from 'react-sortable-hoc';
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
		case C.REORDER_CLUES:
			const reorderedType = arrayMove(
				state.filter(e => e.type === action.clueType && e.atmosphere === action.atmosphere),
				action.oldIndex,
				action.newIndex
			);
			return state
				.filter(e => e.type !== action.clueType || e.atmosphere !== action.atmosphere)
				.concat(reorderedType);
		default:
			return state;
	}
};
