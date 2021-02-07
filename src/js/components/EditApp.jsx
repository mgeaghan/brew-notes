import React from 'react';
import schema from '../schema';
import update from 'immutability-helper';
import { Redirect } from 'react-router-dom';
import redirectOnUnauth from '../checkAuth';


const EditTextField = (props) => {
	return (
		<div id={props.id} className={props.className}>
			<label for={props.field_name} id={props.field_name + "-label"} className="field-label">{props.field_label}</label>
			<input type="text" id={props.field_id} className={props.field_className} name={props.field_name} value={props.value} onChange={props.onChange} readOnly={props.readOnly}></input>
		</div>
	);
};

const EditTextareaField = (props) => {
	return (
		<div id={props.id} className={props.className}>
			<label for={props.field_name} id={props.field_name + "-label"} className="field-label">{props.field_label}</label>
			<textarea id={props.field_id} className={props.field_className} name={props.field_name} value={props.value} onChange={props.onChange} readOnly={props.readOnly}></textarea>
		</div>
	);
};

const EditNumberField = (props) => {
	return (
		<div id={props.id} className={props.className}>
			<label for={props.field_name} id={props.field_name + "-label"} className="field-label">{props.field_label}</label>
			<input type="number" id={props.field_id} className={props.field_className} name={props.field_name} value={props.value} onChange={props.onChange} readOnly={props.readOnly}></input>
		</div>
	);
}

const EditSelectionField = (props) => {
	return (
		<div id={props.id} className={props.className}>
			<label for={props.field_name} id={props.field_name + "-label"} className="field-label">{props.field_label}</label>
			<select id={props.field_id} className={props.field_className} name={props.field_name} onChange={props.onChange} disabled={props.readOnly}>
				{
					props.options.map((x, i) => {
						return (<option value={x} selected={props.hasOwnProperty("value") ? props.value === x : (props.hasOwnProperty("default") ? props.default : i === 0)}>{x}</option>);
					})
				}
			</select>
		</div>
	);
};

const fieldParams = (section, field, idx, readOnly = false) => {
	return {
		id: "brew-" + section + "-" + field + "-" + idx + "-container",
		className: "field-container brew-" + section + "-field-container",
		field_id: "brew-" + section + "-" + field + "-" + idx,
		field_className: "brew-section-field-container brew-" + section + "-field-container",
		field_name: "brew-" + section + "-" + field + "-" + idx,
		field_label: schema[section][field].label ? schema[section][field].label + ": " : null,
		readOnly: readOnly
	};
};

const EditField = (section, field, value, onChange, readOnly = false, idx = 0) => {
	let params = fieldParams(section, field, idx, readOnly);
	params.value = value;
	params.onChange = onChange(field);
	return (() => {
		switch(schema[section][field].type) {
			case "string":
				return EditTextField(params);
			case "number":
				return EditNumberField(params);
			case "textarea":
				params.className = "textarea-field-container " + params.className;
				return EditTextareaField(params);
			case "select":
				params.options = schema[section][field].options;
				params.default = schema[section][field].default;
				return EditSelectionField(params);
			case "checkbox":
				return EditPrivateCheckbox(params);
			default:
				return null;
		}
	})();
};

const EditBrewInfo = (props) => {
	return (
		<div id="brew-information" class="brew-information">
			{Object.keys(schema.information).map(x => {
				let value = props.data.hasOwnProperty(x) ? props.data[x] : "";
				return EditField("information", x, value, props.onChange, props.readOnly);
			})}
		</div>
	);
};

const EditRecipeItem = (props) => {
	return (
		<div className="recipe-item-wrapper">
			<span className="recipe-item-idx">{(props.idx + 1) + ". "}</span>
			<div className="recipe-item">
				{Object.keys(schema[props.type]).map((x, i) => {
					let value = props.data.hasOwnProperty(x) ? props.data[x] : "";
					return EditField(props.type, x, value, props.onChange, props.readOnly, props.idx)
				}).filter(x => x)
				}
			</div>
			{ props.readOnly ? (<div></div>) : (
				<RemItemButton onClick={props.handleRemove} />
			) }
		</div>
	);
};

const EditRecipeItemList = (props) => {
	return (
		<div id={"recipe-item-list-" + props.type} className={"recipe-item-list"}>
			<h4>{props.heading}</h4>
			{props.data
				.map((x, i) => EditRecipeItem({
					type: props.type,
					idx: i,
					data: x,
					onChange: props.handleRecipeChange(props.type, i),
					handleRemove: props.handleRemRecipeItem(props.type, i),
					readOnly: props.readOnly
			}))}
			{ props.readOnly ? (<div></div>) : (
				<AddItemButton onClick={props.handleAddRecipeItem(props.type)} text={props.button_text} />
			) }
		</div>
	);
};

