'use strict';

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
	res.send(req.body);
})

const server = app.listen(9000, () => {
	let port = server.address().port;
	console.log(`Server is running at http://localhost:${port}`);
});
