var logger = require('morgan');
var bodyParser = require('body-parser');

var express = require('express');
var path = require('path');
var app = express();

var config = require('./app/config.js');
var BookModel = require('./app/mongoose.js').BookModel;

app.use(logger('dev'));                 //Логгер
app.use(bodyParser());
//app.use(app.router);

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});



app.get('/api', function (req, res) {
    res.send('API is running');
});

app.get('/api/books', function(request, response) {
    return BookModel.find(function (err, books) {
        if (!err) {
            response.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
            return response.send(books);
        } else {
            response.statusCode = 500;
            console.log('Internal error(%d): %s', response.statusCode,err.message);
            return response.send({ error: 'Server error' });
        }
    });
});

app.post('/api/books', function(request, response) {
    var book = new BookModel({
        title: request.body.title,
        author: request.body.author,
        genre: request.body.genre,
        description: request.body.description,
        pictureUrl: request.body.pictureUrl,
        images: request.body.images,
        bookOwner: request.body.bookOwner
    });
    response.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    book.save(function (err) {
        if (!err) {
            console.log("Book added to database.");
            return response.send({ status: 'OK', book: book });
        } else {
            console.log(err);
            response.statusCode = 500;
            response.send({ error: 'Server error' });
            response.request = request;
            console.log('Internal error(%d): %s',response.statusCode,err.message);
        }
    });
});

app.get('/api/books/:id', function(request, response) {
    response.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    return BookModel.findById(request.params.id, function (err, book) {
        if(!book) {
            response.statusCode = 404;
            return response.send({ error: 'Not found' });
        }
        if (!err) {
            return response.send({ status: 'OK', book: book });
        } else {
            response.statusCode = 500;
            console.log('Internal error(%d): %s', response.statusCode, err.message);
            return response.send({ error: 'Server error' });
        }
    });
});

app.listen(config.get('PORT'), function(){
    console.log('Server started. Listening on port: ' + config.get('PORT'));
});