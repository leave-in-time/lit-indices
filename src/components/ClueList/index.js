import React, { Component } from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import Avatar from 'material-ui/Avatar';
import { List, ListItem } from 'material-ui/List';
import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';
import ContentClear from 'material-ui/svg-icons/content/clear';
import Loop from 'material-ui/svg-icons/av/loop';

import C from '../../constants';
import Confirm from '../Confirm';
import removeClue from '../../services/removeClue';
import reorderClues from '../../services/reorderClues';
import './style.css';

const SortableItem = SortableElement(({ value, ctx }) => {
	return (
		<ListItem
			key={value._id}
			primaryText={value.description}
			leftAvatar={
				value.type === 'image' ? (
					<Avatar src={`${C.SERVER_HOST}:${C.SERVER_PORT}/uploads/${value.fileName}`} />
				) : null
			}
			leftIcon={value.atmosphere && value.loop ? <Loop /> : null}
			rightIconButton={
				ctx.props.admin ? (
					<IconButton>
						<ContentClear onTouchTap={ctx.handleClear.bind(ctx, value._id)} />
					</IconButton>
				) : null
			}
			onTouchTap={ctx.handleEmit.bind(ctx, value)}
		/>
	);
});

const SortableList = SortableContainer(({ items, ctx }) => {
	return (
		<List>
			{items.map((value, index) => (
				<SortableItem index={index} key={value._id} value={value} ctx={ctx} />
			))}
		</List>
	);
});

class ClueList extends Component {
	constructor(props) {
		super(props);
		// initial state
		this.state = {
			dialog: false,
			snackbar: false,
			snackbarMessage: '',
		};
	}

	handleEmit = clue => {
		const channel = this.props.atmosphere ? 'send atmosphere' : 'send clue';
		this.props.socket.emit(channel, clue);
	};

	// press for starting supression
	handleClear = id => {
		this.setState({
			dialog: true,
			clearId: id,
		});
	};

	// confirm suppression
	handleConfirm = () => {
		removeClue(this.state.clearId, this.props.roomId, message => {
			this.setState({
				dialog: false,
				snackbar: true,
				snackbarMessage: message,
			});
		});
	};

	// cancel suppression
	handleCancel = () => {
		this.setState({ dialog: false });
	};

	// close the snackbar
	handleSnackbarClose = () => {
		this.setState({ snackbar: false, snackbarMessage: '' });
	};

	// sort the clues
	onSortEnd = ({ oldIndex, newIndex }) => {
		reorderClues(
			oldIndex,
			newIndex,
			this.props.type,
			this.props.atmosphere || false,
			this.props.roomId,
			message => {
				this.setState({ snackbar: true, snackbarMessage: message });
			}
		);
	};

	render() {
		return (
			<div className="cl-container">
				<SortableList
					items={this.props.clues}
					ctx={this}
					pressDelay={200}
					onSortEnd={this.onSortEnd}
				/>
				<Confirm
					open={this.state.dialog}
					handleConfirm={this.handleConfirm}
					handleCancel={this.handleCancel}
				/>
				<Snackbar
					open={this.state.snackbar}
					message={this.state.snackbarMessage}
					autoHideDuration={3000}
					onRequestClose={this.handleSnackbarClose}
				/>
			</div>
		);
	}
}

export default ClueList;
