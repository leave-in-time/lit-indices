import React, { Component } from 'react';
import io from 'socket.io-client';

import Clock from '../Clock';
import Clue from '../Clue';

import './style.css';

class Display extends Component {
	constructor(props) {
		super(props);
		this.state = { clue: null };
		this.socket = io('http://localhost:3030');
		this.socket.on('clue', (clue) => {
			this.setState({ clue });
			// TODO: clear the clue
		});
		this.socket.on('clock', (time) => {
			this.setState({ time });
		});
	}

	componentDidMount() {
		this.socket.emit('display', this.props.match.params.roomId);
	}

	componentWillReceiveProps(nextProps) {
		this.socket.emit('display', nextProps.match.params.roomId);
	}

	componentWillUnmount() {
		this.socket.emit('leave', this.props.match.params.roomId);
	}

	render() {
		return (
			<div id="display">
				<Clock
					time={this.state.time || 3600}
					orange={900}
					red={120}
				/>
				<Clue clue={this.state.clue} />
			</div>
		);
	}
}

export default Display;
