import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

class Confirm extends Component {
	constructor(props) {
		super(props);
		this.state = { open: false };
	}

	componentWillReceiveProps(nextProps) {
		this.setState({ open: nextProps.open });
	}

	render() {
		const actions = [
			<FlatButton
				label="Annuler"
				secondary
				onTouchTap={this.props.handleCancel}
			/>,
			<FlatButton
				label="Ok"
				primary
				onTouchTap={this.props.handleConfirm}
			/>,
		];

		return (
			<Dialog
				title="Confirmez la suppression"
				actions={actions}
				modal
				open={this.state.open}
			>
				Supprimer ce fichier ?
			</Dialog>
		);
	}
}

export default Confirm;
