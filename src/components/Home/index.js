import React, { Component } from 'react';
import { connect } from 'react-redux';
import AppBar from 'material-ui/AppBar';
import { List, ListItem } from 'material-ui/List';
import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';
import HomeIcon from 'material-ui/svg-icons/action/home';
import ContentClear from 'material-ui/svg-icons/content/clear';

import Confirm from '../Confirm';
import getRooms from '../../services/getRooms';
import removeRoom from '../../services/removeRoom';

class Home extends Component {
	constructor(props) {
		super(props);
		// initial state
		this.state = {
			dialog: false,
			snackbar: false,
			snackbarMessage: '',
		};
		this.admin = this.props.match.url.startsWith('/JBJU2A');
	}
	componentDidMount() {
		getRooms();
	}

	handleGo = room => {
		let suffix = this.admin ? '/JBJU2A/' : '/user/';
		this.props.history.push(suffix + room.roomId);
	};

	// press for starting supression
	handleClear = room => {
		this.setState({
			dialog: true,
			clearId: room.roomId,
		});
	};

	// confirm suppression
	handleConfirm = () => {
		removeRoom(this.state.clearId, message => {
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

	handleSnackbarClose = () => {
		this.setState({ snackbar: false, snackbarMessage: '' });
	};

	render() {
		const items = this.props.rooms.map(room => {
			return (
				<ListItem
					key={room._id}
					primaryText={room.roomId}
					secondaryText={room.ip}
					onTouchTap={this.handleGo.bind(this, room)}
					rightIconButton={
						this.admin
							? <IconButton>
									<ContentClear onTouchTap={this.handleClear.bind(this, room)} />
								</IconButton>
							: null
					}
					style={{ color: room.color }}
				/>
			);
		});

		return (
			<div>
				<AppBar
					title="Leave in time"
					iconElementLeft={<IconButton><HomeIcon /></IconButton>}
				/>
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

export default connect(state => state)(Home);
