var DataModel = require("./models").DataModel;
var express = require("express");
var route = express.Router();

var app = require('./app.js');

route.get('/', function(req, res){
		res.sendFile(__dirname + '/index.html');
		DataModel.getAll(function(error, result){
			if(error){
				return res.status(400).send(error);
			}
			res.send(result);
		});
	});
	
route.get("/index:personId", function(req, res){
	
	});
	
route.post('/', function(req, res){
		res.sendFile(__dirname + '/index.html');
		DataModel.save(req.body, function(error, result) {
			if(error){
				return res.status(400).send(error);
			}
			res.send(result);
		});
	});
	
route.post("/fetchData", function(req, res){
	
	});


module.exports = route;