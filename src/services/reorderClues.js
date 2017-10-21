import { store } from '../store';
import postCluesOrder from './postCluesOrder';
import { reorderClues } from '../actions/clues';

const reorder = (oldIndex, newIndex, clueType, atmosphere, roomId, cb) => {
	store.dispatch(reorderClues(oldIndex, newIndex, clueType, atmosphere));
	postCluesOrder(roomId, cb);
};

export default reorder;
