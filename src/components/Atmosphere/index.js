import React, { Component } from 'react';

import './style.css';

class Atmosphere extends Component {
	componentDidUpdate() {
		if (this.video) this.video.volume = this.props.volume;
		if (this.audio) this.audio.volume = this.props.volume;
	}

	renderAtmosphere = () => {
		if (!this.props.atmosphere) return null;
		switch (this.props.atmosphere.type) {
			case 'video':
				return (
					<video
						src={`../uploads/${this.props.atmosphere.fileName}`}
						autoPlay
						className="atmosphere-video"
						ref={c => (this.video = c)}
					/>
				);
			case 'audio':
				return (
					<audio
						src={`../uploads/${this.props.atmosphere.fileName}`}
						autoPlay
						ref={c => (this.audio = c)}
					/>
				);
			default:
				return null;
		}
	};

	render() {
		return (
			<div className="atmosphere-holder">
				{this.renderAtmosphere()}
			</div>
		);
	}
}

export default Atmosphere;
