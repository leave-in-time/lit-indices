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
import getConf from '../../services/getConf';

import './style.css';

class Room extends Component {
	constructor(props) {
		super(props);
		this.state = {
			timer: false
		};
		this.admin = this.props.match.url.startsWith('/admin/');
		this.socket = io('http://localhost:3030');
		this.socket.on('start', () => {
			this.setState({ timer: true });
		});
		this.socket.emit('admin', this.props.match.params.roomId);
	}

	componentDidMount() {
		get(this.props.match.params.roomId);
		getConf(this.props.match.params.roomId);
	}

	handleIntroStart = () => {
		this.socket.emit('send intro', this.props.match.params.roomId);
	}

	handleTimerClock = (data) => {
		this.socket.emit('send clock', {
			roomId: this.props.match.params.roomId,
			...data
		});
	}

	handleTimerEnd = () => {
		this.socket.emit('send end', this.props.match.params.roomId);
	}

	handleClearClue = () => {
		this.socket.emit('send clue', {
			roomId: this.props.match.params.roomId
		});
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
					style={{ backgroundColor: (this.props.conf && this.props.conf.color) || 'rgb(0, 188, 212)' }}
					className="r-bar"
				>
					<div className="r-clear">
						<RaisedButton
							label="Enelver l'indice/ambiance"
							secondary
							onTouchTap={this.handleClearClue}
						/>
					</div>
					<Timer
						introCallback={this.handleIntroStart}
						clockCallback={this.handleTimerClock}
						endCallback={this.handleTimerEnd}
						timer={this.state.timer}
					/>
				</AppBar>
				<div className="container medias">
					<div className="content">
						<Title title="Ambiance sonore" />
						{this.admin && <Add atmosphere accept="audio" roomId={this.props.match.params.roomId} />}
						<ClueList
							socket={this.socket}
							clues={this.props.clues.filter((e) => e.type === 'audio' && e.atmosphere) || []}
							admin={this.admin}
							atmosphere
						/>
					</div>
					<div className="content">
						<Title title="Ambiance video" />
						{this.admin && <Add atmosphere accept="video" roomId={this.props.match.params.roomId} />}
						<ClueList
							socket={this.socket}
							clues={this.props.clues.filter((e) => e.type === 'video' && e.atmosphere) || []}
							admin={this.admin}
							atmosphere
						/>
					</div>
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
							clues={this.props.clues.filter((e) => e.type === 'audio'  && !e.atmosphere) || []}
							admin={this.admin}
						/>
					</div>
					<div className="content">
						<Title title="Vidéos" />
						{this.admin && <Add accept="video" roomId={this.props.match.params.roomId} />}
						<ClueList
							socket={this.socket}
							clues={this.props.clues.filter((e) => e.type === 'video'  && !e.atmosphere) || []}
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