const AddItemButton = (props) => {
	return (
		<div className="add-rem-item-button add-item" onClick={props.onClick}><i className="fas fa-plus"></i></div>
	);
};

const RemItemButton = (props) => {
	return (
		<div className="add-rem-item-button rem-item" onClick={props.onClick}><i className="fas fa-minus"></i></div>
	);
}

const SaveButton = (props) => {
	return (
		<div className="save-button save-delete-button button" onClick={props.onClick}>Save</div>
	);
};

const DeleteButton = (props) => {
	return (
		<div className="delete-button save-delete-button button" onClick={props.onClick}>Delete</div>
	);
};

const EditButton = (props) => {
	return (
		<div className="edit-button view-edit-button button" onClick={props.onClick}>Edit</div>
	);
};

const ViewButton = (props) => {
	return (
		<div className="view-button view-edit-button button" onClick={props.onClick}>Finish Editing</div>
	);
};

const EditPrivateCheckbox = (props) => {
	return (
		<div className="checkbox-wrapper private-checkbox-wrapper">
			<input type="checkbox" className="checkbox private-checkbox" name="private-checkbox" value="Private" onChange={props.onChange} checked={props.checked} disabled={props.readOnly}></input>
			<label for="private-checkbox" id="private-checkbox-label" className="private-checkbox-label">Private</label>
		</div>
	);
}

