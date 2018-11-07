var config = require('./config.js');

module.exports = {
	execute: function(sql, callback){
		con = config.makeConnection();
		con.connect(function(err) {
			if (err) throw err;
			con.query(sql, function(erro, result, fields){
				if (erro) throw error;
				console.log("realizado a seguinte query: '" + sql + "' com a seguinte resposta:");
				console.log(result)
				console.log("===END TRANSACTION===");
				con.end();
				return callback(result);
			});
		});
	}
};
