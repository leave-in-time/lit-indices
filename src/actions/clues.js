import C from '../constants';

export const getClues = (clues) => {
	return (dispatch, getState) => {
		dispatch({
			type: C.GET_CLUES,
			clues,
		});
	};
};

export const addClue = (clue) => {
	return (dispatch, getState) => {
		dispatch({
			type: C.ADD_CLUE,
			clue,
		});
	};
};

export const removeClue = (clueId) => {
	return (dispatch, getState) => {
		dispatch({
			type: C.REMOVE_CLUE,
			clueId
		});
	};
};
