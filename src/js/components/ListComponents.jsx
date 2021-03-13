import React from 'react';
import { Link } from 'react-router-dom';

const ListItem = (props) => {
	return (
		<Link className="list-item" to={"/view?id=" + props.id}>
			<div className="list-item-inner">
				<h4>{props.name}</h4>
				<table>
					<tr className="list-text list-description">
						<td className="list-text-label">Description:</td>
						<td className="list-text-text">{props.description}</td>
					</tr>
					<tr className="list-text list-style">
						<td className="list-text-label">Style:</td>
						<td className="list-text-text">{props.style}</td>
					</tr>
					<tr className="list-text list-owner">
						<td className="list-text-label">Created by:</td>
						<td className="list-text-text">{props.owner}</td>
					</tr>
					<tr className="list-text list-date">
						<td className="list-text-label">Created:</td>
						<td className="list-text-text">{props.date_created}</td>
					</tr>
					<tr className="list-text list-date">
						<td className="list-text-label">Last modified:</td>
						<td className="list-text-text">{props.date_modified}</td>
					</tr>
				</table>
				{/* <div className="list-text list-description">{props.description}</div>
				<div className="list-text list-stlye"><span className="list-text-label">Style: </span>{props.style}</div>
				<div className="list-text list-owner"><span className="list-text-label">Created by: </span>{props.owner}</div>
				<div className="list-text list-date"><span className="list-text-label">Created: </span>{props.date_created}</div>
				<div className="list-text list-date"><span className="list-text-label">Last Modified: </span>{props.date_modified}</div> */}
			</div>
		</Link>
	);
};

const UserItem = (props) => {
	return(
		<Link className="list-item" to={"/list?user=" + props.username}>
			<div className="list-item-inner">
				<h4>{props.username}</h4>
				<table>
					<tr className="list-text">
						<td className="list-text-label">Placeholder category:</td>
						<td className="list-text-text">{"Placeholder text: username is " + props.username}</td>
					</tr>
				</table>
			</div>
		</Link>
	);
};

const BrewList = (props) => {
	return (
		<div className="brew-list brew-user-list">
			{props.data.map(x => {
				return ListItem({
					id: x._id,
					name: x.data.information.name,
					style: x.data.information.style,
					description: x.data.information.description,
					owner: x.data.user_name,  // originally x.data.user_id
					date_created: new Date(x.data.created).toString(),
					date_modified: new Date(x.data.modified).toString()
				});
			})}
		</div>
	);
}

const titleCaseWord = str => str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();

const titleCase = str => str.replace(/\w\S*/g, titleCaseWord);

const UserList = (props) => {
	return (
		<div className="user-list brew-user-list">
			{props.data.map(x => {
				return UserItem({
					username: x.username
				})
			})}
		</div>
	);
};

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

export { ListItem, BrewList, UserList, PageSelector };
