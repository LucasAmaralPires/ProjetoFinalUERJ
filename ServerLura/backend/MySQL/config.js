var mysql = require('mysql');

module.exports = {
	makeConnection: function() {
		configObject = {
		host: "localhost",
		user: "root",
		password: "senha200",
		database: "Lura"
		};
		console.log("===BEGIN TRANSACTION===");
		console.log("Conectando MySQL na database " + configObject.database);
		return mysql.createConnection(configObject);
	}
}
