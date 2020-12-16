import React from 'react';
import schema from '../schema';


const EditTextField = (props) => {
	return (
		<div id={props.id} className={props.className}>
			<label for={props.field_name} id={props.field_name + "-label"}>{props.field_label}</label>
			<input type="text" id={props.field_id} name={props.field_name} value={props.value} onChange={props.onChange}></input>
		</div>
	);
};

const EditTextareaField = (props) => {
	return (
		<div id={props.id} className={props.className}>
			<label for={props.field_name} id={props.field_name + "-label"}>{props.field_label}</label>
			<textarea id={props.field_id} name={props.field_name} value={props.value} onChange={props.onChange} rows={props.rows} cols={props.cols}></textarea>
		</div>
	);
};

const EditBrewInfo = (props) => {
	return (
		<div id="brew-information" class="brew-information">
			{Object.keys(schema.information).map(x => {
				let params = {
					id: "brew-" + x + "-div",
					field_id: "brew-" + x,
					field_name: "brew-" + x,
					field_label: schema.information[x].label + ": ",
					value: props.data.hasOwnProperty(x) ? props.data[x] : "",
					onChange: props.onChange(x),
					cols: props.hasOwnProperty("textarea_cols") ? props.textarea_cols : 80,
					rows: props.hasOwnProperty("textarea_rows") ? props.textarea_rows : 10
				};
				return (() => {
					switch(schema.information[x].type) {
						case "string":
							params.className = "brew-field";
							return EditTextField(params);
						case "textarea":
							params.className = "brew-textarea-field";
							return EditTextareaField(params);
						default:
							return null;
					}
				})();
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
			yeast: [this._recipeItem("yeast")]
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
						onChange={this._handleChange}
						textarea_cols={80}
						textarea_rows={10} />
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
				</form>
			</div>
		);
	}
}

export default EditApp;
