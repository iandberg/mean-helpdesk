var mongoose = require('mongoose');

module.exports = function (url) {
	mongoose.connect(url);
	var db = mongoose.connection;

	db.on('error', console.error.bind(console, 'connection error:'));

	db.once('open', function () {
		console.log('database connected');    
	});
}
