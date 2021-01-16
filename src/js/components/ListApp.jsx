import React from 'react';

const ListItem = (props) => {
	return (
		<a className="list-item" href={"/edit?id=" + props.id}>
			<div className="list-item-inner">
				<h4>{props.name}</h4>
				<div className="list-text list-stlye">{props.style}</div>
				<div className="list-text list-description">{props.description}</div>
				<div className="list-text list-owner">Created by: {props.owner}</div>
				<div className="list-text list-date">{props.date_created}</div>
				<div className="list-text list-date">{props.date_modified}</div>
			</div>
		</a>
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

class ListApp extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			page_num: 0,
			num_to_retrieve: 10,
			num_ret: null,
			page: null,
			data: null
		};

		this._handleRetrieve = this._handleRetrieve.bind(this);
	}

	_handleRetrieve(page = this.state.page_num, num = this.state.num_to_retrieve) {
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

	componentDidMount() {
		this._handleRetrieve();
	}

	render() {
		console.log(this.state.data);
		return (
			<div>
				{!!this.state.data ? <BrewList data={this.state.data}/> : <div>
					Loading brew list...
				</div>}
			</div>
		);
	}
}

export default ListApp;
