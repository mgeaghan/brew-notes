import React from 'react';
import { NavBars } from './ReactApp.jsx';

class RootApp extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			user_name: null,
			user_id: null
		};

		this.getUser = this.getUser.bind(this);
	}

	getUser() {
		let getData = fetch('/api/user', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then(response => response.json())
			.then(data => {
				this.setState(data);
			});
	}

	componentDidMount() {
		this.getUser();
	}

	render() {
		return (
			<div id="root-main">
				<NavBars />
				{
					this.state.user_name === null ? <nav id="nav-bar" className="nav-bar">
						<a href="/login">Login</a>
						<a href="/register">Register</a>
					</nav> : <nav id="nav-bar" className="nav-bar">
						<a href="/home">Home</a>
						<a href="/logout">Logout</a>
					</nav>
				}
				{/* <nav id="nav-bar" className="nav-bar">
					<a href="/home">Home</a>
					<a href="/logout">Logout</a>
				</nav> */}
				<div id="nav-padder"></div>
				<div id="root-heading">
					<h1>Brew Notes</h1>
				</div>
				<div id="root-prompt">
					<h2>Welcome!</h2>
					<p>
						This is a site dedicated to storing and sharing homebrew beer recipes.
					</p>
					<p>
						Get started by registering or signing in, then you can start adding your favourite recipes and find new ones to try out!
					</p>
					{
						this.state.user_name === null ? <div id="root-prompt-buttons">
							<a href='/login' id="button-signin" className="root-prompt-button">Sign In</a>
							<a href='/register' id="button-register" className="root-prompt-button">Register</a>
						</div> : <div id="root-prompt-buttons">
							<a href='/home' id="button-home" className="root-prompt-button">Home</a>
							<a href='/logout' id="button-logout" className="root-prompt-button">Logout</a>
						</div>
					}
				</div>
			</div>
		);
	}
};

export default RootApp;