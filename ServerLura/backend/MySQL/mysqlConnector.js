var config = require('./config.js');

module.exports = {
	execute: function(sql, callback){
		con = config.makeConnection();
		con.connect(function(err) {
			if (err){
				console.log();
				throw err;
			}
			con.query(sql, function(erro, result, fields){
				if (erro) throw erro;
				console.log("realizado a seguinte query:");
				console.log("[" + sql + "]");
				console.log("Com a seguinte resposta:");
				console.log(result)
				console.log("===END TRANSACTION===\n");
				con.end();
				return callback(result);
			});
		});
	},
	executeMass: function(listSql, callback){
		con = config.makeConnection();
        con.connect(function(err) {
            if (err){
                console.log();
                throw err;
            }
			for(i = 0; i<listSql.length ;i++){
					con.query(listSql[i], function(erro, result, fields){
					if (erro) throw erro;
					console.log("realizado a seguinte query:");
					console.log("[" + listSql[i] + "]");
					console.log("Com a seguinte resposta:");
					console.log(result)
					console.log("===END TRANSACTION===\n");
					return callback(result);
				});
			}
			con.end();
        });
	}
};
