import { combineReducers } from 'redux';
import clues from './clues';
import conf from './conf';
import rooms from './rooms';

const rootReducer = combineReducers({
	clues,
	conf,
	rooms,
});

export default rootReducer;
