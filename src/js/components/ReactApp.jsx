import React from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link,
	Redirect
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
					<Link to="/new">New</Link>
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
					<Route path="/new">
						<NewApp />
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

class NewApp extends React.Component {
	componentDidMount() {
		redirectOnUnauth();
	}

	render() {
		return <Redirect to='/edit' />;
	}
}

export default ReactApp;
