import React, { Component } from 'react';
import io from 'socket.io-client';
import { connect } from 'react-redux';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';

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
		this.admin = this.props.match.url.startsWith('/admin/');
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

	handleClearClue = () => {
		this.socket.emit('send clue', {
			roomId: this.props.match.params.roomId
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
					iconElementLeft={<Conf
						admin={this.admin}
						roomId={this.props.match.params.roomId}
					/>}
				>
					<div className="r-clear">
						<RaisedButton
							label="Enelver l'indice"
							secondary
							onTouchTap={this.handleClearClue}
						/>
					</div>
					<Timer
						clockCallback={this.handleTimerClock}
						endCallback={this.handleTimerEnd}
					/>
				</AppBar>
				<div className="container medias">
					<div className="content">
						<Title title="Textes" />
						{this.admin && <Add roomId={this.props.match.params.roomId} />}
						<ClueList
							socket={this.socket}
							clues={this.props.clues.filter((e) => e.type === 'text') || []}
							admin={this.admin}
						/>
					</div>
					<div className="content">
						<Title title="Images" />
						{this.admin && <Add accept="image" roomId={this.props.match.params.roomId} />}
						<ClueList
							socket={this.socket}
							clues={this.props.clues.filter((e) => e.type === 'image') || []}
							admin={this.admin}
						/>
					</div>
					<div className="content">
						<Title title="Sons" />
						{this.admin && <Add accept="audio" roomId={this.props.match.params.roomId} />}
						<ClueList
							socket={this.socket}
							clues={this.props.clues.filter((e) => e.type === 'audio') || []}
							admin={this.admin}
						/>
					</div>
					<div className="content">
						<Title title="Vidéos" />
						{this.admin && <Add accept="video" roomId={this.props.match.params.roomId} />}
						<ClueList
							socket={this.socket}
							clues={this.props.clues.filter((e) => e.type === 'video') || []}
							admin={this.admin}
						/>
					</div>
				</div>
				<FreeText
					roomId={this.props.match.params.roomId}
					socket={this.socket}
				/>
			</div>
		);
	}
}

export default connect(state => state)(Room);
