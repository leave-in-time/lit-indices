import React, { Component } from 'react';
import IconButton from 'material-ui/IconButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Slider from 'material-ui/Slider';
import Play from 'material-ui/svg-icons/av/play-arrow';
import Replay from 'material-ui/svg-icons/av/replay';
import Pause from 'material-ui/svg-icons/av/pause';
import Edit from 'material-ui/svg-icons/image/edit';

import './style.css';

class Timer extends Component {
	constructor(props) {
		super(props);
		// initial state
		this.state = {
			minutes: 0,
			seconds: 10,
			running: false,
			dialog: false,
			toBeSec: '',
			toBeMin: '',
			volume: 100
		};
	}

	handlePlayPause = () => {
		if (this.state.running) {
			clearInterval(this.interval);
			this.setState({ running: false });
		}
		else {
			this.interval = setInterval(() => {
				const time = this.state.minutes * 60 + this.state.seconds - 1;
				if (time < 0) {
					this.props.endCallback();
					clearInterval(this.interval);
					this.setState({ running: false });
				}
				else {
					this.setState({
						minutes: Math.floor(time / 60),
						seconds: time % 60
					});
					this.props.clockCallback(time);
				}
			}, 1000);
			this.setState({ running: true });
		}
	}

	handleReset = () => {
		clearInterval(this.interval);
		this.setState({
			minutes: 60,
			seconds: 0,
			running: false
		});
	}

	handleEdit = () => {
		this.setState({ dialog: true });
	}

	handleCloseDialog = () => {
		this.setState({ dialog: false });
	}

	handleConfirmDialog = () => {
		const { toBeMin, toBeSec } = this.state;
		this.setState({
			minutes: toBeMin,
			seconds: toBeSec,
			dialog: false,
			toBeMin: '',
			toBeSec: ''
		});
		console.log(this.state);
	}

	handleMinutesChange = (e) => {
		if (e.target.value < 0) this.setState({ toBeMin: 0 });
		else if (e.target.value > 240) this.setState({ toBeMin: 240 });
		else this.setState({ toBeMin: parseInt(e.target.value, 10) });
	}

	handleSecondsChange = (e) => {
		if (e.target.value < 0) this.setState({ toBeSec: 0 });
		else if (e.target.value > 59) this.setState({ toBeSec: 59 });
		else this.setState({ toBeSec: parseInt(e.target.value, 10) });
	}

	handleChangeVolume = (e, v) => {
		this.setState({ volume: v });
	}

	handleSendVolume = () => {
		console.log(this.state.volume);
	}

	render() {
		const actions = [
			<FlatButton
				label="Annuler"
				secondary
				onTouchTap={this.handleCloseDialog}
			/>,
			<FlatButton
				label="Ok"
				primary
				disabled={this.state.toBeMin === '' || this.state.toBeSec === ''}
				onTouchTap={this.handleConfirmDialog}
			/>,
		];
		return (
			<div className="timer">
				<IconButton
					tooltip={this.state.running ? 'Mettre en pause' : 'Démarrer'}
					onTouchTap={this.handlePlayPause}
				>
					{this.state.running ?
						<Pause /> :
						<Play />
					}
				</IconButton>
				<IconButton
					tooltip='Remise à zéro'
					onTouchTap={this.handleReset}
				>
					<Replay />
				</IconButton>
				<IconButton
					tooltip='Edition manuelle'
					onTouchTap={this.handleEdit}
				>
					<Edit />
				</IconButton>
				<span>{this.state.minutes < 10 ? `0${this.state.minutes}` : this.state.minutes}</span>
				<span>:</span>
				<span>{this.state.seconds < 10 ? `0${this.state.seconds}` : this.state.seconds}</span>
				<div className="slider-holder">
					<Slider
						min={0}
						max={100}
						step={1}
						value={this.state.volume}
						onChange={this.handleChangeVolume}
						onDragStop={this.handleSendVolume}
					/>
				</div>
				<Dialog
					title="Editer le timer"
					actions={actions}
					modal={false}
					open={this.state.dialog}
					onRequestClose={this.handleCloseDialog}
				>
					<TextField
						type="number"
						min="0"
						max="240"
						hintText="Minutes"
						value={this.state.toBeMin}
						onChange={this.handleMinutesChange}
						ref={(c) => {if (c) c.focus()}}
						className="timer-field"
					/>
					<span className="timer-separator">:</span>
					<TextField
						type="number"
						min="0"
						max="59"
						hintText="Secondes"
						value={this.state.toBeSec}
						onChange={this.handleSecondsChange}
						className="timer-field"
					/>
				</Dialog>
			</div>
		);
	}
}

export default Timer;
