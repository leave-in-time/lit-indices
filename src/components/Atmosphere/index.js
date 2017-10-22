import React, { Component } from 'react';
import C from '../../constants';

import './style.css';

class Atmosphere extends Component {
	componentDidUpdate(prevProps) {
		if (prevProps.volume !== this.props.volume) this.atmosphere.volume = this.props.volume;
		if (prevProps.fade !== this.props.fade) this.fade();
	}

	renderAtmosphere = () => {
		if (!this.props.atmosphere) return null;
		switch (this.props.atmosphere.type) {
			case 'video':
				return (
					<video
						src={`${C.SERVER_HOST}:${C.SERVER_PORT}/uploads/${this.props.atmosphere
							.fileName}`}
						autoPlay
						loop={this.props.atmosphere.loop}
						className="atmosphere-video"
						ref={c => (this.atmosphere = c)}
					/>
				);
			case 'audio':
				return (
					<audio
						src={`${C.SERVER_HOST}:${C.SERVER_PORT}/uploads/${this.props.atmosphere
							.fileName}`}
						autoPlay
						loop={this.props.atmosphere.loop}
						ref={c => (this.atmosphere = c)}
					/>
				);
			default:
				return null;
		}
	};

	fade = () => {
		clearInterval(this.fading);
		switch (this.props.fade) {
			case 'down':
				console.log('down');
				this.fading = setInterval(() => {
					if (this.atmosphere && this.atmosphere.volume - 0.01 >= 0) {
						this.atmosphere.volume -= 0.01;
					} else {
						clearInterval(this.fading);
					}
				}, 15);
				break;
			case 'up':
				console.log('up');
				this.fading = setInterval(() => {
					if (this.atmosphere && this.atmosphere.volume + 0.1 <= this.props.volume) {
						this.atmosphere.volume += 0.01;
					} else {
						clearInterval(this.fading);
					}
				}, 30);
				break;
			default:
				break;
		}
	};

	render() {
		return <div className="atmosphere-holder">{this.renderAtmosphere()}</div>;
	}
}

export default Atmosphere;
