import React from 'react';
import redirectOnUnauth from '../checkAuth';

const SearchBar = (props) => {
	return (
		<div>
			<form action={props.onSearch} method="GET">
				<label for={props.name} className="searchbar-label"></label>
				<input type="text" id={props.id} className="searchbar" name={props.name} value={props.value} onChange={props.onChange}></input>
				<input type="submit" value={props.submitValue}></input>
			</form>
		</div>
	);
};

const SearchList = () => {};

class SearchApp extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			searchText: ""
		};

		this._handleChange = this._handleChange.bind(this);
	}

	componentDidMount() {
		redirectOnUnauth();
	}

	_handleChange(e) {
		this.setState({
			searchText: e.target.value
		});
	};

	render() {
		return (
			<div className="search-app">
				<SearchBar
					name="searchbar"
					id="searchbar"
					value={this.state.searchText}
					onChange={this._handleChange}
					submitValue="Search" />
			</div>
		);
	}
};

export default SearchApp;