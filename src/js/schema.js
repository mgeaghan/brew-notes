const schema = {
	information: {
		name: {
			type: "string",
			options: null,
			default: "",
			label: "Name"
		},
		style: {
			type: "string",
			options: null,
			default: "",
			label: "Style"
		},
		description: {
			type: "textarea",
			options: null,
			default: "",
			label: "Description"
		}
	},
	fermentables: {
		ingredient: {
			type: "string",
			options: null,
			default: "",
			label: "Name"
		},
		amount: {
			type: "number",
			options: null,
			default: 0,
			label: "Amount"
		},
		units: {
			type: "select",
			options: ["kg", "g"],
			default: "kg",
			label: "Units"
		},
		ppg: {
			type: "number",
			options: null,
			default: 0,
			label: "ppg"
		},
		colour: {
			type: "number",
			options: null,
			default: 0,
			label: "Colour"
		},
		colour_units: {
			type: "select",
			options: ["L", "SRM", "EBC"],
			default: "SRM",
			label: "Units"
		},
		use: {
			type: "select",
			options: ["mash", "steep", "extract"],
			default: "mash",
			label: "Use"
		},
	},
	hops: {
		ingredient: {
			type: "string",
			options: null,
			default: "",
			label: "Name"
		},
		amount: {
			type: "number",
			options: null,
			default: 0,
			label: "Amount"
		},
		units: {
			type: "select",
			options: ["g"],
			default: "g",
			label: "Units"
		},
		use: {
			type: "select",
			options: ["boil", "flame-out", "dry-hop"],
			default: "boil",
			label: "Use"
		},
		time: {
			type: "number",
			options: null,
			default: 0,
			label: "Time"
		},
		aa: {
			type: "number",
			options: null,
			default: 0,
			label: "AA"
		},
		ibu: {
			type: "number",
			options: null,
			default: 0,
			label: "IBU"
		}
	},
	yeast: {
		name: {
			type: "string",
			options: null,
			default: "",
			label: "Name"
		},
		amount: {
			type: "number",
			options: null,
			default: 0,
			label: "Amount"
		},
		units: {
			type: "select",
			options: ["billion cells"],
			default: "billion cells",
			label: "Units"
		},
		attenuation: {
			type: "number",
			options: null,
			default: 0,
			label: "Attn. (%)"
		}
	},
	misc: null,
	step_mash: null,
	step_fermentation: null,
	step_misc: null,
};

export default schema;