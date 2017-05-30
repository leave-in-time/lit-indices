import React, { Component } from 'react';

import './style.css';

class Display extends Component {
	componentDidMount() {
		this.video.addEventListener('ended', () => this.props.endCallback(), { once: true });
		this.video.volume = this.props.volume;
		this.video.play();
	}

	componentDidUpdate() {
		if (this.video) this.video.volume = this.props.volume;
	}

	render() {
		return <video id="intro" src="../fx/intro.mp4" ref={c => (this.video = c)} />;
	}
}

export default Display;
