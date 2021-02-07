const mongoose = require('mongoose');

const information = {
	name: String,
	style: String,
	description: String
};
const fermentables = {
	ingredient: String,
	amount: Number,
	units: String,
	ppg: Number,
	colour: Number,
	colour_units: String,
	use: String
};
const hops = {
	ingredient: String,
	amount: Number,
	units: String,
	use: String,
	time: Number,
	aa: Number,
	ibu: Number
};
const yeast = {
	name: String,
	amount: Number,
	units: String,
	attenuation: Number
};
const misc = {
	ingredient: String,
	amount: Number,
	units: String,
	use: String,
	notes: String
};
const step_mash = {
	step_type: String,
	temperature: Number,
	time: Number
};
const step_misc = {
	notes: String
};

const brewSchema = new mongoose.Schema({
	data: {
		user_id: String,
		user_name: String,
		created: Number,
		modified: Number,
		private: Boolean,
		information: information,
		fermentables: [fermentables],
		hops: [hops],
		yeast: [yeast],
		misc: [misc],
		step_mash: [step_mash],
		step_misc: [step_misc]
	}
});

const Brew = mongoose.model("Brew", brewSchema);

module.exports = Brew;
