'use strict';

// Express setup
const express = require('express');
const app = express();
const path = require('path');
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const expressSession = require('express-session')({
	secret: process.env.SECRET,
	resave: false,
	saveUninitialized: false
});

const dist = path.resolve(__dirname + "/../dist");
app.use('/static', express.static(dist + '/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSession);

// Passport setup
const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

// Mongoose setup
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
const Brew = require('./schema/brew_schema');
const UserDetails = require('./schema/user_schema');
// let Brew = mongoose.model("Brew", brewSchema);
// const passportLocalMongoose = require('passport-local-mongoose');

// Passport Local Authentication
passport.use(UserDetails.createStrategy());
passport.serializeUser(UserDetails.serializeUser());
passport.deserializeUser(UserDetails.deserializeUser());

// Middleware
const connectEnsureLogin = require('connect-ensure-login');
const redirectIfLoggedIn = (route) => {
	return (req, res, next) => {
		if (req.user) {
			return res.redirect(route);
		} else {
			return next();
		}
	};
};

// Routes
app.get('/', (req, res) => {
	res.sendFile(dist + '/index.html');
});

app.get('/login', (req, res) => {
	res.sendFile(dist + '/login.html');
})

app.post('/login', (req, res, next) => {
	passport.authenticate('local', (err, user, info) => {
		if (err) {
			return next(err);
		}

		if (!user) {
			return res.redirect('/login?info=' + info);
		}

		req.login(user, (err) => {
			if (err) {
				return next(err);
			}

			return res.redirect('/');
		});
	})(req, res, next);
});

app.get('/register', redirectIfLoggedIn('/login'), (req, res) => {
	res.sendFile(dist + '/register.html');
});

app.post('/register', (req, res) => {
	UserDetails.register({
		username: req.body.username,
		active: false
	}, req.body.password, (err, user) => {
		if (err) {
			return res.redirect('/register?info=' + err.name + ": " + err.message);
		}

		return res.redirect('/login');
	});
});

app.post('/logout', connectEnsureLogin.ensureLoggedIn('/login'), (req, res) => {
	req.logout();
	return res.redirect('/');
});

app.get('/edit', connectEnsureLogin.ensureLoggedIn('/login'), (req, res) => {
	res.sendFile(dist + '/edit.html');
});

app.get('/api/fetch', connectEnsureLogin.ensureLoggedIn('/login'), (req, res) => {
	if (!req.query.id) {
		console.log("ERROR: no ID supplied.");
		let ret = {
			success: false,
			message: "No ID supplied.",
			id: null,
			data: null
		};
		res.send(ret);
	} else {
		Brew.findById(req.query.id, (err, data) => {
			if (err) {
				console.log("ERROR: could not retrieve data.");
				console.log("ID: " + req.query.id);
				let ret = {
					success: false,
					message: "Invalid ID supplied.",
					id: null,
					data: null
				};
				res.send(ret);
			} else if (!data || !data.data.toObject().hasOwnProperty("private")) {
				console.log("ERROR: invalid data retrieved.");
				console.log("ID: " + req.query.id);
				console.log("Data:");
				console.log(data);
				let ret = {
					success: false,
					message: "Invalid data retrieved.",
					id: null,
					data: null
				};
				res.send(ret);
			} else if (!data.data.private || data.data.user_id == req.user._id) {
				console.log("SUCCESS: retrieved data.");
				console.log("ID: " + req.query.id);
				console.log("Data:");
				console.log(data);
				let ret = {
					success: true,
					message: "Data retrieved.",
					id: data._id,
					data: data.data
				};
				res.send(ret);
			} else {
				console.log("ERROR: unauthorised access attempt.");
				console.log("ID: " + req.query.id);
				console.log("Requesting user ID: " + req.user._id);
				console.log("Owner user ID: " + data.data.user_id);
				console.log("Privacy: " + data.data.private);
				let ret = {
					success: false,
					message: "Unauthorised access attempt.",
					id: null,
					data: null
				};
				res.send(ret);
			}
		});
	}
});

app.post('/api/save', connectEnsureLogin.ensureLoggedIn('/login'), (req, res) => {
	let new_data = Object.assign({}, req.body);
	new_data.data.user_id = req.user._id;
	if ((!req.body.hasOwnProperty("id")) || (!req.body.id) || (req.body.data.user_id != req.user._id)) {
		let brew = new Brew(new_data);
		brew.save((err, data) => {
			if (err) {
				console.log("ERROR: could not save data.");
				console.log("ID: " + req.body.id);
				let ret = {
					success: false,
					message: err,
					id: null,
					data: null
				};
				res.send(ret);
			} else {
				console.log("SUCCESS: saved new data.");
				console.log("New ID: " + data._id);
				console.log("Data:")
				console.log(data);
				let ret = {
					success: true,
					message: "Data saved",
					id: data._id,
					data: data.data
				};
				res.send(ret);
			}	
		})
	} else {
		Brew.findByIdAndUpdate(req.body.id, new_data, (err, data) => {
			if (err) {
				console.log("ERROR: could not update data.");
				console.log("ID: " + req.body.id);
				console.log("Data:");
				console.log(new_data);
				let ret = {
					success: false,
					message: err,
					id: null,
					data: null
				};
				res.send(ret);
			} else {
				console.log("SUCCESS: updating data.");
				console.log("ID: " + req.body.id);
				console.log("Data:");
				console.log(data);
				let ret = {
					success: true,
					message: "Data updated",
					id: data._id,
					data: data.data
				};
				res.send(ret);
			}
		});
	}
});

app.post('/api/delete', connectEnsureLogin.ensureLoggedIn('/login'), (req, res) => {
	if (!req.body.id) {
		console.log("ERROR: no ID supplied.");
		let ret = {
			success: false,
			message: "No ID supplied.",
			id: null,
			data: null
		};
		res.send(ret);
	} else {
		Brew.findOneAndDelete({ _id: req.body.id, 'data.user_id': req.user._id }, (err, data) => {
			if (err) {
				console.log("ERROR: could not retrieve data or unauthorised access attempted.");
				console.log("ID: " + req.body.id);
				console.log("User ID: " + req.user._id);
				let ret = {
					success: false,
					message: "Invalid ID supplied or unauthorised access attempted.",
					id: null,
					data: null
				};
				res.send(ret);
			} else if (!data) {
				console.log("ERROR: could not retrieve data.");
				console.log("ID: " + req.body.id);
				let ret = {
					success: true,
					message: "Invalid ID supplied.",
					id: req.body.id,
					data: null
				};
				res.send(ret);
			} else {
				console.log("SUCCESS: deleted data");
				console.log("ID: " + req.body.id);
				console.log("User ID: " + req.user._id);
				console.log("Data:");
				console.log(data);
				let ret = {
					success: true,
					message: "Data successfully deleted.",
					id: req.body.id,
					data: data.hasOwnProperty("data") ? data.data : null
				};
				res.send(ret);
			}
		});
	}
});

// Listen
const port = process.env.PORT || 9000;
const server = app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});
