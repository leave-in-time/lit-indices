import React, { Component } from 'react';
import C from '../../constants';

import './style.css';

class Intro extends Component {
	componentDidMount() {
		this.video.addEventListener('ended', () => this.props.endCallback(), { once: true });
		this.video.volume = this.props.volume;
		this.video.play();
	}

	componentDidUpdate() {
		if (this.video) this.video.volume = this.props.volume;
	}

	render() {
		return (
			<video
				id="intro"
				src={`${C.SERVER_HOST}:${C.SERVER_PORT}/fx/intro.mp4`}
				ref={c => (this.video = c)}
			/>
		);
	}
}

export default Intro;
