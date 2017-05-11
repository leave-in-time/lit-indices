import React, { Component } from 'react';

import './style.css';

class Clue extends Component {

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
					/>
				);
			case 'audio':
				return (
					<audio
						src={`../uploads/${this.props.clue.fileName}`}
						autoPlay
						className="clue-audio"
					/>
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
