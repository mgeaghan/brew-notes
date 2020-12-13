'use strict';

const path = require('path');
const express = require('express');
const app = express();

const dist = path.resolve(__dirname + "/../dist");

app.use('/static', express.static(dist + '/public'));

app.get('/', (req, res) => {
	res.sendFile(dist + '/index.html');
});

app.get('/edit', (req, res) => {
	res.sendFile(dist + '/edit.html');
});

const server = app.listen(9000, () => {
	let port = server.address().port;
	console.log(`Server is running at http://localhost:${port}`);
});
