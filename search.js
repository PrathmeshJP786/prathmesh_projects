var express = require('express');
var bodyParser = require('body-parser');
var couchbase = require('couchbase');
var DataModel = require("./models").DataModel;
var N1qlQuery = require("couchbase").N1qlQuery;

var app = express();
var cluster = new couchbase.Cluster("127.0.0.1");
cluster.authenticate('prathmesh786', 'Qwerty123');
var bucket = cluster.openBucket("example", function(err){
	if(err){
		console.log(err);
	}
	console.log("Connected to the server...");
});

var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.get("/products",urlencodedParser ,function(req, res){
	var seacrh = {
			search_item: req.body.search_item
	};
	/*var query = N1qlQuery.fromString('SELECT * FROM example WHERE lot_number = "Tom" ');
	bucket.query(query, function(err, rows) {
	  if(err){
		  console.log(err);
	  }
	  console.log(rows);
	});*/
	console.log(req.body);
	res.sendFile(__dirname + '/products.html');
});


app.listen(4000, '127.0.0.1');


console.log('Server running at http://127.0.0.1:4000/ Hello');