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

const ReactApp = (props) => {
	return (
		<Router>
			<div>
				<nav>
					<Link to="/home">Home</Link>
					<Link to="/list">List</Link>
					<Link to="/edit">Edit</Link>
				</nav>

				<div id="nav-padder"></div>

				<Switch>
					<Route path="/list">
						<ListApp />
					</Route>
					<Route path="/edit">
						<EditApp />
					</Route>
					<Route path="/view">
						<ViewApp />
					</Route>
					<Route path="/home">
						<Home />
					</Route>
				</Switch>
			</div>
		</Router>
	);
};

const Home = (props) => {
	return (
		<div>
			Private home page.
		</div>
	);
};

export default ReactApp;
