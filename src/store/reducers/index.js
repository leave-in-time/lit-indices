import { combineReducers } from 'redux';
import clues from './clues';
import conf from './conf';
import rooms from './rooms';
import loading from './loading';

const rootReducer = combineReducers({
	clues,
	conf,
	rooms,
	loading,
});

export default rootReducer;
