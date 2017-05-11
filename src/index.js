import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { Provider } from 'react-redux';
import { store } from './store';

import Routes from './routes';
import './index.css';

injectTapEventPlugin();

const App = () => {
	return (
		<Provider store={store}>
			<Routes />
		</Provider>
	);
};

ReactDOM.render(
	App(),
	document.getElementById('root')
);
