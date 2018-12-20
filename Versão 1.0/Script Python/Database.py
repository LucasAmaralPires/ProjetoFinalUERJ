import pymysql
class Database:
	
	def __init__(self):
		pass
	
	def connect(self):
		try:
			datab = pymysql.connect("localhost", "Lucas", "Cl:05101", "Lura")
			return datab
		except pymysql.DatabaseError:
			print("It wasn't possible to connect to the database")
			return False
	
	def disconnect(self,database):
		try:
			database.close()
		except pymysql.DatabaseError:
			pass
			
	def select_db(self, table):
		db = self.connect()
		if db != False:
			try:
				curs = db.cursor()
				curs.execute("select * from " + table)
				for reading in curs.fetchall():
					for i in reading:
						print (str(i) + "  ",end = "")
					print()
			except pymysql.DatabaseError:
				print("It wasn't possible to gather the data from table")
			self.disconnect(db)
				
	def insert_db(self,table,matriculation,ncard,name):
		db = self.connect()
		if db != False:
			try:
				curs = db.cursor()
				curs.execute("insert into " + table + " values(0,'" + str(matriculation) + "'," + str(ncard) + ",'" + str(name) + "', now())")
				db.commit()
			except pymysql.DatabaseError:
				db.rollback()
				print("It wasn't possible to insert the " + table[2:] + " in the table")
			self.disconnect(db)

	def delete_db_name(self,table,arg):
		db = self.connect()
		if db != False:
			try:
				curs = db.cursor()
				curs.execute("delete from " + table + " where TXT_NAME = '" + str(arg) + "'")
				db.commit()
			except pymysql.DatabaseError:
				db.rollback()
				print("It wasn't possible to delete the " + table[2:] + " from the table")
			self.disconnect(db)

	def delete_db_matriculation(self,table,arg):
		db = self.connect()
		if db != False:
			try:
				curs = db.cursor()
				curs.execute("delete from " + table + " where NUM_MATRICULATION = '" + str(arg) + "'")
				db.commit()
			except pymysql.DatabaseError:
				db.rollback()
				print("It wasn't possible to delete the " + table[2:] + " from the table")
			self.disconnect(db)

	def delete_db_card(self,table,arg):
		db = self.connect()
		if db != False:
			try:
				curs = db.cursor()
				curs.execute("delete from " + table + " where NUM_CARD = " + str(arg))
				db.commit()
			except pymysql.DatabaseError:
				db.rollback()
				print("It wasn't possible to delete the " + table[2:] + " from the table")
			self.disconnect(db)

	def update_db_name_name(self,table,new,old):
		db = self.connect()
		if db != False:
			try:
				curs = db.cursor()
				curs.execute("update " + table + " set TXT_NAME = '" + str(new) + "' where TXT_NAME = '" + str(old) + "'")
				db.commit()
			except pymysql.DatabaseError:
				db.rollback()
				print("It wasn't possible to update the " + table[2:] + " in the table")
			self.disconnect(db)

	def update_db_name_matriculation(self,table,new,old):
		db = self.connect()
		if db != False:
			try:
				curs = db.cursor()
				curs.execute("update " + table + " set TXT_NAME = '" + str(new) + "' where NUM_MATRICULATION = '" + str(old) + "'")
				db.commit()
			except pymysql.DatabaseError:
				db.rollback()
				print("It wasn't possible to update the " + table[2:] + " in the table")
			self.disconnect(db)


	def update_db_name_card(self,table,new,old):
		db = self.connect()
		if db != False:
			try:
				curs = db.cursor()
				curs.execute("update " + table + " set TXT_NAME = '" + str(new) + "' where NUM_CARD = " + str(old))
				db.commit()
			except pymysql.DatabaseError:
				db.rollback()
				print("It wasn't possible to update the " + table[2:] + " in the table")
			self.disconnect(db)
			
	def update_db_matriculation_matriculation(self,table,new,old):
		db = self.connect()
		if db != False:
			try:
				curs = db.cursor()
				curs.execute("update " + table + " set NUM_MATRICULATION = '" + str(new) + "' where NUM_MATRICULATION = '" + str(old) + "'")
				db.commit()
			except pymysql.DatabaseError:
				db.rollback()
				print("It wasn't possible to update the " + table[2:] + " in the table")
			self.disconnect(db)

	def update_db_matriculation_name(self,table,new,old):
		db = self.connect()
		if db != False:
			try:
				curs = db.cursor()
				curs.execute("update " + table + " set NUM_MATRICULATION = '" + str(new) + "' where TXT_NAME = '" + str(old) + "'")
				db.commit()
			except pymysql.DatabaseError:
				db.rollback()
				print("It wasn't possible to update the " + table[2:] + " in the table")
			self.disconnect(db)
			
	def update_db_matriculation_card(self,table,new,old):
		db = self.connect()
		if db != False:
			try:
				curs = db.cursor()
				curs.execute("update " + table + " set NUM_MATRICULATION = '" + str(new) + "' where NUM_CARD = " + str(old))
				db.commit()
			except pymysql.DatabaseError:
				db.rollback()
				print("It wasn't possible to update the " + table[2:] + " in the table")
			self.disconnect(db)

	def update_db_card_card(self,table,new,old):
		db = self.connect()
		if db != False:
			try:
				curs = db.cursor()
				curs.execute("update " + table + " set NUM_CARD = " + str(arg1) + " where NUM_CARD = " + str(arg2))
				db.commit()
			except pymysql.DatabaseError:
				db.rollback()
				print("It wasn't possible to update the " + table[2:] + " in the table")
			self.disconnect(db)
	
	def update_db_card_name(self,table,new,old):
		db = self.connect()
		if db != False:
			try:
				curs = db.cursor()
				curs.execute("update " + table + " set NUM_CARD = " + str(arg1) + " where TXT_NAME = '" + str(old) + "'")
				db.commit()
			except pymysql.DatabaseError:
				db.rollback()
				print("It wasn't possible to update the " + table[2:] + " in the table")
			self.disconnect(db)	
	
	def update_db_card_matriculation(self,table,new,old):
		db = self.connect()
		if db != False:
			try:
				curs = db.cursor()
				curs.execute("update " + table + " set NUM_CARD = " + str(arg1) + " where NUM_MATRICULATION = '" + str(old) + "'")
				db.commit()
			except pymysql.DatabaseError:
				db.rollback()
				print("It wasn't possible to update the " + table[2:] + " in the table")
			self.disconnect(db)

