import React from 'react';
import redirectOnUnauth from '../checkAuth';

class SearchListApp extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			searchText: ""
		};

		this._retrieveFromUrl = this._retrieveFromUrl.bind(this);
	}

	_retrieveFromUrl() {
		const urlParams = new URLSearchParams(window.location.search);
		const search_string = urlParams.get('query');
		if (search_string != null && search_string != '') {
			this.setState({ searchText: search_string });
		}
	}

	componentDidMount() {
		redirectOnUnauth();
		this._retrieveFromUrl();
	}

	render() {
		return (
			<div>You did a search for: {this.state.searchText}</div>
		);
	}
};

export default SearchListApp;