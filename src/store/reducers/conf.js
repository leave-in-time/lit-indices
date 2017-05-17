import C from '../../constants';

const initialState = {};

export default (state = initialState, action) => {
	switch (action.type) {
		case C.GET_CONF:
			return action.conf;
		default:
			return state;
	}
};
