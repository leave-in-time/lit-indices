import React, { Component } from 'react';
import Avatar from 'material-ui/Avatar';
import {
	List,
	ListItem
} from 'material-ui/List';
import Snackbar from 'material-ui/Snackbar';
import ContentClear from 'material-ui/svg-icons/content/clear';

import Confirm from '../Confirm';
import remove from '../../services/remove';
import './style.css';

class ClueList extends Component {
	constructor(props) {
		super(props);
		// initial state
		this.state = {
			dialog: false,
			snackbar: false,
			snackbarMessage: ''
		};
	}

	handleEmit = (clue) => {
		this.props.socket.emit('send clue', clue);
	}

	// press for starting supression
	handleClear = (id) => {
		this.setState({
			dialog: true,
			clearId: id
		});
	}

	// confirm suppression
	handleConfirm = () => {
		remove(this.state.clearId, (message) => {
			this.setState({
				dialog: false,
				snackbar: true,
				snackbarMessage: message,
			});
		});

	}

	// cancel suppression
	handleCancel = () => {
		this.setState({ dialog: false });
	}

	// close the snackbar
	handleSnackbarClose = () => {
		this.setState({ snackbar: false, snackbarMessage: '' });
	};

	render() {
		const items = this.props.clues.map((clue) => {
			return (
				<ListItem
					key={clue._id}
					primaryText={clue.description}
					leftAvatar={clue.type === 'image' ? (
						<Avatar src={`http://localhost:3030/uploads/${clue.fileName}`} />
					) : (
						null
					)}
					rightIcon={this.props.admin ?
						<ContentClear onTouchTap={this.handleClear.bind(this, clue._id)} /> :
						null
					}
					onTouchTap={this.handleEmit.bind(this, clue)}
				/>
			);
		});
		return (
			<div className="cl-container">
				<List>
					{items}
				</List>
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
