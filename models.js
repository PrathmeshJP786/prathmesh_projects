var uuid = require("uuid");
var N1qlQuery = require("couchbase").N1qlQuery;
var bucket = require("./app").bucket;

function Datamodel(){
	Datamodel.getAll = function(callback){
		var statement = "SELECT " +
						"META(person).lotNumber, person.productNumber, person.fileName" +
						"(SELECT timestamp, message FROM `" + bucket._name + "` USE KEYS person.lotNumber) AS comments" +
						"FROM `" + bucket._name + "` AS person";
			
			var query = N1qlQuery.fromString(statement);
			bucket.query(query, function(error, result){
				if(error){
					console.log(error);
					return callback(error, null);
				}
				callback(null, result);
			});
	};
}

Datamodel.save = function(data, callback){
	var person = {
			lotNumber: data.lotNumber,
			productNumber: data.productNumber,
			pdfFile: data.pdfFile,
			timestamp: (new Date())
	}
	
	var id = data.id ? data.id : uuid.v4();
	bucket.upsert(id, person, function(error, result){
		if(error){
			console.log(error);
			return callback(error, null);
		}
		callback(null, result);
	});
}

function SearchModel(){

}

module.exports.Datamodel = Datamodel;
module.exports.SearchModel = SearchModel;