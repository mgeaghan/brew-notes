import React from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link
} from 'react-router-dom';
import ListApp from './ListApp.jsx';
import EditApp from './EditApp.jsx';

const ReactApp = (props) => {
	return (
		<Router>
			<div>
				<nav>
					<ul>
						<li>
							<Link to="/">Home</Link>
						</li>
						<li>
							<Link to="/list">List</Link>
						</li>
						<li>
							<Link to="/edit">Edit</Link>
						</li>
					</ul>
				</nav>

				<Switch>
					<Route path="/list">
						<ListApp />
					</Route>
					<Route path="/edit">
						<EditApp />
					</Route>
					<Route path="/">
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
