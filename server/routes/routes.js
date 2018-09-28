var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const db = require('../database/constants');

// Check API status
router.get('/healthcheck', function (req, res) {
	res.send('OK!');
});


// Accounts API: GET specific account
router.get('/accounts/:name', function (req, res) {
	console.log(`GET request made to /accounts:${req.params.name}`);

	const connection = mysql.createConnection({
		host     : db.HOST,
		user     : db.USER,
		password : db.PASSWORD,
		database : db.DATABASE
		  });

		  // Establish connection
		  connection.connect(function(err) {
		if (err) {
			console.error('error connecting to DB: ' + err.stack);
			return;
		}
	});

	// Perform Query
	connection.query(`SELECT * FROM explorer.accounts WHERE account_name = '${req.params.name}'`, function (err, rows, fields) {
		if (err) throw err;
		  
		res.send(rows);
		  });

	// Close connection
	connection.end();
});

// Accounts API: GET accounts
router.get('/accounts', function (req, res) {
	console.log('GET request made to /accounts');

	const connection = mysql.createConnection({
		host     : db.HOST,
		user     : db.USER,
		password : db.PASSWORD,
		database : db.DATABASE
		  });

		  // Establish connection
		  connection.connect(function(err) {
		if (err) {
			console.error('error connecting to DB: ' + err.stack);
			return;
		}
	});

	// Perform Query
	connection.query('SELECT * FROM explorer.accounts', function (err, rows, fields) {
		if (err) throw err;
		  
		res.send(rows);
		  });

	// Close connection
	connection.end();
});

// Accounts API: GET specific witness
router.get('/accounts/:name', function (req, res) {
	console.log(`GET request made to /accounts:${req.params.name}`);

	const connection = mysql.createConnection({
		host     : db.HOST,
		user     : db.USER,
		password : db.PASSWORD,
		database : db.DATABASE
		  });

		  // Establish connection
		  connection.connect(function(err) {
		if (err) {
			console.error('error connecting to DB: ' + err.stack);
			return;
		}
	});

	// Perform Query
	connection.query(`SELECT * FROM explorer.accounts WHERE account_name = '${req.params.name}'`, function (err, rows, fields) {
		if (err) throw err;
		  
		res.send(rows);
		  });

	// Close connection
	connection.end();
});


// Witness API: GET witnesses
router.get('/witnesses', function (req, res) {
	console.log('GET request made to /witnesses');

	const connection = mysql.createConnection({
		host     : db.HOST,
		user     : db.USER,
		password : db.PASSWORD,
		database : db.DATABASE
		  });

		  // Establish connection
		  connection.connect(function(err) {
		if (err) {
			console.error('error connecting to DB: ' + err.stack);
			return;
		}
	});

	// Perform Query
	connection.query('SELECT * FROM explorer.witnesses', function (err, rows, fields) {
		if (err) throw err;
		  
		res.send(rows);
		  });

	// Close connection
	connection.end();
});


// Variables API: GET variables
router.get('/variables', function (req, res) {
	console.log('GET request made to /variables');

	const connection = mysql.createConnection({
		host     : db.HOST,
		user     : db.USER,
		password : db.PASSWORD,
		database : db.DATABASE
		  });

		  // Establish connection
		  connection.connect(function(err) {
		if (err) {
			console.error('error connecting to DB: ' + err.stack);
			return;
		}
	});

	// Perform Query
	connection.query('SELECT * FROM explorer.variables', function (err, rows, fields) {
		if (err) throw err;
		  
		res.send(rows);
		  });

	// Close connection
	connection.end();
});




module.exports = router;