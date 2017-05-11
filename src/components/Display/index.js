import React, { Component } from 'react';
import io from 'socket.io-client';

import conf from '../../services/conf';
import Clock from '../Clock';

import './style.css';

class Display extends Component {
	constructor(props) {
		super(props);
		this.state = { clue: null };
		this.socket = io('http://localhost:3030');
		this.socket.on('clue', (clue) => {
			this.setState({ clue });
		});
		this.socket.on('clock', (time) => {
			this.setState({ time });
		});
		conf((conf) => {
			console.log(conf);
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
		// const test = (this.state.clue) ? <video autoPlay src={`../uploads/${this.state.clue.fileName}`}/> : null;
		return (
			<div id="display">
				<Clock
					time={this.state.time}
					orange={900}
					red={120}
				/>
				<div className="clue-holder"></div>
			</div>
		);
	}
}

export default Display;
