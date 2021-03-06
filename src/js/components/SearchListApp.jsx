import React from 'react';
import redirectOnUnauth from '../checkAuth';

class SearchListApp extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			searchText: "",
			searchField: "",
			searchType: "top_users_brews",
			searchResultsUsers: null,
			searchResultsBrews: null
		};

		this._handleRetrieve = this._handleRetrieve.bind(this);
		this._retrieveFromUrl = this._retrieveFromUrl.bind(this);
	}

	_handleRetrieve(query='', type='top_users_brews', field='any') {
		const validTypes = ['top_users_brews', 'users', 'brews'];
		const validFields = {
			users: ['username'],
			brews: ['any', 'name', 'style', 'description']
		}
		if (type === "top_users_brews") {
			fetch('/api/search/username?query=' + query, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			})
				.then(response => response.json())
				.then(data => {
					if (data.success) {
						this.setState({ searchResultsUsers: data });
					}
				});
			fetch('/api/search/any?query=' + query, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			})
				.then(response => response.json())
				.then(data => {
					if (data.success) {
						this.setState({ searchResultsBrews: data });
					}
				});
		} else if (validTypes.includes(type) && validFields[type].includes(field)) {
			fetch('/api/search/' + field + '?query=' + query, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			})
				.then(response => response.json())
				.then(data => {
					if (data.success) {
						if (type === 'users') {
							this.setState({ searchResultsUsers: data });
						} else if (type === 'brews') {
							this.setState({ searchResultsBrews: data });
						}
					}
				});
		}
	}

	_retrieveFromUrl() {
		const urlParams = new URLSearchParams(window.location.search);
		const search_string = urlParams.get('query');
		if (search_string != null && search_string != '') {
			this.setState({ searchText: search_string });
			const validFields = ['username', 'any', 'name', 'style', 'description'];
			const field_string = urlParams.get('field');
			if (field_string != null && validFields.includes(field_string)) {
				this.setState({ searchField: field_string });
				// do specific search
				if (field_string === 'username') {
					this.setState({ searchType: 'users' });
					this._handleRetrieve(search_string, 'users', field_string);
				} else {
					this.setState({ searchType: 'brews' });
					this._handleRetrieve(search_string, 'brews', field_string);
				}
			} else {
				this.setState({ searchType: "top_users_brews" });
				// do default search: top users and top brews (using field 'any')
				this._handleRetrieve(search_string, 'top_users_brews');
			}
		}
	}

	componentDidMount() {
		redirectOnUnauth();
		this._retrieveFromUrl();
	}

	render() {
		return (
			<div>
				<div>You searched for: {this.state.searchText}</div>
				{this.state.searchResultsUsers != null || this.state.searchResultsBrews != null ? <div>
					<div>Your search results:</div>
					{this.state.searchType === 'top_users_brews' ? <div>
						<div>Top users:</div>
						<div>{JSON.stringify(this.state.searchResultsUsers)}</div>
						<div>Top brews:</div>
						<div>{JSON.stringify(this.state.searchResultsBrews)}</div>
					</div> : this.state.searchType === 'users' ? <div>
						<div>Top users:</div>
						<div>{JSON.stringify(this.state.searchResultsUsers)}</div>
					</div> : this.state.searchType === 'brews' ? <div>
						<div>Top brews:</div>
						<div>{JSON.stringify(this.state.searchResultsBrews)}</div>
					</div> : ""}
				</div> : <div>Nothing to display!</div>}
			</div>
		);
	}
};

export default SearchListApp;