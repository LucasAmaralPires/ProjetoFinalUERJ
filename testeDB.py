import MySQLdb

db = MySQLdb.connect("localhost", "root", "senha200", "Gaed")
curs=db.cursor()

curs.execute("select * from Pessoa")

for reading in curs.fetchall():
    print str(reading[0])+" "+str(reading[1])+"	"+ str(reading[2])


db.close()
