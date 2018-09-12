var express = require('express');
var bodyParser = require('body-parser');
var couchbase = require('couchbase');
var DataModel = require("./models").DataModel;
var N1qlQuery = require("couchbase").N1qlQuery;
var fs = require('fs');
var path = require('path');
var app = express();

//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var cluster = new couchbase.Cluster("127.0.0.1");
cluster.authenticate('prathmesh786', 'Qwerty123');
var bucket = cluster.openBucket("example", function(err){
	if(err){
		console.log(err);
	}
	console.log("Connected to the server...");
});

var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.get('/index', function(req, res) {
    res.render('index');
});

app.post('/success', urlencodedParser, function(req, res){
	var data1 = {
			lot_number: req.body.lot_number,
			product_number: req.body.product_number,
			pdfFile: req.body.pdfFile,
			timestamp: (new Date())
	};
	bucket.insert(data1.lot_number, data1, function(error, result){
		if(error){
			fs.readFile('error-insertion.html', function(err, data) {
			    res.writeHead(200, {'Content-Type': 'text/html'});
			    res.write(data);
			    return res.end();
			});
		}
		else{
			fs.readFile('success.html', function(err, data) {
			    res.writeHead(200, {'Content-Type': 'text/html'});
			    res.write(data);
			    return res.end();
			});
		}
	});	
});

app.get("/search-result", function(req, res){
	var person1 = [], i = 0;
	var key = JSON.stringify(req.query.search_item);
	var query = N1qlQuery.fromString('SELECT * FROM example WHERE lot_number = '+key);
	bucket.query(query, function(err, rows) {
	  if(err){
		  console.log(err);
	  }
	  
	  for(i = 0; i < rows.length; i++){
		  person1[i] = rows[i].example;	  
	  }
	  
	  res.render('search-result', { person: person1 });
	});
});

app.get('/all-records', function(req, res){
	var person1 = [], i;
	var query = N1qlQuery.fromString('SELECT DISTINCT * FROM example');
	bucket.query(query, function(err, rows) {
	  if(err){
		  console.log(err);
	  }
	  for(i = 0; i < rows.length; i++){
		  person1[i] = rows[i].example;
	  }
	  res.render('all-records', { person: person1 });
	});
});


/*app.get("/get-products", function(req, res){
	var person1 = [], i;
	var query = N1qlQuery.fromString('SELECT * FROM example');
	bucket.query(query, function(err, rows) {
	  if(err){
		  console.log(err);
	  }
	  for(i = 0; i < rows.length; i++){
		  person1[i] = rows[i].example;
	  }
	  res.render('get-data', { person: person1 });
	  
	});
});*/

app.listen(3000, '127.0.0.1');


console.log('Server running at http://127.0.0.1:3000/ Hello');
