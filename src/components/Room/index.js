import React, { Component } from 'react';
import io from 'socket.io-client';
import { connect } from 'react-redux';
import AppBar from 'material-ui/AppBar';

import Title from '../Title';
import ClueList from '../ClueList';
import FreeText from '../FreeText';
import Add from '../Add';
import Timer from '../Timer';
import Conf from '../Conf';

import get from '../../services/get';

import './style.css';

class Room extends Component {
	constructor(props) {
		super(props);
		this.socket = io('http://localhost:3030');
	}

	componentDidMount() {
		get(this.props.match.params.roomId);
	}

	handleTimerClock = (time) => {
		this.socket.emit('send clock', {
			roomId: this.props.match.params.roomId,
			time
		});
	}

	handleTimerEnd = () => {
		console.log('end!!');
	}

	render() {
		return (
			<div>
				<AppBar
					title={this.props.match.params.roomId}
					onLeftIconButtonTouchTap={this.handleToggle}
					iconElementLeft={<Conf roomId={this.props.match.params.roomId} />}
				>
					<Timer
						clockCallback={this.handleTimerClock}
						endCallback={this.handleTimerEnd}
					/>
				</AppBar>
				<div className="container medias">
					<div className="content">
						<Title title="Images" />
						<Add accept="image" roomId={this.props.match.params.roomId} />
						<ClueList
							socket={this.socket}
							clues={this.props.clues.filter((e) => e.type === 'image') || []}
						/>
					</div>
					<div className="content">
						<Title title="Vidéos" />
						<Add accept="video" roomId={this.props.match.params.roomId} />
						<ClueList
							socket={this.socket}
							clues={this.props.clues.filter((e) => e.type === 'video') || []}
						/>
					</div>
					<div className="content">
						<Title title="Sons" />
						<Add accept="audio" roomId={this.props.match.params.roomId} />
						<ClueList
							socket={this.socket}
							clues={this.props.clues.filter((e) => e.type === 'audio') || []}
						/>
					</div>
					<div className="content">
						<Title title="Textes" />
						<Add roomId={this.props.match.params.roomId} />
						<ClueList
							socket={this.socket}
							clues={this.props.clues.filter((e) => e.type === 'text') || []}
						/>
					</div>
				</div>
				<FreeText />
			</div>
		);
	}
}

export default connect(state => state)(Room);
