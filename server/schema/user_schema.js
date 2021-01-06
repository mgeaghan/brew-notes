const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
	username: String,
	password: String
});

userSchema.plugin(passportLocalMongoose);
const UserDetails = mongoose.model('userInfo', userSchema, 'userInfo');

module.exports = UserDetails;
