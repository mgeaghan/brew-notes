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

// Callbacks
const listFetch = (user, num, page, res, req) => {
	return (err, data) => {
		if (err) {
			console.log("ERROR: could not retrieve list.");
			console.log("User ID: " + user);
			console.log("Number of records requested: " + num);
			console.log("Page requested: " + page);
			let ret = {
				success: false,
				message: "Error in retrieving data.",
				user_id: null,
				num_req: num,
				num_ret: null,
				page: null,
				data: null
			};
			res.send(ret);
		} else {
			let num_retrieved = data.length;
			console.log("SUCCESS: retrieved list.");
			console.log("User ID: " + user);
			console.log("Number of records requested: " + num);
			console.log("Page requested: " + page);
			let ret = {
				success: true,
				message: "Succesfully retrieved list of brews.",
				user_id: user,
				num_req: num,
				num_ret: num_retrieved,
				page: page,
				data: data
			};
			res.send(ret);
		}
	};
};

const listCount = (user, res, req) => {
	return (err, count) => {
		if (err) {
			console.log("ERROR: could not retrieve count.");
			console.log("User ID: " + user);
			let ret = {
				success: false,
				message: "Error in retrieving count.",
				user_id: null,
				count: null
			};
			res.send(ret);
		} else {
			console.log("SUCCESS: retrieved list.");
			console.log("User ID: " + user);
			let ret = {
				success: true,
				message: "Succesfully retrieved count.",
				user_id: user,
				count: count
			};
			res.send(ret);
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

app.get('/register', redirectIfLoggedIn('/home'), (req, res) => {
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

app.get('/logout', connectEnsureLogin.ensureLoggedIn('/login'), (req, res) => {
	req.logout();
	return res.sendFile(dist + '/logout.html');
	// return res.redirect('/');
});

app.get('/home', connectEnsureLogin.ensureLoggedIn('/login'), (req, res) => {
	res.sendFile(dist + '/home.html');
});

app.get('/api/list/fetch', connectEnsureLogin.ensureLoggedIn('/login'), (req, res) => {
	let user_id = !!req.query.user ? req.query.user : req.user._id;
	let num_records = 10;
	let page_num = 0;
	if (req.query.num) {
		let n = parseInt(req.query.num);
		if (Number.isInteger(n)) {
			num_records = n;
		}
	}
	if (req.query.page) {
		let p = parseInt(req.query.page);
		if (Number.isInteger(p)) {
			page_num = p;
		}
	}
	if (user_id === 'any') {  // change this so the logged-in user can see their private brews as well
		Brew.find({ $or: [{ 'data.user_id': req.user._id }, { 'data.private': false }] }, 'data', { skip: (num_records * page_num), limit: num_records }, listFetch(user_id, num_records, page_num, res, req));
	} else {
		Brew.find({ 'data.user_id': user_id, $or: [{ 'data.user_id': req.user._id }, { 'data.private': false }] }, 'data', { skip: (num_records * page_num), limit: num_records }, listFetch(user_id, num_records, page_num, res, req));
	}
});

app.get('/api/list/count', connectEnsureLogin.ensureLoggedIn('/login'), (req, res) => {
	let user_id = !!req.query.user ? req.query.user : req.user._id;
	if (user_id === 'any') {  // change this so the logged-in user can see their private brews as well
		Brew.countDocuments({ $or: [{ 'data.user_id': req.user._id }, { 'data.private': false }] }, listCount(user_id, res, req));
	} else {
		Brew.countDocuments({ 'data.user_id': user_id, $or: [{ 'data.user_id': req.user._id }, { 'data.private': false }] }, listCount(user_id, res, req));
	}
})

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

// Catch-all route
app.get('/*', connectEnsureLogin.ensureLoggedIn('/login'), (req, res) => {
	res.sendFile(dist + '/home.html');
});

// Listen
const port = process.env.PORT || 9000;
const server = app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});
