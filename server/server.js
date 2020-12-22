'use strict';
require('dotenv').config({path: './mongodb.env'});
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});

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
	id: String,
	information: information,
	fermentables: [fermentables],
	hops: [hops],
	yeast: [yeast],
	misc: [misc],
	step_mash: [step_mash],
	step_misc: [step_misc]
});

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const dist = path.resolve(__dirname + "/../dist");

app.use('/static', express.static(dist + '/public'));
let ue = bodyParser.json();
app.use(ue);

app.get('/', (req, res) => {
	res.sendFile(dist + '/index.html');
});

app.get('/edit', (req, res) => {
	res.sendFile(dist + '/edit.html');
});

let Brew = mongoose.model("Brew", brewSchema);

app.get('/api/fetch', (req, res) => {
	if (!req.query.id) {
		let ret = {
			success: false,
			message: "No ID supplied.",
			data: null
		};
		res.send(ret);
	} else {
		Brew.findById(req.query.id, (err, data) => {
			if (err) {
				console.log("ERROR: could not retrieve data.");
				console.log("ID: " + req.query.id);
				console.log("Data:");
				let ret = {
					success: false,
					message: "Invalid ID supplied.",
					data: null
				};
				res.send(ret);
			} else {
				console.log("SUCCESS: retrieved ID: " + req.query.id);
				console.log("Data:");
				console.log(data);
				let ret = {
					success: true,
					message: "Data retrieved.",
					data: data
				};
				res.send(ret);
			}
		});
	}
});

app.post('/api/save', (req, res) => {
	console.log(req.body);
	if (!req.body.id) {
		let brew = new Brew(req.body);
		brew.save((err, data) => {
			if (err) {
				console.log("ERROR: could not save data.")
				let ret = {
					success: false,
					message: err,
					data: null
				};
				res.send(ret);
			} else {
				console.log("Saved new data.");
				console.log("New ID: " + data._id);
				console.log("Data:")
				console.log(data);
				let ret = {
					success: true,
					message: "Data saved",
					data: data
				};
				res.send(ret);
			}	
		})
	} else {
		Brew.findByIdAndUpdate(req.body.id, req.body, (err, data) => {
			if (err) {
				console.log("ERROR: could not update data.");
				console.log("ID: " + req.body.id);
				console.log("Data:");
				console.log(req.body);
				let ret = {
					success: false,
					message: err,
					data: null
				};
				res.send(ret);
			} else {
				console.log("Updating data.");
				console.log("ID: " + req.body.id);
				console.log("Data:");
				console.log(data);
				let ret = {
					success: true,
					message: "Data saved",
					data: data
				};
				res.send(ret);
			}
		});
	}
});

const server = app.listen(9000, () => {
	let port = server.address().port;
	console.log(`Server is running at http://localhost:${port}`);
});
