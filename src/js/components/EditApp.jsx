import React from 'react';

class EditApp extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			value: ""
		};

		this._handleChange = this._handleChange.bind(this);
	}

	_handleChange(e) {
		this.setState({ value: e.target.value });
	}

	render() {
		return (
			<div id="editor">
				<h1>Heading</h1>
				<textarea
					rows='30'
					cols='80'
					value={this.state.value}
					onChange={this._handleChange}>
				</textarea>
			</div>
		);
	}
}

export default EditApp;
