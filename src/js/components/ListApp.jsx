import React from 'react';
import { Link } from 'react-router-dom';
import redirectOnUnauth from '../checkAuth';
import { ListItem, BrewList, UserList, PageSelector } from './ListComponents.jsx';

class ListApp extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			user_to_retrieve: props.hasOwnProperty('user') ? props.user : null,
			num_to_retrieve: 10,
			num_ret: null,
			total_pages: null,
			page: 0,
			data: null,
		};

		this._handleRetrieve = this._handleRetrieve.bind(this);
		this._handlePageCount = this._handlePageCount.bind(this);
		this._handlePageChange = this._handlePageChange.bind(this);
		this._handlePageChangeSelector = this._handlePageChangeSelector.bind(this);
		this._getUserFromUrl = this._getUserFromUrl.bind(this);
		this._retrieveFromUrl = this._retrieveFromUrl.bind(this);
		this._countFromUrl = this._countFromUrl.bind(this);
	}

	_handleRetrieve(page = this.state.page, num = this.state.num_to_retrieve, user = this.state.user_to_retrieve) {
		let query_string = '?num=' + num + '&page=' + page;
		if (user !== null) query_string += '&user=' + user;
		let getList = fetch('/api/list/fetch' + query_string, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then(response => response.json())
			.then(data => {
				if (data.success) {
					this.setState(data);
				}
				console.log(data);
			});
	}

	_getUserFromUrl() {
		const urlParams = new URLSearchParams(window.location.search);
		const user_string = urlParams.get('user');
		if (user_string != null && user_string != '') {
			this.setState({ user_to_retrieve: user_string });
			return user_string;
		} else {
			return null;
		}
	}

	_retrieveFromUrl() {
		let user_string = this._getUserFromUrl();
		if (user_string != null && user_string != '') {
			this._handleRetrieve(this.state.page, this.state.num_to_retrieve, user_string);
		} else {
			this._handleRetrieve();
		}
	}

	_handlePageCount(user = this.state.user_to_retrieve) {
		let query_string = '';
		if (user !== null) query_string += '?user=' + user;
		let getCount = fetch('/api/list/count' + query_string, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then(response => response.json())
			.then(data => {
				if (data.success) {
					this.setState({ total_pages: Math.ceil(data.count / this.state.num_to_retrieve) });
				}
				console.log(data);
			});
	}

	_countFromUrl() {
		let user_string = this._getUserFromUrl();
		if (user_string != null && user_string != '') {
			this._handlePageCount(user_string);
		} else {
			this._handlePageCount();
		}
	}

	_handlePageChange(page) {
		return () => {
			this._handleRetrieve(page);
		};
	}

	_handlePageChangeSelector(event) {
		return this._handlePageChange(event.target.value - 1)();
	}

	componentDidMount() {
		redirectOnUnauth();
		// this._handleRetrieve();
		// this._handlePageCount();
		this._retrieveFromUrl();
		this._countFromUrl();
	}

	render() {
		console.log(this.state.data);
		return (
			<div>
				{!!this.state.data ? (<div>
					<PageSelector
						page={this.state.page}
						total_pages={this.state.total_pages}
						changePage={this._handlePageChange}
						changePageSelector={this._handlePageChangeSelector} />
					<BrewList data={this.state.data}/>
				</div>) : <div>
					Loading brew list...
				</div>}
			</div>
		);
	}
}

export default ListApp;
