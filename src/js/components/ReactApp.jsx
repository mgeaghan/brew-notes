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
import SearchBarApp from './SearchBarApp.jsx';
import SearchListApp from './SearchListApp.jsx';
import redirectOnUnauth from '../checkAuth';
import Home from './HomeApp.jsx';

const ReactApp = (props) => {
	return (
		<Router>
			<div>
				<NavBars />
				<nav id="nav-bar" className="nav-bar">
					<SearchBarApp />
					<Link to="/home">Home</Link>
					<Link to="/browse">Browse Brews</Link>
					<Link to="/mylist">My Brews</Link>
					<Link to="/new">New</Link>
					<a href="/logout">Logout</a>
				</nav>

				<div id="nav-padder"></div>

				<Switch>
					<Route path="/home">
						<Home />
					</Route>
					<Route path="/browse">
						<BrowseApp />
					</Route>
					<Route path="/mylist">
						<MyListApp />
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
					<Route path="/search">
						<SearchListApp />
					</Route>
				</Switch>
			</div>
		</Router>
	);
};

class NavBars extends React.Component {
	constructor(props) {
		super(props);
		this._handleNavExpand = this._handleNavExpand.bind(this);
		this._handleResetNavExpand = this._handleResetNavExpand.bind(this);
	}

	_handleNavExpand() {
		let x = document.getElementById("nav-bar");
		if (x.className === "nav-bar") {
			x.className += " responsive";
		} else {
			x.className = "nav-bar";
		}
	}

	_handleResetNavExpand() {
		let x = document.getElementById("nav-bar");
		x.className = "nav-bar";
	}

	render() {
		return (
			<a href="javascript:void(0);" className="nav-icon" onClick={this._handleNavExpand} onBlur={this._handleResetNavExpand}>
				<i className="fas fa-bars"></i>
			</a>
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

class BrowseApp extends React.Component {
	componentDidMount() {
		redirectOnUnauth();
	}

	render() {
		return <Redirect to='/list?user=any' />
	}
}

class MyListApp extends React.Component {
	componentDidMount() {
		redirectOnUnauth();
	}

	render() {
		return <Redirect to='/list' />
	}
}

export { ReactApp, NavBars };
