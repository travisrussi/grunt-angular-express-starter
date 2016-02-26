var express = require('express')
  , http = require('http')
  , path = require('path')
  , parseExpressCookieSession = require('parse-express-cookie-session')
  , parseExpressHttpsRedirect = require('parse-express-https-redirect')
  , routeIndex = require('cloud/server/routes/index')
  , routeSecurity = require('cloud/server/routes/security')
  , routeEmployee = require('cloud/server/routes/employee');

var app = express();

if (process && process.env) {
  app.set('port', process.env.PORT || 9000);
}

app.set('views', 'cloud/pages');  // Specify the folder to find templates
app.set('view engine', 'ejs');    // Set the template engine
app.use(express.bodyParser());    // Middleware for reading request body
app.use(express.methodOverride());

app.use(express.cookieParser('bob1234'));
app.use(express.cookieSession());
app.use(parseExpressCookieSession({ cookie: { maxAge: 3600000 } }));
app.use(parseExpressHttpsRedirect());

// development only
if ('development' == app.get('env')) {
  //app.use(express.logger('dev'));
  //app.use(express.errorHandler());

  app.use('/components', express.static(path.join(__dirname, '..', 'public') + '/components'));
  app.use('/scripts', express.static(path.join(__dirname, '..', 'public') + '/scripts'));
  app.use('/styles', express.static(path.join(__dirname, '..', 'public') + '/styles'));
  app.use('/views', express.static(path.join(__dirname, '..', 'public') + '/views'));
} else {

  //app.use('/components', express.static('/components'));
  //app.use('/scripts', express.static('/scripts'));
  //app.use('/styles', express.static('/styles'));
  //app.use('/views', express.static('/views'));
}

//app.get('/', function(req, res){
//  res.render('public', { data: 'Go away!' });
//});

app.get('/admin', isAuthenticated, function(req, res){
  res.render('admin', { data: 'Go away!' });
});


app.get('/', routeIndex.index);

app.get('/login', routeSecurity.loginGet);
app.post('/login', routeSecurity.loginPost);
app.get('/logout', routeSecurity.logoutGet);
app.get('/register', routeSecurity.registerGet);
app.post('/register', routeSecurity.registerPost);

app.get('/employees', routeEmployee.findAll);
app.get('/employees/:id', isAuthenticated, routeEmployee.findById);

app.listen();

//http.createServer(app).listen(app.get('port'), function(){
//  console.log('Express server listening on port ' + app.get('port') + ' in ' + app.get('env') + ' mode');
//});

function isAuthenticated(req, res, next) {

  //console.log('Parse.User: ' + JSON.stringify(Parse.User));
  //console.log('Parse.Session: ' + JSON.stringify(Parse.Session));
  //console.log('req.user: ' + JSON.stringify(req.user));
  //console.log('req.session: ' + JSON.stringify(req.session));
  //console.log('req: ' + JSON.stringify(req));

  // do any checks you want to in here

  // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
  // you can do this however you want with whatever variables you set up
  var currentUser = Parse.User.current();
  if (currentUser && currentUser.authenticated)
    return next();

  // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
  res.redirect('/login');
}
