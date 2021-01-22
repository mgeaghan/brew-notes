import React from 'react';
import { Link } from 'react-router-dom';

const ListItem = (props) => {
	return (
		<Link className="list-item" to={"/view?id=" + props.id}>
			<div className="list-item-inner">
				<h4>{props.name}</h4>
				<div className="list-text list-stlye">{props.style}</div>
				<div className="list-text list-description">{props.description}</div>
				<div className="list-text list-owner">Created by: {props.owner}</div>
				<div className="list-text list-date">{props.date_created}</div>
				<div className="list-text list-date">{props.date_modified}</div>
			</div>
		</Link>
	);
};

const BrewList = (props) => {
	return (
		<div className="brew-list">
			{props.data.map(x => {
				return ListItem({
					id: x._id,
					name: x.data.information.name,
					style: x.data.information.style,
					owner: x.data.user_id,
					date_created: "today",
					date_modified: "today"
				});
			})}
		</div>
	);
}

const PageSelector = (props) => {
	let current_page = props.page + 1;
	let first_page = 1;
	let last_page = props.total_pages;
	let page_list = [first_page];
	const span = 4;
	if (current_page > first_page) {
		let lowend = current_page - span;
		if (lowend < first_page + 3) {
			lowend = first_page + 1;
		} else {
			page_list.push(null);
		}
		for (let i = lowend; i <= current_page; i++) {
			page_list.push(i);
		}
	}
	if (current_page < last_page) {
		let highend = current_page + span;
		if (highend > last_page - 3) {
			highend = last_page - 1;
		}
		for (let i = current_page + 1; i <= highend; i++) {
			page_list.push(i);
		}
		if (page_list[page_list.length - 1] != (last_page - 1)) {
			page_list.push(null);
		}
		page_list.push(last_page);
	}

	return (
		<div className="page-selector">
			{ page_list.map(x => {
				if (!x) {
					return <span className="page-selector-element page-selector-separator">...</span>
				} else {
					if (x == current_page) {
						return <span className="page-selector-element page-selector-current page-selector-link-current">{x}</span>
					} else {
						return <span onClick={props.changePage(x-1)} className="page-selector-element page-selector-link page-selector-link-current">{x}</span>
					}
				}
			}) }
		</div>
	);
};

class ListApp extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			num_to_retrieve: 10,
			num_ret: null,
			total_pages: null,
			page: 0,
			data: null
		};

		this._handleRetrieve = this._handleRetrieve.bind(this);
		this._handlePageCount = this._handlePageCount.bind(this);
		this._handlePageChange = this._handlePageChange.bind(this);
	}

	_handleRetrieve(page = this.state.page, num = this.state.num_to_retrieve) {
		let getList = fetch('/api/list/fetch?num=' + num + '&page=' + page, {
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

	_handlePageCount() {
		let getCount = fetch('/api/list/count', {
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

	_handlePageChange(page) {
		return () => {
			this._handleRetrieve(page);
		};
	}

	componentDidMount() {
		this._handleRetrieve();
		this._handlePageCount();
	}

	render() {
		console.log(this.state.data);
		return (
			<div>
				{!!this.state.data ? (<div>
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
