import React from 'react';
import schema from '../schema';


const EditTextField = (props) => {
	return (
		<div id={props.id} className={props.className}>
			<label for={props.field_name} id={props.field_name + "-label"} className="field-label">{props.field_label}</label>
			<input type="text" id={props.field_id} className={props.field_className} name={props.field_name} value={props.value} onChange={props.onChange}></input>
		</div>
	);
};

const EditTextareaField = (props) => {
	return (
		<div id={props.id} className={props.className}>
			<label for={props.field_name} id={props.field_name + "-label"} className="field-label">{props.field_label}</label>
			<textarea id={props.field_id} className={props.field_className} name={props.field_name} value={props.value} onChange={props.onChange}></textarea>
		</div>
	);
};

const EditNumberField = (props) => {
	return (
		<div id={props.id} className={props.className}>
			<label for={props.field_name} id={props.field_name + "-label"} className="field-label">{props.field_label}</label>
			<input type="number" id={props.field_id} className={props.field_className} name={props.field_name} value={props.value} onChange={props.onChange}></input>
		</div>
	);
}

const EditSelectionField = (props) => {
	return (
		<div id={props.id} className={props.className}>
			<label for={props.field_name} id={props.field_name + "-label"} className="field-label">{props.field_label}</label>
			<select id={props.field_id} className={props.field_className} name={props.field_name} onChange={props.onChange}>
				{
					props.options.map((x, i) => {
						return (<option value={x} selected={props.hasOwnProperty("default") ? props.default === x : i === 0}>{x}</option>);
					})
				}
			</select>
		</div>
	);
};

const fieldParams = (section, field) => {
	return {
		id: "brew-" + section + "-" + field + "-container",
		className:  + section + "-field-container",
		field_id: "brew-" + section + "-" + field,
		field_className: "brew-" + section + "-field-container",
		field_name: "brew-" + section + "-" + field,
		field_label: schema[section][field].label + ": "
	};
};

const EditField = (section, field, value, onChange) => {
	let params = fieldParams(section, field);
	params.value = value;
	params.onChange = onChange(field);
	return (() => {
		switch(schema[section][field].type) {
			case "string":
				return EditTextField(params);
			case "number":
				return EditNumberField(params);
			case "textarea":
				return EditTextareaField(params);
			case "select":
				params.options = schema[section][field].options;
				params.default = schema[section][field].default;
				return EditSelectionField(params);
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
				return EditField("information", x, value, props.onChange);
			})}
		</div>
	);
};

const EditRecipeItem = (props) => {
	const recipe_type = "recipe-" + props.type;
	const recipe_item_id = recipe_type + "-item-" + props.idx;
	const recipe_item_class = "recipe-item recipe-" + props.type + "-item";
	const className = (field) => {
		return recipe_type + " " + recipe_type + "-" + field;
	};
	const name = (field) => {
		return recipe_type + "-" + field + "-" + props.idx;
	};
	const label = (field) => {
		return name(field) + "-label"
	};
	return (
		<div className="recipe-item-wrapper">
			<div id={recipe_item_id} className={recipe_item_class}>
				{Object.keys(schema[props.type])
					.map((x, i) => {
						return (
							<div id={name(x) + "-wrapper"} className={"recipe-item-field-wrapper " + className(x) + "-wrapper"}>
								<label for={name(x)} id={label(x)} className="recipe-item-field-label">{schema[props.type][x].label + ": "}</label>
								{
									(() => {
										switch(schema[props.type][x].type) {
											case "string":
											case "number":
												return (<input type={schema[props.type][x].type} id={name(x)} className={className(x)} name={name(x)} value={props.values.hasOwnProperty(x) ? props.values[x] : ""} onChange={props.onChange(x)}></input>);
											case "select":
												return (
													<select id={name(x)} className={className(x)} name={name(x)} onChange={props.onChange(x)}>
													{
														schema[props.type][x].options
															.map((y, j) => {
																return (<option value={y} selected={props.values.hasOwnProperty(x) ? y === props.values[x] : j === 0}>{y}</option>);
															})
													}
													</select>
												);
											case "textarea":
												return (<textarea type={schema[props.type][x].type} id={name(x)} className={className(x)} name={name(x)} value={props.values.hasOwnProperty(x) ? props.values[x] : ""} onChange={props.onChange(x)}></textarea>);
											default:
												return null;
										}
									})()
								}
							</div>
						);
					})
					.filter(x => x)
				}
			</div>
			<RemItemButton onClick={props.handleRemove} />
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
					values: x,
					onChange: props.handleRecipeChange(props.type, i),
					handleRemove: props.handleRemRecipeItem(props.type, i)
			}))}
			<AddItemButton onClick={props.handleAddRecipeItem(props.type)} text={props.button_text} />
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

