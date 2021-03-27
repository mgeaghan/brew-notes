import React from 'react';
import redirectOnUnauth from '../checkAuth';

class Home extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			user_name: null,
			user_id: null
		};

		this.getUser = this.getUser.bind(this);
	}

	componentDidMount() {
		redirectOnUnauth();
		this.getUser();
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

	render() {
		return (
			<div>
				<h1>Brew Notes</h1>
				<h2>Welcome{this.state.user_name !== null ? (" " + this.state.user_name) : ""}!</h2>
			</div>
		);
	}
};

export default Home;