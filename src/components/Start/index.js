import React, { Component } from 'react';
import { Redirect } from 'react-router';

import conf from '../../services/conf';

class Start extends Component {
	constructor(props) {
		super(props);
		this.state = { roomId: null };
		conf(conf => {
			this.setState({ roomId: conf.roomId });
		});
	}

	render() {
		return (
			<div>
				{this.state.roomId && <Redirect to={`/display/${this.state.roomId}`} />}
			</div>
		);
	}
}

export default Start;
