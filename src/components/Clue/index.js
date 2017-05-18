import React, { Component } from 'react';

import './style.css';

class Clue extends Component {
	componentDidUpdate() {
		if (this.video) this.video.volume = this.props.volume;
		if (this.audio) this.audio.volume = this.props.volume;
	}

	renderClue = () => {
		if (!this.props.clue) return null;
		switch (this.props.clue.type) {
			case 'image':
				return (
					<img
						src={`../uploads/${this.props.clue.fileName}`}
						alt={this.props.clue.description}
						className="clue-image"
					/>
				);
			case 'video':
				return (
					<video
						src={`../uploads/${this.props.clue.fileName}`}
						autoPlay
						className="clue-video"
						ref={(c) => this.video = c}
					/>
				);
			case 'audio':
				return (
					<div className="clue-audio">
						<audio
							src={`../uploads/${this.props.clue.fileName}`}
							autoPlay
							ref={(c) => this.audio = c}
						/>
					</div>
				);
			case 'text':
				return (
					<p className="clue-text">{this.props.clue.description}</p>
				);
			default:
				return null;
		}
	}

	render() {
		return (
			<div className="clue-holder">
				{this.renderClue()}
			</div>
		);
	}
}

export default Clue;
