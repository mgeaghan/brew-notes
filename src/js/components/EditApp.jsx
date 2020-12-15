import React from 'react';

const schema = {
	information: {
		name: {
			type: "string",
			options: null,
			default: ""
		},
		style: {
			type: "string",
			options: null,
			default: ""
		},
		description: {
			type: "textarea",
			options: null,
			default: ""
		}
	},
	fermentables: {
		ingredient: {
			type: "string",
			options: null,
			default: ""
		},
		amount: {
			type: "number",
			options: null,
			default: 0
		},
		units: {
			type: "select",
			options: ["kg", "g"],
			default: "kg"
		},
		ppg: {
			type: "number",
			options: null,
			default: 0
		},
		colour: {
			type: "number",
			options: null,
			default: 0
		},
		colour_units: {
			type: "select",
			options: ["L", "SRM", "EBC"],
			default: "SRM"
		},
		use: {
			type: "select",
			options: ["mash", "steep", "extract"],
			default: "mash"
		},
	},
	hops: {
		ingredient: {
			type: "string",
			options: null,
			default: ""
		},
		amount: {
			type: "number",
			options: null,
			default: 0
		},
		units: {
			type: "select",
			options: ["g"],
			default: "g"
		},
		use: {
			type: "select",
			options: ["boil", "flame-out", "dry-hop"],
			default: "boil"
		},
		time: {
			type: "number",
			options: null,
			default: 0
		},
		aa: {
			type: "number",
			options: null,
			default: 0
		},
		ibu: {
			type: "number",
			options: null,
			default: 0
		}
	},
	yeast: {
		name: {
			type: "string",
			options: null,
			default: ""
		},
		amount: {
			type: "number",
			options: null,
			default: 0
		},
		units: {
			type: "select",
			options: ["billion cells"],
			default: "billion cells"
		},
		attenuation: {
			type: "number",
			options: null,
			default: 0
		}
	},
	misc: null,
	step_mash: null,
	step_fermentation: null,
	step_misc: null,
};

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
				.map(x => {
					return (
						<div id={name(x) + "-wrapper"} className={"recipe-item-wrapper " + className(x) + "-wrapper"}>
							<label for={name(x)} id={label(x)}></label>
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
														.map((y, i) => {
															return (<option value={y} selected={props.values.hasOwnProperty(x) ? y === props.values[x] : i === 0}>{y}</option>);
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
		<div id="add-item" onClick={props.onClick}>{props.text}</div>
	);
};

const RemItemButton = (props) => {
	return (
		<div id="rem-item" onClick={props.onClick}>Remove item</div>
	);
}

class EditApp extends React.Component {
	constructor(props) {
		super(props);

		
		this.state = {
			name: "brew 1",
			style: "ale",
			description: "a beer",
			fermentables: [this._recipeItem("fermentables", {ingredient: "malt", amount: 5})],
			hops: [this._recipeItem("hops", {ingredient: "some hops", amount: 10})],
			yeast: [this._recipeItem("yeast", {name: "some yeast", amount: 1})]
		};
		
		this._handleChange = this._handleChange.bind(this);
		this._handleRecipeChange = this._handleRecipeChange.bind(this);
		this._handleAddRecipeItem = this._handleAddRecipeItem.bind(this);
		this._handleRemRecipeItem = this._handleRemRecipeItem.bind(this);
		this._recipeItem = this._recipeItem.bind(this);
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
			let update_state = {};
			update_state[field] = e.target.value;
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
					<EditTextField 
						id="brew-name-div"
						className="brew-field"
						field_id="brew-name"
						field_name="brew-name"
						field_label="Name:"
						value={this.state.name}
						onChange={this._handleChange("name")} />
					<EditTextField 
						id="brew-style-div"
						className="brew-field"
						field_id="brew-style"
						field_name="brew-style"
						field_label="Style:"
						value={this.state.style}
						onChange={this._handleChange("style")} />
					<EditTextareaField
						id="brew-description-div"
						className="brew-description-field"
						field_id="brew-description"
						field_name="brew-description"
						field_label="Description:"
						value={this.state.description}
						onChange={this._handleChange("description")}
						cols={80} rows={10} />
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
