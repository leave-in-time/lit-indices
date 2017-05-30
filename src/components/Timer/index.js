import React, { Component } from 'react';
import IconButton from 'material-ui/IconButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Start from 'material-ui/svg-icons/av/video-library';
import End from 'material-ui/svg-icons/av/stop';
import Play from 'material-ui/svg-icons/av/play-arrow';
import Pause from 'material-ui/svg-icons/av/pause';
import Reset from 'material-ui/svg-icons/av/replay';
import Edit from 'material-ui/svg-icons/image/edit';
import Mute from 'material-ui/svg-icons/av/volume-off';
import Unmute from 'material-ui/svg-icons/av/volume-up';

import './style.css';

class Timer extends Component {
	constructor(props) {
		super(props);
		// initial state
		this.state = {
			minutes: 60,
			seconds: 0,
			started: false,
			running: false,
			dialog: false,
			toBeSec: '',
			toBeMin: '',
			muted: true,
			nameDialog: false,
			name: '',
		};
		// keep the display clock in sync
		this.props.clockCallback({
			time: this.state.minutes * 60 + this.state.seconds,
			muted: this.state.muted,
		});
	}

	componentWillReceiveProps(nextProps) {
		// TODO: check this!!
		if (nextProps.timer) this.handlePlayPause();
	}

	handleStartStop = () => {
		if (this.state.started) {
			clearInterval(this.interval);
			this.setState({
				started: false,
				running: false,
				muted: true,
				nameDialog: false,
			});
			this.props.endCallback(false);
		} else {
			this.setState(
				{
					name: '',
					nameDialog: true,
					minutes: 60,
					seconds: 0,
					muted: true,
				},
				() => {
					this.props.clockCallback({
						time: this.state.minutes * 60 + this.state.seconds,
						muted: this.state.muted,
					});
					this.props.blackCallback();
				}
			);
		}
	};

	handlePlayPause = () => {
		if (this.state.running) {
			clearInterval(this.interval);
			this.setState({ running: false });
		} else {
			this.interval = setInterval(() => {
				const time = this.state.minutes * 60 + this.state.seconds - 1;
				if (time < 0) {
					this.props.endCallback(true);
					clearInterval(this.interval);
					this.setState({
						started: false,
						running: false,
					});
				} else {
					this.setState({
						minutes: Math.floor(time / 60),
						seconds: time % 60,
					});
					this.props.clockCallback({
						time,
						muted: this.state.muted,
					});
				}
			}, 1000);
			this.setState({ running: true });
		}
	};

	handleReset = () => {
		this.setState(
			{
				minutes: 60,
				seconds: 0,
			},
			() => {
				this.props.clockCallback({
					time: this.state.minutes * 60 + this.state.seconds,
					muted: this.state.muted,
				});
			}
		);
	};

	handleEdit = () => {
		this.setState({ dialog: true });
	};

	handleCloseTimerDialog = () => {
		this.setState({ dialog: false });
	};

	handleConfirmTimerDialog = () => {
		const { toBeMin, toBeSec } = this.state;
		this.setState(
			{
				minutes: toBeMin,
				seconds: toBeSec,
				dialog: false,
				toBeMin: '',
				toBeSec: '',
			},
			() => {
				this.props.clockCallback({
					time: this.state.minutes * 60 + this.state.seconds,
					muted: this.state.muted,
				});
			}
		);
	};

	handleMinutesChange = e => {
		if (parseInt(e.target.value, 10) < 0) this.setState({ toBeMin: 0 });
		else if (parseInt(e.target.value, 10) > 98) this.setState({ toBeMin: 98 });
		else this.setState({ toBeMin: parseInt(e.target.value, 10) });
	};

	handleSecondsChange = e => {
		if (parseInt(e.target.value, 10) < 0) this.setState({ toBeSec: 0 });
		else if (parseInt(e.target.value, 10) > 59) this.setState({ toBeSec: 59 });
		else this.setState({ toBeSec: parseInt(e.target.value, 10) });
	};

	handleMute = () => {
		this.setState({ muted: !this.state.muted });
	};

	handleName = e => {
		this.setState({ name: e.target.value });
	};

	handleCloseNameDialog = () => {
		this.setState({ nameDialog: false });
	};

	handleConfirmNameDialog = () => {
		// TODO: handle stats
		this.setState(
			{
				started: true,
				nameDialog: false,
			},
			() => {
				this.props.introCallback(this.state.name);
			}
		);
	};

	render() {
		const timerActions = [
			<FlatButton label="Annuler" secondary onTouchTap={this.handleCloseTimerDialog} />,
			<FlatButton
				label="Ok"
				primary
				disabled={this.state.toBeMin === '' || this.state.toBeSec === ''}
				onTouchTap={this.handleConfirmTimerDialog}
			/>,
		];
		const nameActions = [
			<FlatButton label="Annuler" secondary onTouchTap={this.handleCloseNameDialog} />,
			<FlatButton
				label="Ok"
				primary
				disabled={this.state.name === ''}
				onTouchTap={this.handleConfirmNameDialog}
			/>,
		];
		return (
			<div className="timer">
				<IconButton
					tooltip={this.state.started ? 'Terminer la partie' : 'Démarrer la partie'}
					onTouchTap={this.handleStartStop}
				>
					{this.state.started ? <End /> : <Start />}
				</IconButton>
				<IconButton
					tooltip={this.state.running ? 'Pause' : 'Play'}
					onTouchTap={this.handlePlayPause}
					disabled={!this.state.started}
				>
					{this.state.running ? <Pause /> : <Play />}
				</IconButton>
				<IconButton tooltip="Reset" onTouchTap={this.handleReset}>
					<Reset />
				</IconButton>
				<IconButton tooltip="Édition manuelle" onTouchTap={this.handleEdit}>
					<Edit />
				</IconButton>
				<span>
					{this.state.minutes < 10 ? `0${this.state.minutes}` : this.state.minutes}
				</span>
				<span>:</span>
				<span>
					{this.state.seconds < 10 ? `0${this.state.seconds}` : this.state.seconds}
				</span>
				<IconButton
					tooltip={
						this.state.muted
							? "Allumer le tick d'horloge"
							: "Éteindre le tick d'horloge"
					}
					tooltipPosition="bottom-left"
					onTouchTap={this.handleMute}
				>
					{this.state.muted ? <Unmute /> : <Mute />}
				</IconButton>
				<Dialog
					title="Editer le timer"
					actions={timerActions}
					modal={false}
					open={this.state.dialog}
					onRequestClose={this.handleCloseTimerDialog}
				>
					<TextField
						type="number"
						min="0"
						max="98"
						hintText="Minutes"
						value={this.state.toBeMin}
						onChange={this.handleMinutesChange}
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
				<Dialog
					title="Saisir votre nom"
					actions={nameActions}
					modal
					open={this.state.nameDialog}
				>
					<TextField
						hintText="Votre nom"
						value={this.state.name}
						onChange={this.handleName}
					/>
				</Dialog>
			</div>
		);
	}
}

export default Timer;
