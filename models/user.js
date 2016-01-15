var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
	name: {
		first: String, 
		last: String
	},
	username: String,
	email: String,
	password: String,
	created_on: {
		type: Date, 
		default: Date.now
	}
});

userSchema.virtual('name.full').get(function () {
	return this.name.first + ' ' + this.name.last;
});

module.exports = mongoose.model('User', userSchema); //looks for the 'users' collection in the db