import React, { Component } from 'react';

import './style.css';

class Atmosphere extends Component {
	renderAtmosphere = () => {
		if (!this.props.atmosphere) return null;
		switch (this.props.atmosphere.type) {
			case 'video':
				return (
					<video
						src={`../uploads/${this.props.atmosphere.fileName}`}
						autoPlay
						className="atmosphere-video"
					/>
				);
			case 'audio':
				return (
					<audio
						src={`../uploads/${this.props.atmosphere.fileName}`}
						autoPlay
					/>
				);
			default:
				return null;
		}
	}

	render() {
		return (
			<div className="atmosphere-holder">
				{this.renderAtmosphere()}
			</div>
		);
	}
}

export default Atmosphere;
