import React, { Component } from 'react';
import ContentClear from 'material-ui/svg-icons/content/clear';
import ContentSend from 'material-ui/svg-icons/content/send';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import Title from '../Title';

import './style.css';

class FreeText extends Component {
	constructor(props) {
		super(props);
		this.state = { value: '' };
	}

	handleChange = (event) => this.setState({ value: event.target.value });
	handleClear = () => this.setState({ value: '' });
	handleSend = () => {
		if (this.state.value.length) console.log(this.state.value);
		this.setState({ value: '' });
	}

	render() {
		return (
			<div className="ft-container">
				<Title title="Texte libre" />
				<TextField
					hintText="Veuillez saisir votre texte"
					className="ft-input"
					value={this.state.value}
					onChange={this.handleChange}
				/>
				<RaisedButton
					icon={<ContentClear color="#ffffff" />}
					secondary
					className="ft-button"
					onTouchTap={this.handleClear}
					disabled={this.state.value.length <= 0}
				/>
				<RaisedButton
					icon={<ContentSend color="#ffffff" />}
					backgroundColor="#a4c639"
					className="ft-button"
					onTouchTap={this.handleSend}
					disabled={this.state.value.length <= 0}
				/>
			</div>
		);
	}
}

export default FreeText;
