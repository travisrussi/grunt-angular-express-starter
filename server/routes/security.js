

exports.loginGet = function(req, res){
  res.render('login', { error: null });
};

exports.loginPost = function(req, res){

  Parse.User.logIn(req.body.email, req.body.password).then(function(user) {
      // Login succeeded, redirect to homepage.
      // parseExpressCookieSession will automatically set cookie.
      console.log('Parse.User: ' + JSON.stringify(Parse.User));
      console.log('user: ' + JSON.stringify(user));
      console.log('Parse.User.current: ' + JSON.stringify(Parse.User.current()));

      res.redirect('/');
    },
    function(error) {
      // Login failed, redirect back to login form.
      //res.redirect("/login");
      res.render('login', { error: JSON.stringify(error) });
    });
};

exports.registerGet = function(req, res){
  res.render('login', { error: null });
};

exports.logoutGet = function(req, res){
  Parse.User.logOut();
  res.redirect('/');
};

exports.registerPost = function(req, res) {
  var parseUser = new Parse.User();
  parseUser.set("username", req.body.email);
  parseUser.set("email", req.body.email);
  parseUser.set("name", req.body.name);
  parseUser.set("password", req.body.password);

  parseUser.signUp(null, {
    success: function(user) {
      res.redirect('/employees/1');
    },
    error: function(user, error) {
      res.render('login', { error: JSON.stringify(error) });
    }
  });
};
