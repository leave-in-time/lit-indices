import React, { Component } from 'react';
import Slider from 'material-ui/Slider';

import './style.css';

class Volume extends Component {
	constructor(props) {
		super(props);
		// initial state
		this.state = {
			volume: 100,
		};
	}

	handleChangeVolume = (e, v) => {
		this.setState({ volume: v });
	};

	handleSendVolume = () => {
		this.props.volumeCallback(this.state.volume / 100);
	};

	render() {
		return (
			<div className="volume-holder">
				<Slider
					min={0}
					max={100}
					step={1}
					value={this.state.volume}
					onChange={this.handleChangeVolume}
					onDragStop={this.handleSendVolume}
				/>
			</div>
		);
	}
}

export default Volume;
