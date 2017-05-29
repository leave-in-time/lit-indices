import C from '../constants';

export const loading = () => {
	return (dispatch, getState) => {
		dispatch({
			type: C.LOADING,
		});
	};
};

export const loaded = () => {
	return (dispatch, getState) => {
		dispatch({
			type: C.LOADED,
		});
	};
};
