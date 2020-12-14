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
			<input type="text" id={name("ingredient")} className={className("ingredient")} name={name("ingredient")} value={props.values.ingredient} onChange={props.onChange(props.idx, "ingredient")}></input>
			<label for={name("amount")} id={label("amount")}></label>
			<input type="text" id={name("amount")} className={className("ingredient")} name={name("amount")} value={props.values.amount} onChange={props.onChange(props.idx, "amount")}></input>
			<label for={name("units")} id={label("units")}></label>
			<input type="text" id={name("units")} className={className("ingredient")} name={name("units")} value={props.values.units} onChange={props.onChange(props.idx, "units")}></input>
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

class EditApp extends React.Component {
	constructor(props) {
		super(props);

		const recipeItem = (ingredient, amount, units) => {
			return {
				ingredient: ingredient,
				amount: amount,
				units: units
			};
		};

		this.state = {
			name: "",
			style: "",
			recipe: [recipeItem("malt", 5, "kg"), recipeItem("hops", 10, "g")]
		};

		this._handleChange = this._handleChange.bind(this);
		this._handleRecipeChange = this._handleRecipeChange.bind(this);
	}

	_handleChange(field) {
		return (e) => {
			let update_state = {};
			update_state[field] = e.target.value;
			this.setState(update_state);
		};
	}

	_handleRecipeChange(idx, field) {
		return (e) => {
			let update_state = this.state.recipe;
			update_state[idx][field] = e.target.value;
			this.setState(update_state);
		};
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
					{this.state.recipe.map((x, i) => EditRecipeFermentableItem({
						idx: i,
						values: x,
						onChange: this._handleRecipeChange
					}))}
				</form>
			</div>
		);
	}
}

export default EditApp;
