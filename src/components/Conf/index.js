import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import TextField from 'material-ui/TextField';
import ActionSettings from 'material-ui/svg-icons/action/settings';
import FileFileUpload from 'material-ui/svg-icons/file/file-upload';

import postConf from '../../services/postConf';
import './style.css';

class Conf extends Component {
	constructor(props) {
		super(props);
		// initial state
		this.state = {
			dialog: false,
			snackbar: false,
			snackbarMessage: '',
			ip: '',
			fileName: '',
			file: null
		};
	}

	// handle file selection
	handleFileChange = (event) => {
		const fileName = event.target.value.slice(event.target.value.lastIndexOf('\\') + 1);
		this.setState({ fileName, file: event.target.files[0] });
	};

	// handle ip change
	handleIpChange = (event) => this.setState({ ip: event.target.value });

	// handle opening of the upload dialog
	handleClick = () => this.setState({ dialog: true });

	// cancel upload
	handleCancel = () => this.setState({
		dialog: false,
		snackbar: false,
		ip: '',
		fileName: '',
		file: null
	});

	// handle upload
	handleConfirm = () => {
		// contruct the clue
		const data = {
			ip: this.state.ip,
			roomId: this.props.roomId
		};
		if (this.state.file) data.newFile = this.state.file;
		// and post it to the server
		postConf(data, (message) => {
			this.setState({
				dialog: false,
				snackbar: true,
				snackbarMessage: message,
				ip: '',
				fileName: '',
				file: null
			});
		});
	};

	// close the snackbar
	handleSnackbarClose = () => {
		this.setState({ snackbar: false, snackbarMessage: '' });
	};

	render() {
		const actions = [
			<FlatButton
				label="Annuler"
				secondary
				onTouchTap={this.handleCancel}
			/>,
			<FlatButton
				label="Ok"
				primary
				disabled={this.state.ip.split('.').length - 1 !== 3}
				onTouchTap={this.handleConfirm}
			/>,
		];
		return (
			<div className="conf">
				<IconButton
					iconStyle={{ width: 24, height: 24 }}
					tooltip="configurer l'écran"
					tooltipPosition="bottom-right"
					onTouchTap={this.handleClick}
				>
					<ActionSettings />
				</IconButton>
				<Dialog
					title="Configurer la salle"
					actions={actions}
					modal={true}
					open={this.state.dialog}
				>
					<TextField
						hintText="Aucun fichier de sélectionné"
						value={this.state.fileName}
						disabled
					/>
					<RaisedButton
						icon={<FileFileUpload color="#ffffff" />}
						backgroundColor="#a4c639"
						className="c-input-file"
					>
						<input
							type="file"
							accept="video/*"
							onChange={this.handleFileChange}
						/>
					</RaisedButton>
					<TextField
						hintText="Veuillez saisir l'ip de l'écran"
						value={this.state.ip}
						onChange={this.handleIpChange}
						className="c-input-desc"
					/>
				</Dialog>
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

export default Conf;
