const mongoose = require('mongoose');

const numberFieldSchema = {
	type: String,
	options: [Number],
	default: Number,
	label: String
};

const stringFieldSchema = {
	type: String,
	options: [String],
	default: String,
	label: String
};

const brewSchema = new mongoose.Schema({
	information: {
		name: stringFieldSchema,
		style: stringFieldSchema,
		description: stringFieldSchema
	},
	fermentables: {
		ingredient: stringFieldSchema,
		amount: numberFieldSchema,
		units: stringFieldSchema,
		ppg: numberFieldSchema,
		colour: numberFieldSchema,
		colour_units: numberFieldSchema,
		use: stringFieldSchema
	},
	hops: {
		ingredient: stringFieldSchema,
		amount: numberFieldSchema,
		units: stringFieldSchema,
		use: stringFieldSchema,
		time: numberFieldSchema,
		aa: numberFieldSchema,
		ibu: numberFieldSchema
	},
	yeast: {
		name: stringFieldSchema,
		amount: numberFieldSchema,
		units: stringFieldSchema,
		attenuation: numberFieldSchema
	},
	misc: {
		ingredient: stringFieldSchema,
		amount: numberFieldSchema,
		units: stringFieldSchema,
		use: stringFieldSchema,
		notes: stringFieldSchema
	},
	step_mash: {
		type: stringFieldSchema,
		temperature: numberFieldSchema,
		time: numberFieldSchema
	},
	step_misc: {
		notes: stringFieldSchema
	}
});

export default brewSchema;