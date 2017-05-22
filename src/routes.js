import React from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Home from './components/Home';
import Room from './components/Room';
import Display from './components/Display';
import Start from './components/Start';

const browserHistory = createBrowserHistory();

const Routes = (props) => (
	<Router history={browserHistory}>
		<MuiThemeProvider>
			<div>
				<Route exact path="/" component={Home} />
                <Route exact path="/admin" component={Home} />
				<Route path="/admin/:roomId" component={Room} />
				<Route path="/user/:roomId" component={Room} />
				<Route path="/display/:roomId" component={Display} />
				<Route path="/start" component={Start} />
			</div>
		</MuiThemeProvider>
	</Router>
);

export default Routes;
