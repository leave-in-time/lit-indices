import C from '../constants';

export const getConf = conf => {
	return (dispatch, getState) => {
		dispatch({
			type: C.GET_CONF,
			conf,
		});
	};
};
