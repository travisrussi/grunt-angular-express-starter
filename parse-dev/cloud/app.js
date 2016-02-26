// These two lines are required to initialize Express.
var express = require('express');
var app = express();

// Global app configuration section
app.set('views', 'cloud/pages');  // Specify the folder to find templates
app.set('view engine', 'ejs');    // Set the template engine
app.use(express.bodyParser());    // Middleware for reading request body

// This is an example of hooking up a request handler with a specific request
// path and HTTP verb using the Express routing API.
app.get('/bye', function(req, res) {
  res.render('bye', { message: 'Go away!' });
});

// This line is required to make Express respond to http requests.
app.listen();
