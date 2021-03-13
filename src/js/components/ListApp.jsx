import React from 'react';
import { Link } from 'react-router-dom';
import redirectOnUnauth from '../checkAuth';
import { ListItem, BrewList, UserList, PageSelector } from './ListComponents.jsx';

// const ListItem = (props) => {
// 	return (
// 		<Link className="list-item" to={"/view?id=" + props.id}>
// 			<div className="list-item-inner">
// 				<h4>{props.name}</h4>
// 				<table>
// 					<tr className="list-text list-description">
// 						<td className="list-text-label">Description:</td>
// 						<td className="list-text-text">{props.description}</td>
// 					</tr>
// 					<tr className="list-text list-style">
// 						<td className="list-text-label">Style:</td>
// 						<td className="list-text-text">{props.style}</td>
// 					</tr>
// 					<tr className="list-text list-owner">
// 						<td className="list-text-label">Created by:</td>
// 						<td className="list-text-text">{props.owner}</td>
// 					</tr>
// 					<tr className="list-text list-date">
// 						<td className="list-text-label">Created:</td>
// 						<td className="list-text-text">{props.date_created}</td>
// 					</tr>
// 					<tr className="list-text list-date">
// 						<td className="list-text-label">Last modified:</td>
// 						<td className="list-text-text">{props.date_modified}</td>
// 					</tr>
// 				</table>
// 				{/* <div className="list-text list-description">{props.description}</div>
// 				<div className="list-text list-stlye"><span className="list-text-label">Style: </span>{props.style}</div>
// 				<div className="list-text list-owner"><span className="list-text-label">Created by: </span>{props.owner}</div>
// 				<div className="list-text list-date"><span className="list-text-label">Created: </span>{props.date_created}</div>
// 				<div className="list-text list-date"><span className="list-text-label">Last Modified: </span>{props.date_modified}</div> */}
// 			</div>
// 		</Link>
// 	);
// };

// const BrewList = (props) => {
// 	return (
// 		<div className="brew-list">
// 			{props.data.map(x => {
// 				return ListItem({
// 					id: x._id,
// 					name: x.data.information.name,
// 					style: x.data.information.style,
// 					description: x.data.information.description,
// 					owner: x.data.user_name,  // originally x.data.user_id
// 					date_created: new Date(x.data.created).toString(),
// 					date_modified: new Date(x.data.modified).toString()
// 				});
// 			})}
// 		</div>
// 	);
// }

// const PageSelector = (props) => {
// 	let current_page = props.page + 1;
// 	let first_page = 1;
// 	let last_page = props.total_pages;
// 	let page_list = [first_page];
// 	const span = 4;
// 	if (current_page > first_page) {
// 		let lowend = current_page - span;
// 		if (lowend < first_page + 3) {
// 			lowend = first_page + 1;
// 		} else {
// 			page_list.push(null);
// 		}
// 		for (let i = lowend; i <= current_page; i++) {
// 			page_list.push(i);
// 		}
// 	}
// 	if (current_page < last_page) {
// 		let highend = current_page + span;
// 		if (highend > last_page - 3) {
// 			highend = last_page - 1;
// 		}
// 		for (let i = current_page + 1; i <= highend; i++) {
// 			page_list.push(i);
// 		}
// 		if (page_list[page_list.length - 1] != (last_page - 1)) {
// 			page_list.push(null);
// 		}
// 		page_list.push(last_page);
// 	}

// 	return (
// 		<div className="page-selector">
// 			{ page_list.map(x => {
// 				if (!x) {
// 					return <span className="page-selector-element page-selector-separator">...</span>
// 				} else {
// 					if (x == current_page) {
// 						return <span className="page-selector-element page-selector-current page-selector-link-current">{x}</span>
// 					} else {
// 						return <span onClick={props.changePage(x-1)} className="page-selector-element page-selector-link page-selector-link-current">{x}</span>
// 					}
// 				}
// 			}) }
// 		</div>
// 	);
// };

const TestUserSelector = (props) => {
	return (
		<div>
			{(props.hasOwnProperty('user') && props.user) ? <a href={'/list?user=' + props.user}>{'See ' + props.user + "'s brews."}</a> : ''}
		</div>
	);
};

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
			test_browse_mode: false
		};

		this._handleRetrieve = this._handleRetrieve.bind(this);
		this._handlePageCount = this._handlePageCount.bind(this);
		this._handlePageChange = this._handlePageChange.bind(this);
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
			this.setState({ user_to_retrieve: user_string, test_browse_mode: true });
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
					{this.state.test_browse_mode ?
						<div>
							<TestUserSelector user='bob' />
							<TestUserSelector user='alice' />
						</div> : ''}
					<PageSelector
						page={this.state.page}
						total_pages={this.state.total_pages}
						changePage={this._handlePageChange} />
					<BrewList data={this.state.data}/>
				</div>) : <div>
					Loading brew list...
				</div>}
			</div>
		);
	}
}

export default ListApp;
