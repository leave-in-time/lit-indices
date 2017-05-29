import React from 'react';
import { connect } from 'react-redux';
import CircularProgress from 'material-ui/CircularProgress';

import './style.css';

const Loader = props => {
	if (props.loading) {
		return (
			<div className="loader">
				<CircularProgress size={80} thickness={5} />
			</div>
		);
	} else return null;
};

export default connect(state => state)(Loader);
