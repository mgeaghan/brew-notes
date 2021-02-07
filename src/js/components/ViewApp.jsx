import React from 'react';
import schema from '../schema';
import update from 'immutability-helper';
import { Redirect } from 'react-router-dom';
import redirectOnUnauth from '../checkAuth';


const ViewField = (props) => {
	return (
		<div id={props.id} className={props.className}>
			<h5 id={props.field_name + "-label"} className="field-label">{props.field_label}</h5>
			<p id={props.field_id} className={props.field_className}>{props.value}</p>
		</div>
	);
};

const fieldParams = (section, field, idx, value) => {
	return {
		id: "view-brew-" + section + "-" + field + "-" + idx + "-container",
		className: "view-field-container view-brew-" + section + "-field-container",
		field_id: "view-brew-" + section + "-" + field + "-" + idx,
		field_className: "view-brew-section-field-container view-brew-" + section + "-field-container",
		field_name: "view-brew-" + section + "-" + field + "-" + idx,
		field_label: schema[section][field].label ? schema[section][field].label + ": " : null,
		value: value
	};
};

const ViewBrewInfo = (props) => {
	return (
		<div id="view-brew-information" class="view-brew-information">
			{Object.keys(schema.information).map(x => {
				let value = props.data.hasOwnProperty(x) ? props.data[x] : "";
				let params = fieldParams("information", x, 0, value);
				return ViewField(params);
			})}
		</div>
	);
};

const ViewRecipeItem = (props) => {
	return (
		<div className="view-recipe-item-wrapper">
			<span className="view-recipe-item-idx">{(props.idx + 1) + ". "}</span>
			<div className="view-recipe-item">
				{Object.keys(schema[props.type]).map((x, i) => {
					let value = props.data.hasOwnProperty(x) ? props.data[x] : "";
					let params = fieldParams(props.type, x, props.idx, value);
					return ViewField(params)
				}).filter(x => x)
				}
			</div>
		</div>
	);
};

const ViewRecipeItemList = (props) => {
	return (
		<div id={"view-recipe-item-list-" + props.type} className={"view-recipe-item-list"}>
			<h4>{props.heading}</h4>
			{props.data
				.map((x, i) => ViewRecipeItem({
					type: props.type,
					idx: i,
					data: x
			}))}
		</div>
	);
};

const EditButton = (props) => {
	return (
		<div className="edit-button view-edit-button button" onClick={props.onClick}>Edit</div>
	);
};

class ViewApp extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			id: null,
			data: {
				user_id: null,
				user_name: null,
				created: null,
				modified: null,
				private: false,
				information: this._infoItem(),
				fermentables: [this._recipeItem("fermentables")],
				hops: [this._recipeItem("hops")],
				yeast: [this._recipeItem("yeast")],
				misc: [this._recipeItem("misc")],
				step_mash: [this._recipeItem("step_mash")],
				step_misc: [this._recipeItem("step_misc")]
			},
			redirect: null
		};
		
		this._recipeItem = this._recipeItem.bind(this);
		this._infoItem = this._infoItem.bind(this);
		this._handleRetrieve = this._handleRetrieve.bind(this);
		this._retrieveFromUrl = this._retrieveFromUrl.bind(this);
		this._handleEdit = this._handleEdit.bind(this);
	}

	_infoItem(data = {}) {
		if (typeof(data) === "object") {
			let props = Object.keys(schema.information);
			let ret = {};
			props.forEach(x => {
				if (data.hasOwnProperty(x)) {
					ret[x] = data[x];
				} else {
					ret[x] = schema.information[x].default;
				}
			});
			return ret;
		} else {
			return null;
		}
	}

	_recipeItem(type, data = {}) {
		if (schema.hasOwnProperty(type)) {
			if (typeof(data) === "object") {
				let props = Object.keys(schema[type]);
				let ret = {};
				props.forEach(x => {
					if (data.hasOwnProperty(x)) {
						ret[x] = data[x];
					} else {
						ret[x] = schema[type][x].default;
					}
				});
				return ret;
			} else {
				return null;
			}
		} else {
			return null;
		}
	}

	_handleEdit() {
		this.setState({
			redirect: '/edit?id=' + this.state.id
		});
	}

	_handleRetrieve(id_string) {
		let getData = fetch('/api/fetch?id=' + id_string, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then(response => response.json())
			.then(data => {
				if (data.success) {
					this.setState({ id: data.id, data: data.data, readOnly: true });
				}  // else display message
				console.log(data);
			});
	}

	_retrieveFromUrl() {
		const urlParams = new URLSearchParams(window.location.search);
		const id_string = urlParams.get('id');
		if (id_string) {
			this._handleRetrieve(id_string);
		} else {
			this.setState({ redirect: '/home' })
		}
	}

	componentDidMount() {
		redirectOnUnauth();
		this._retrieveFromUrl();
	}

	render() {
		if (this.state.redirect) {
			return <Redirect to={ this.state.redirect } />
		}
		if (!this.state.id) {
			return <div></div>
		}
		return (
			<div id="viewer">
				<form>
					<h1>View brew</h1>
					<ViewBrewInfo
						data={this.state.data.information} />
					<div className="save-delete-view">
						<EditButton onClick={this._handleEdit} />
					</div>
					<h2>Recipe</h2>
					<ViewRecipeItemList
						type="fermentables"
						heading="Fermentables"
						data={this.state.data.fermentables} />
					<ViewRecipeItemList
						type="hops"
						heading="Hops"
						data={this.state.data.hops} />
					<ViewRecipeItemList
						type="yeast"
						heading="Yeast"
						data={this.state.data.yeast} />
					<ViewRecipeItemList
						type="misc"
						heading="Miscellaneous"
						data={this.state.data.misc} />
					<ViewRecipeItemList
						type="step_mash"
						heading="Mash Steps"
						data={this.state.data.step_mash} />
					<ViewRecipeItemList
						type="step_misc"
						heading="Additional Notes"
						data={this.state.data.step_misc} />
					<div className="save-delete-view">
						<EditButton onClick={this._handleEdit} />
					</div>
				</form>
			</div>
		);
	}
}

export default ViewApp;
