'use strict';

// Module dependencies.
var Utils=require('./lib/common/Utils/Utils.js');
var express = require('express');

var app = express();


// Express Configuration
require('./lib/config/express')(app);

// Controllers
var index = require('./lib/controllers');

// Server Routes

// Angular Routes
app.get('/partials/*', index.partials);
app.get('/',Utils.ensureAuthenticated, function(req,res){
    if( req.session.userDetails)
        res.redirect('/index');
    else{
        res.render('login');
    }
});
app.get('/index',Utils.ensureAuthenticated, function(req,res){
    res.render('index');
});
require('./lib/login/controllers/loginCtrl.js')(app,Utils);
require('./lib/manageUsers/controllers/createUser.js')(app,Utils);
require('./lib/manageUsers/controllers/userProfileServer.js')(app,Utils);
require('./lib/manageUsers/controllers/manageUserServer.js')(app,Utils);
require('./lib/manageOrg/controllers/createOrg.js')(app);
require('./lib/manageAttendence/controllers/createAttendence.js')(app,Utils);
require('./lib/manageLibrary/controllers/libraryServerController.js')(app,Utils);
require('./lib/common/controllerUtil.js')(app,Utils);

process.on('uncaughtException', function (err) {
    console.error('uncaughtException:', err.message)
    console.error(err.stack)
    process.exit(1)})
// Start server
var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Express server listening on port %d in %s mode', port, app.get('env'));
});

// Expose app
//exports = module.exports = app;