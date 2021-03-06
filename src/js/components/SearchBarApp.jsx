import React from 'react';
import redirectOnUnauth from '../checkAuth';

const SearchBar = (props) => {
	return (
		<div>
			<form action={props.onSearch} method="GET">
				<label for={props.name} className="searchbar-label"></label>
				<input type="text" id={props.id} className="search-bar" name={props.name} value={props.value} onChange={props.onChange} placeholder="Search..." autoComplete="off"></input>
				<button type="submit" value={props.submitValue} className="search-button"><i class="fa fa-search"></i></button>
			</form>
		</div>
	);
};

const SearchBarDropdown = () => {};

class SearchBarApp extends React.Component {
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
					name="query"
					id="searchbar"
					onSearch="/search"
					value={this.state.searchText}
					onChange={this._handleChange}
					submitValue="" />
			</div>
		);
	}
};

export default SearchBarApp;