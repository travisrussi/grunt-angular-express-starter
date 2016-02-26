//var path = require('path');

exports.index = function(req, res){
  //res.send({ title: 'index route' });
  //res.sendfile(path.join(__dirname, '../..', 'app') + '/index.html');
  //res.render(path.join(__dirname, '../..', 'app') + '/index.html', {data: '123'});

  res.render('index', { data: 'Go away!' });
};
