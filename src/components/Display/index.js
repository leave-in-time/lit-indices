import React, { Component } from 'react';
import { connect } from 'react-redux';
import io from 'socket.io-client';

import Clock from '../Clock';
import Clue from '../Clue';
import Atmosphere from '../Atmosphere';
import Intro from '../Intro';

import getConf from '../../services/getConf';

import './style.css';

class Display extends Component {
	constructor(props) {
		super(props);
		this.state = {
			intro: false,
			clue: null,
			atmosphere: null,
			muted: true,
			volume: 1.0
		 };
		this.socket = io('http://localhost:3030');
		this.socket.on('intro', () => {
			this.setState({ intro: true });
		});
		this.socket.on('clue', (clue) => {
			this.clueSound.pause();
			this.clueSound.currentTime = 0;
			clue.type && this.clueSound.play();
			this.setState({ clue, atmosphere: null });
		});
		this.socket.on('atmosphere', (atmosphere) => {
			this.clueSound.pause();
			this.clueSound.currentTime = 0;
			this.setState({ atmosphere, clue: {} });
		});
		this.socket.on('clock', ({ time, muted }) => {
			this.setState({ time, muted });
		});
		this.socket.on('end', () => {
			this.clueSound.pause();
			this.clueSound.currentTime = 0;
			this.clueSound.play();
		});
		this.socket.on('volume', (volume) => {
			this.setState({ volume });
		});
	}

	componentDidMount() {
		getConf(this.props.match.params.roomId);
		this.clueSound.volume = this.state.volume;
		this.socket.emit('display', this.props.match.params.roomId);
	}

	componentWillReceiveProps(nextProps) {
		this.socket.emit('display', nextProps.match.params.roomId);
	}

	componentWillUnmount() {
		this.socket.emit('leave', this.props.match.params.roomId);
	}

	componentDidUpdate() {
		this.clueSound.volume = this.state.volume;
	}

	endCallback = () => {
		this.setState({ intro: false }, () => {
			this.socket.emit('intro end', this.props.match.params.roomId);
		});
	}

	render() {
		return (
			<div id="display">
				<Clock
					time={this.state.time}
					orange={900}
					red={300}
					muted={this.state.muted}
				/>
				<Clue clue={this.state.clue} volume={this.state.volume} />
				{this.state.atmosphere && <Atmosphere atmosphere={this.state.atmosphere} volume={this.state.volume} />}
				{this.state.intro && <Intro endCallback={this.endCallback} volume={this.state.volume} />}
				<audio
					src={`../uploads/${this.props.conf.clueSound}` || '../fx/bell.mp3'}
					ref={(c) => this.clueSound = c}
				/>
			</div>
		);
	}
}

export default connect(state => state)(Display);
