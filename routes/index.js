var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
	//console.log("request is " + req.user.username);
	res.render('index', { title: "Ortho App"});
});

// serve angular front end files from root path
//router.use('/', express.static(path.join(__dirname, 'public'), { redirect: false }));
 
// rewrite virtual urls to angular app to enable refreshing of internal pages
router.get('/dashboard', function (req, res, next) {
    res.sendFile(path.resolve('public/index.html'));
});

router.get('/patient*', function (req, res, next) {
    res.sendFile(path.resolve('public/index.html'));
});

router.get('/addPatient', function (req, res, next) {
    res.sendFile(path.resolve('public/index.html'));
});

router.get('/calendar', function (req, res, next) {
    res.sendFile(path.resolve('public/index.html'));
});

router.get('/login', function (req, res, next) {
    res.sendFile(path.resolve('public/index.html'));
});

router.get('/register', function (req, res, next) {
    res.sendFile(path.resolve('public/index.html'));
});

module.exports = router;