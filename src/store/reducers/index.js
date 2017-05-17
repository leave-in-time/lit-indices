import { combineReducers } from 'redux';
import clues from './clues';
import conf from './conf';

const rootReducer = combineReducers({
	clues,
	conf
});

export default rootReducer;
