import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import TextField from 'material-ui/TextField';
import ContentAddCircle from 'material-ui/svg-icons/content/add-circle';
import FileFileUpload from 'material-ui/svg-icons/file/file-upload';

import post from '../../services/post';
import './style.css';

class Add extends Component {
	constructor(props) {
		super(props);
		// initial state
		this.state = {
			dialog: false,
			snackbar: false,
			snackbarMessage: '',
			description: '',
			fileName: '',
			file: null
		};
	}

	// handle file selection
	handleFileChange = (event) => {
		const fileName = event.target.value.slice(event.target.value.lastIndexOf('\\') + 1);
		this.setState({ fileName, file: event.target.files[0] });
	};

	// handle clue description
	handleDescriptionChange = (event) => this.setState({ description: event.target.value });

	// handle opening of the upload dialog
	handleClick = () => this.setState({ dialog: true });

	// cancel upload
	handleCancel = () => this.setState({
		dialog: false,
		snackbar: false,
		description: '',
		fileName: '',
		file: null
	});

	// handle upload
	handleConfirm = () => {
		// contruct the clue
		const data = {
			description: this.state.description,
			type: this.props.accept || 'text',
			roomId: this.props.roomId
		};
		if (this.state.file) data.newFile = this.state.file;
		// and post it to the server
		post(data, (message) => {
			this.setState({
				dialog: false,
				snackbar: true,
				snackbarMessage: message,
				description: '',
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
				disabled={
					this.state.description.length <= 0 ||
					(this.state.fileName.length <= 0 && this.props.accept)
				}
				onTouchTap={this.handleConfirm}
			/>,
		];
		return (
			<div className="add">
				<IconButton
					iconStyle={{ width: 24, height: 24, color: 'rgb(164, 198, 57)' }}
					tooltip="ajouter un indice"
					tooltipPosition="bottom-center"
					onTouchTap={this.handleClick}
				>
					<ContentAddCircle />
				</IconButton>
				<Dialog
					title="Ajouter un indice"
					actions={actions}
					modal={true}
					open={this.state.dialog}
				>
					{this.props.accept &&
						<div>
							<TextField
								hintText="Aucun fichier de sélectionné"
								value={this.state.fileName}
								disabled
							/>
							<RaisedButton
								icon={<FileFileUpload color="#ffffff" />}
								backgroundColor="#a4c639"
								className="a-input-file"
							>
								<input
									type="file"
									accept={`${this.props.accept}/*`}
									onChange={this.handleFileChange}
								/>
							</RaisedButton>
						</div>
					}
					<TextField
						hintText="Veuillez saisir votre texte"
						value={this.state.description}
						onChange={this.handleDescriptionChange}
						className="a-input-desc"
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

export default Add;
