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

app.post('/api', (req, res) => {
	console.log(req.body);
	let Brew = mongoose.model("Brew", brewSchema);
	let brew = new Brew(req.body);
	brew.save((err, data) => {
		if (err) return console.error(err);
		console.log("saved data: ");
		console.log(data);
	})
	res.send(req.body);
})

const server = app.listen(9000, () => {
	let port = server.address().port;
	console.log(`Server is running at http://localhost:${port}`);
});
