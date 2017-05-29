import C from '../../constants';

const initialState = false;

export default (state = initialState, action) => {
	switch (action.type) {
		case C.LOADING:
			return true;
		case C.LOADED:
			return false;
		default:
			return state;
	}
};
