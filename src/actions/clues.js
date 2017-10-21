import C from '../constants';

export const getClues = clues => {
	return (dispatch, getState) => {
		dispatch({
			type: C.GET_CLUES,
			clues,
		});
	};
};

export const addClue = clue => {
	return (dispatch, getState) => {
		dispatch({
			type: C.ADD_CLUE,
			clue,
		});
	};
};

export const removeClue = clueId => {
	return (dispatch, getState) => {
		dispatch({
			type: C.REMOVE_CLUE,
			clueId,
		});
	};
};

export const reorderClues = (oldIndex, newIndex, clueType, atmosphere) => {
	return (dispatch, getState) => {
		dispatch({
			type: C.REORDER_CLUES,
			oldIndex,
			newIndex,
			clueType,
			atmosphere,
		});
	};
};
