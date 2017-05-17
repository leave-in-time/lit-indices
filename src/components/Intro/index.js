import React, { Component } from 'react';

import './style.css';

class Display extends Component {

	componentDidMount() {
		this.video.addEventListener('ended', () => {
			this.props.endCallback();
		});
		this.video.play();
	}

	render() {
		return (
			<video
				id="intro"
				src="../fx/intro.mp4"
				ref={(c) => this.video = c}
			/>
		);
	}
}

export default Display;