class EditApp extends React.Component {
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
			processing: {
				active: false,
				success: null,
				message: null
			},
			redirect: null,
			readOnly: this.props.hasOwnProperty('readOnly') ? this.props.readOnly : false
		};
		
		this._handleChange = this._handleChange.bind(this);
		this._handleRecipeChange = this._handleRecipeChange.bind(this);
		this._handleAddRecipeItem = this._handleAddRecipeItem.bind(this);
		this._handleRemRecipeItem = this._handleRemRecipeItem.bind(this);
		this._recipeItem = this._recipeItem.bind(this);
		this._infoItem = this._infoItem.bind(this);
		this._handleSave = this._handleSave.bind(this);
		this._handleDelete = this._handleDelete.bind(this);
		this._handleRetrieve = this._handleRetrieve.bind(this);
		this._retrieveFromUrl = this._retrieveFromUrl.bind(this);
		this._handleSetReadOnly = this._handleSetReadOnly.bind(this);
		this._handleUnsetReadOnly = this._handleUnsetReadOnly.bind(this);
		this._handleView = this._handleView.bind(this);
		this._handleTogglePrivate = this._handleTogglePrivate.bind(this);
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

	_handleChange(field) {
		return (e) => {
			let update_state = update(this.state, {
				data: {
					information: {
						[field]: { $set: e.target.value }
					}
				}
			});
			this.setState(update_state);
		};
	}

	_handleRecipeChange(type, idx) {
		return (field) => {
			return (e) => {
				let update_state = update(this.state, {
					data: {
						[type]: {
							[idx]: {
								[field]: { $set: e.target.value }
							}
						}
					}
				});
				this.setState(update_state);
			};
		};
	}

	_handleAddRecipeItem(type) {
		return () => {
			let update_state = update(this.state, {
				data: {
					[type]: { $push: [this._recipeItem(type)] }
				}
			});
			this.setState(update_state);
		};
	}

	_handleRemRecipeItem(type, idx) {
		return () => {
			let update_state = update(this.state, {
				data: {
					[type]: { $splice: [[idx, 1]] }
				}
			});
			this.setState(update_state);
		}
	}

	_handleSave() {
		this.setState({
			processing: {
				active: true,
				success: null,
				message: "Please wait: saving..."
			}
		});
		let submitData = fetch('/api/save', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(this.state)
		})
			.then(response => response.json())
			.then(data => {
				console.log(data);
				this.setState({
					processing: {
						active: true,
						success: data.success,
						message: data.message
					}
				});
				setTimeout(() => {
					this.setState({
						processing: {
							active: false,
							success: null,
							message: null
						}
					});
					if (data.success) {
						// this._handleRetrieve(data.id);
						this.setState({
							redirect: '/view?id=' + data.id
						});
					}
				}, 3000);
			});
	}

	_handleDelete() {
		if (this.state.id) {
			this.setState({
				processing: {
					active: true,
					success: null,
					message: "Please wait: deleting..."
				}
			});
			let deleteData = fetch('/api/delete', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ id: this.state.id })
			})
				.then(response => response.json())
				.then(data => {
					console.log(data);
					this.setState({
						processing: {
							active: true,
							success: data.success,
							message: data.message
						}
					});
					setTimeout(() => {
						this.setState({
							processing: {
								active: false,
								success: null,
								message: null
							}
						});
						if (data.success) {
							this.setState({
								redirect: '/list'
							});
						}
					}, 3000);
				});
		}
	}

	_handleSetReadOnly() {
		this.setState({
			readOnly: true
		});
	}

	_handleUnsetReadOnly() {
		this.setState({
			readOnly: false
		});
	}

	_handleView() {
		if (this.state.id) {
			this.setState({
				redirect: '/view?id=' + this.state.id
			});
		}
	}

	_handleTogglePrivate(e) {
		let update_state = update(this.state, {
			data: {
				private: { $set: e.target.checked	}
			}
		});
		this.setState(update_state);
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
					this.setState({ id: data.id, data: data.data, readOnly: false });
				}
				console.log(data);
			});
	}

	_retrieveFromUrl() {
		const urlParams = new URLSearchParams(window.location.search);
		const id_string = urlParams.get('id');
		if (id_string) this._handleRetrieve(id_string);
	}

	componentDidMount() {
		redirectOnUnauth();
		this._retrieveFromUrl();
	}

	render() {
		console.log(this.state.data.private);
		if (this.state.redirect) {
			return <Redirect to={ this.state.redirect } />
		}
		if (this.state.processing.active) {
			return (
				<div id="processing-message">
					<p>
						{ this.state.processing.message }
					</p>
				</div>
			);
		}
		return (
			<div id="editor">
				<form>
					<h1>Edit brew</h1>
					<EditBrewInfo
						data={this.state.data.information}
						onChange={this._handleChange}
						readOnly={this.state.readOnly} />
					<EditPrivateCheckbox
						onChange={this._handleTogglePrivate}
						checked={this.state.data.private}
						readOnly={this.state.readOnly} />
					<div className="save-delete-view">
						<SaveButton onClick={this._handleSave} />
						{ this.state.id ? <DeleteButton onClick={this._handleDelete} /> : "" }
						{ this.state.id ? <ViewButton onClick={this._handleView} /> : "" }
					</div>
					<h2>Recipe</h2>
					<EditRecipeItemList
						type="fermentables"
						heading="Fermentables"
						data={this.state.data.fermentables}
						button_text="Add Fermentable"
						handleRecipeChange={this._handleRecipeChange}
						handleAddRecipeItem={this._handleAddRecipeItem}
						handleRemRecipeItem={this._handleRemRecipeItem}
						readOnly={this.state.readOnly} />
					<EditRecipeItemList
						type="hops"
						heading="Hops"
						data={this.state.data.hops}
						button_text="Add Hops"
						handleRecipeChange={this._handleRecipeChange}
						handleAddRecipeItem={this._handleAddRecipeItem}
						handleRemRecipeItem={this._handleRemRecipeItem}
						readOnly={this.state.readOnly} />
					<EditRecipeItemList
						type="yeast"
						heading="Yeast"
						data={this.state.data.yeast}
						button_text="Add Yeast"
						handleRecipeChange={this._handleRecipeChange}
						handleAddRecipeItem={this._handleAddRecipeItem}
						handleRemRecipeItem={this._handleRemRecipeItem}
						readOnly={this.state.readOnly} />
					<EditRecipeItemList
						type="misc"
						heading="Miscellaneous"
						data={this.state.data.misc}
						button_text="Add Miscellaneous"
						handleRecipeChange={this._handleRecipeChange}
						handleAddRecipeItem={this._handleAddRecipeItem}
						handleRemRecipeItem={this._handleRemRecipeItem}
						readOnly={this.state.readOnly} />
					<EditRecipeItemList
						type="step_mash"
						heading="Mash Steps"
						data={this.state.data.step_mash}
						button_text="Add Step"
						handleRecipeChange={this._handleRecipeChange}
						handleAddRecipeItem={this._handleAddRecipeItem}
						handleRemRecipeItem={this._handleRemRecipeItem}
						readOnly={this.state.readOnly} />
					<EditRecipeItemList
						type="step_misc"
						heading="Additional Notes"
						data={this.state.data.step_misc}
						button_text="Add Note"
						handleRecipeChange={this._handleRecipeChange}
						handleAddRecipeItem={this._handleAddRecipeItem}
						handleRemRecipeItem={this._handleRemRecipeItem}
						readOnly={this.state.readOnly} />
					<div className="save-delete-view">
						<SaveButton onClick={this._handleSave} />
						{ this.state.id ? <DeleteButton onClick={this._handleDelete} /> : "" }
						{ this.state.id ? <ViewButton onClick={this._handleView} /> : "" }
					</div>
				</form>
			</div>
		);
	}
}

export default EditApp;
