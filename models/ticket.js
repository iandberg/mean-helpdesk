var mongoose = require('mongoose');

// define schema
var ticketSchema = mongoose.Schema({
    title: { 
        type: String
    },
    description: { 
        type: String
    },
    created_on: { 
        type: Date,
        default: Date.now
    },
    author: { 
        type: String
    },
    client: { 
        type: String
    },
    urgency: { 
        type: String
    },
    status: { 
        type: String,
        default: 'Unsolved'
    },
    assigned: { 
        type: String
    },
    comments: [{
        comment_body:{
            type: String
        },
        comment_author:{
            type: String
        },
        comment_date:{
            type: Date,
            default: Date.now
        },
    }]
});

// add methods to schema
ticketSchema.methods.showTitle = function () {
    var message = this.title 
        ? "ticket title: " + this.title 
        : "no title";
    console.log(message);
}

ticketSchema.virtual('full').get(function () { //define a getter function, to customize output
    return 'this ticket title is ' + this.title;
});


module.exports = mongoose.model('Ticket', ticketSchema);

// or add methods here to module.exports, for use in app.js
// example
// module.exports.getSomething = function blah
// in app.js:
// var ticket = require('./models/ticket');
// ticket.getSomething()