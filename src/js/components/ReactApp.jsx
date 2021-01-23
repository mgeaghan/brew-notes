import React from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link
} from 'react-router-dom';
import ListApp from './ListApp.jsx';
import EditApp from './EditApp.jsx';
import ViewApp from './ViewApp.jsx';
import redirectOnUnauth from '../checkAuth';

const ReactApp = (props) => {
	return (
		<Router>
			<div>
				<nav>
					<Link to="/home">Home</Link>
					<Link to="/list">List</Link>
					<Link to="/edit">Edit</Link>
					<a href="/logout">Logout</a>
				</nav>

				<div id="nav-padder"></div>

				<Switch>
					<Route path="/home">
						<Home />
					</Route>
					<Route path="/list">
						<ListApp />
					</Route>
					<Route path="/edit">
						<EditApp />
					</Route>
					<Route path="/view">
						<ViewApp />
					</Route>
				</Switch>
			</div>
		</Router>
	);
};

class Home extends React.Component {
	componentDidMount() {
		redirectOnUnauth();
	}

	render() {
		return (
			<div>
				Private home page.
			</div>
		);
	}
};

export default ReactApp;
