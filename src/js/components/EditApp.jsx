import React from 'react';

const EditField = (props) => {
	return (
		<div id={props.id} className={props.className}>
			<label for={props.field_name} id={props.field_name + "-label"}>{props.field_label}</label>
			<input type="text" id={props.field_id} name={props.field_name} value={props.value} onChange={props.onChange}></input>
		</div>
	);
};

const EditRecipeFermentableItem = (props) => {
	const className = (field) => {
		return "recipe-fermentable recipe-fermentable-" + field;
	};
	const name = (field) => {
		return "recipe-fermentable-" + field + "-" + props.idx;
	};
	const label = (field) => {
		return name(field) + "-label"
	};
	return (
		<div id={"recipe-fermentable-item-" + props.idx} className="recipe-item recipe-fermentable-item">
			<label for={name("ingredient")} id={label("ingredient")}></label>
			<input type="text" id={name("ingredient")} className={className("ingredient")} name={name("ingredient")} value={props.values.ingredient} onChange={props.onChange("ingredient")}></input>
			<label for={name("amount")} id={label("amount")}></label>
			<input type="number" id={name("amount")} className={className("ingredient")} name={name("amount")} value={props.values.amount} onChange={props.onChange("amount")}></input>
			<label for={name("units")} id={label("units")}></label>
			<input type="text" id={name("units")} className={className("ingredient")} name={name("units")} value={props.values.units} onChange={props.onChange("units")}></input>
			<RemItemButton onClick={props.handleRemove} />
		</div>
	);
};

const EditRecipeHopsItem = (props) => {
	return null;
};

const EditRecipeYeastItem = (props) => {
	return null;
};

const EditRecipeMiscItem = (props) => {
	return null;
};

const EditRecipeStepsMashItem = (props) => {
	return null;
};

const EditRecipeStepsFermentationItem = (props) => {
	return null;
};

const EditRecipeStepsMiscItem = (props) => {
	return null;
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
			name: "",
			style: "",
			fermentables: [this._recipeFermentableItem("malt", 5)],
			hops: [this._recipeHopsItem("hops", 10)],
			yeast: [this._recipeYeastItem("yeast", 1)]
		};
		
		this._handleChange = this._handleChange.bind(this);
		this._handleRecipeChange = this._handleRecipeChange.bind(this);
		this._handleAddRecipeItem = this._handleAddRecipeItem.bind(this);
		this._handleRemRecipeItem = this._handleRemRecipeItem.bind(this);
		this._recipeFermentableItem = this._recipeFermentableItem.bind(this);
		this._recipeHopsItem = this._recipeHopsItem.bind(this);
		this._recipeYeastItem = this._recipeYeastItem.bind(this);
	}

	_recipeFermentableItem(ingredient = "", amount = 0, units = "kg") {
		return {
			ingredient: ingredient,
			amount: amount,
			units: units
		};
	}

	_recipeHopsItem(ingredient = "", amount = 0, units = "g") {
		return {
			ingredient: ingredient,
			amount: amount,
			units: units
		};
	}

	_recipeYeastItem(ingredient = "", amount = 0, units = "billion cells") {
		return {
			ingredient: ingredient,
			amount: amount,
			units: units
		};
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

	_handleAddRecipeItem(type, item) {
		return () => {
			let update_state = {};
			update_state[type] = [...this.state[type]];
			update_state[type].push(item);
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
					<EditField 
						id="brew-name-div"
						className="brew-field"
						field_id="brew-name"
						field_name="brew-name"
						field_label="Name:"
						value={this.state.name}
						onChange={this._handleChange("name")} />
					<EditField 
						id="brew-style-div"
						className="brew-field"
						field_id="brew-style"
						field_name="brew-style"
						field_label="Style:"
						value={this.state.style}
						onChange={this._handleChange("style")} />
					<h3>Recipe</h3>
					<h4>Fermentables</h4>
					{this.state.fermentables
						.map((x, i) => EditRecipeFermentableItem({
						idx: i,
						values: x,
						onChange: this._handleRecipeChange("fermentables", i),
						handleRemove: this._handleRemRecipeItem("fermentables", i)
					}))}
					<AddItemButton onClick={this._handleAddRecipeItem("fermentables", this._recipeFermentableItem())} text="Add Fermentable" />
					<h4>Hops</h4>
					{this.state.hops
						.map((x, i) => EditRecipeFermentableItem({  // This is just for testing - later use EditRecipeHopsItem
						idx: i,
						values: x,
						onChange: this._handleRecipeChange("hops", i),
						handleRemove: this._handleRemRecipeItem("hops", i)
					}))}
					<AddItemButton onClick={this._handleAddRecipeItem("hops", this._recipeHopsItem())} text="Add Hops" />
					<h4>Yeast</h4>
					{this.state.yeast
						.map((x, i) => EditRecipeFermentableItem({  // This is just for testing - later use EditRecipeHopsItem
						idx: i,
						values: x,
						onChange: this._handleRecipeChange("yeast", i),
						handleRemove: this._handleRemRecipeItem("yeast", i)
					}))}
					<AddItemButton onClick={this._handleAddRecipeItem("yeast", this._recipeHopsItem())} text="Add Yeast" />
				</form>
			</div>
		);
	}
}

export default EditApp;
