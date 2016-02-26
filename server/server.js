var express = require('express')
  , http = require('http')
  , path = require('path')
  , parseExpressCookieSession = require('parse-express-cookie-session')
  , parseExpressHttpsRedirect = require('parse-express-https-redirect')
  , routeIndex = require('./routes/index')
  , routeEmployee = require('./routes/employee');

var app = express();

if (process && process.env) {
  app.set('port', process.env.PORT || 9000);
}

app.set('views', 'pages');  // Specify the folder to find templates
app.set('view engine', 'ejs');    // Set the template engine
app.use(express.bodyParser());    // Middleware for reading request body
app.use(express.methodOverride());

app.use(express.cookieParser('bob1234'));
app.use(express.cookieSession());
app.use(parseExpressCookieSession({ cookie: { maxAge: 3600000 } }));
app.use(parseExpressHttpsRedirect());


// development only
if ('development' == app.get('env') || true == true) {
  app.use(express.errorHandler());

  //app.use(express.static(path.join(__dirname, '..', 'app')));
  app.use('/components', express.static(path.join(__dirname, '..', 'app') + '/components'));
  app.use('/scripts', express.static(path.join(__dirname, '..', 'app') + '/scripts'));
  app.use('/styles', express.static(path.join(__dirname, '..', 'app') + '/styles'));
  app.use('/views', express.static(path.join(__dirname, '..', 'app') + '/views'));
} else {
  //app.use(express.static(path.join(__dirname, '..', 'dist')));
  app.use('/components', express.static(path.join(__dirname, '..', 'dist') + '/components'));
  app.use('/scripts', express.static(path.join(__dirname, '..', 'dist') + '/scripts'));
  app.use('/styles', express.static(path.join(__dirname, '..', 'dist') + '/styles'));
  app.use('/views', express.static(path.join(__dirname, '..', 'dist') + '/views'));
}

app.get('/', routeIndex.index);

app.get('/employees', routeEmployee.findAll);
app.get('/employees/:id', requireLogin, routeEmployee.findById);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port') + ' in ' + app.get('env') + ' mode');
});

function requireLogin(req, res, next) {
  if (req.session.loggedIn) {
    next(); // allow the next route to run
  } else {
    // require the user to log in
    res.redirect("/login"); // or render a form, etc.
  }
}
