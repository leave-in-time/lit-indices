import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import DatePicker from 'material-ui/DatePicker';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import HomeIcon from 'material-ui/svg-icons/action/home';
import areIntlLocalesSupported from 'intl-locales-supported';

import C from '../../constants';
import './style.css';

let DateTimeFormat;
if (areIntlLocalesSupported(['fr'])) DateTimeFormat = global.Intl.DateTimeFormat;
else {
	const IntlPolyfill = require('intl');
	DateTimeFormat = IntlPolyfill.DateTimeFormat;
	require('intl/locale-data/jsonp/fr');
}

class Stats extends Component {
	constructor(props) {
		super(props);
		// initial state
		const current = new Date();
		this.state = {
			start: current,
			end: current,
		};
	}

	handleStartChange = (e, d) => this.setState({ start: d });
	handleEndChange = (e, d) => this.setState({ end: d });

	handleDownload = () => {
		const startString = `${this.state.start.getDate()}-${this.state.start.getMonth() + 1}-${this.state.start.getFullYear()}`;
		const endString = `${this.state.end.getDate()}-${this.state.end.getMonth() + 1}-${this.state.end.getFullYear()}`;
		const url = `${C.SERVER_HOST}:${C.SERVER_PORT}/api/stats/${startString}/${endString}`;
		window.open(url, '_blank');
	};

	render() {
		return (
			<div>
				<AppBar
					title="Leave in time"
					iconElementLeft={<IconButton><HomeIcon /></IconButton>}
				/>
				<div className="dates">
					<DatePicker
						DateTimeFormat={DateTimeFormat}
						floatingLabelText="Début"
						maxDate={this.state.start}
						value={this.state.start}
						onChange={this.handleStartChange}
						locale="fr"
					/>
					<DatePicker
						DateTimeFormat={DateTimeFormat}
						floatingLabelText="Fin"
						minDate={this.state.start}
						value={this.state.end}
						onChange={this.handleEndChange}
						locale="fr"
					/>
					<div id="download">
						<RaisedButton
							label="Télécharger les données"
							secondary
							onTouchTap={this.handleDownload}
						/>
					</div>
				</div>
			</div>
		);
	}
}

export default Stats;
