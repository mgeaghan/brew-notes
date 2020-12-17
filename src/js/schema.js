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
			label: "Weight Units"
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
			label: "Colour Units"
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
	misc: {
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
			options: ["g", "kg", "mL", "L", "each"],
			default: "g",
			label: "Units"
		},
		use: {
			type: "select",
			options: ["boil", "flame-out", "dry-hop", "primary", "secondary", "bottle/keg"],
			default: "boil",
			label: "Use"
		},
		notes: {
			type: "textarea",
			options: null,
			default: "",
			label: "Additional notes"
		}
	},
	step_mash: {
		type: {
			type: "select",
			options: ["infusion", "decoction"],
			default: "infusion",
			label: "Step type"
		},
		temperature: {
			type: "number",
			options: null,
			default: 67,
			label: "Temperature (C)"
		},
		time: {
			type: "number",
			options: null,
			default: 60,
			label: "Time (mins)"
		},
	},
	step_misc: {
		notes: {
			type: "textarea",
			options: null,
			default: "",
			label: null
		}
	}
};

export default schema;