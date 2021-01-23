import React from 'react';

class LogoutApp extends React.Component {
	constructor(props) {
		super(props);

		this.state = { message: "You have been successfully logged out. Redirecting..." };
	}

	componentDidMount() {
		setTimeout(() => {
			window.location.href = "/";
		}, 3000);
	}

	render() {
		return <div>{ this.state.message }</div>
	}
}

export default LogoutApp;