class EditApp extends React.Component {
	constructor(props) {
		super(props);

		
		this.state = {
			information: this._infoItem(),
			fermentables: [this._recipeItem("fermentables")],
			hops: [this._recipeItem("hops")],
			yeast: [this._recipeItem("yeast")],
			misc: [{ingredient: "", amount: 0, units: "g", use: "boil", notes: ""}]
		};
		
		this._handleChange = this._handleChange.bind(this);
		this._handleRecipeChange = this._handleRecipeChange.bind(this);
		this._handleAddRecipeItem = this._handleAddRecipeItem.bind(this);
		this._handleRemRecipeItem = this._handleRemRecipeItem.bind(this);
		this._recipeItem = this._recipeItem.bind(this);
		this._infoItem = this._infoItem.bind(this);
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
			let update_state = {information: Object.assign({}, this.state.information)};
			update_state.information[field] = e.target.value;
			this.setState(update_state);
		};
	}

	_handleRecipeChange(type, idx) {
		return (field) => {
			return (e) => {
				let update_state = {};
				update_state[type] = [...this.state[type]];
				update_state[type][idx][field] = e.target.value;
				this.setState(update_state);
			};
		};
	}

	_handleAddRecipeItem(type) {
		return () => {
			let update_state = {};
			update_state[type] = [...this.state[type]];
			update_state[type].push(this._recipeItem(type));
			this.setState(update_state);
		};
	}

	_handleRemRecipeItem(type, idx) {
		return () => {
			let update_state = {};
			let update_array = [...this.state[type]];
			if (idx === (update_array.length - 1)) {
				update_state[type] = update_array.slice(0, idx);
			} else if (idx === 0) {
				update_state[type] = update_array.slice(1);
			} else {
				update_state[type] = update_array.slice(0, idx).concat(update_array.slice(idx + 1));
			}
			this.setState(update_state);
		}
	}

	render() {
		return (
			<div id="editor">
				<form>
					<EditBrewInfo
						data={this.state.information}
						onChange={this._handleChange} />
					<h3>Recipe</h3>
					<EditRecipeItemList
						type="fermentables"
						heading="Fermentables"
						data={this.state.fermentables}
						button_text="Add Fermentable"
						handleRecipeChange={this._handleRecipeChange}
						handleAddRecipeItem={this._handleAddRecipeItem}
						handleRemRecipeItem={this._handleRemRecipeItem} />
					<EditRecipeItemList
						type="hops"
						heading="Hops"
						data={this.state.hops}
						button_text="Add Hops"
						handleRecipeChange={this._handleRecipeChange}
						handleAddRecipeItem={this._handleAddRecipeItem}
						handleRemRecipeItem={this._handleRemRecipeItem} />
					<EditRecipeItemList
						type="yeast"
						heading="Yeast"
						data={this.state.yeast}
						button_text="Add Yeast"
						handleRecipeChange={this._handleRecipeChange}
						handleAddRecipeItem={this._handleAddRecipeItem}
						handleRemRecipeItem={this._handleRemRecipeItem} />
					<EditRecipeItemList
						type="misc"
						heading="Miscellaneous"
						data={this.state.misc}
						button_text="Add Miscellaneous"
						handleRecipeChange={this._handleRecipeChange}
						handleAddRecipeItem={this._handleAddRecipeItem}
						handleRemRecipeItem={this._handleRemRecipeItem} />
				</form>
			</div>
		);
	}
}

export default EditApp;
