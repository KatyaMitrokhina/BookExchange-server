var mongoose = require('mongoose');
var config = require('./config.js');

var DB_NAME = "book-exchange";
var DB_USERNAME = "book-exchange-admin";
var DB_PASSWORD = "book-1234";

mongoose.connect('mongodb://'+ config.get('DB_USER') + ':' + config.get('DB_PASSWORD') + '@localhost/' + config.get('DB_NAME'));
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function callback () {
    console.log("Connected to database '" + DB_NAME + "'!");
});

var Schema = mongoose.Schema;

// Schemas
var Owner = new mongoose.Schema({
    name: { type: String, required: true },
    city: { type: String, required: true },
    phone: { type: String, required: true },
    vkUrl: { type: String, required: false }
});

var Book = new mongoose.Schema({
    // _id: { type: String, required: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String, required: true },
    pictureUrl: { type: String, required: true },
    bookOwner: [Owner],
    modified: { type: Date, default: Date.now }
});

var BookModel = mongoose.model('Book', Book);

module.exports.BookModel = BookModel;
