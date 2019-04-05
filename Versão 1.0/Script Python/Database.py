import pymysql
class Database:
        
        def __init__(self):
                pass
        
        def connect(self):
                try:
                        datab = pymysql.connect("localhost", "root", "root", "Lura")
                        return datab
                except pymysql.DatabaseError:
                        print("It wasn't possible to connect to the database")
                        return False
        
        def disconnect(self,database):
                try:
                        database.close()
                except pymysql.DatabaseError:
                        pass

        def executeQuery(self, query, errorMsg)
                db = self.connect()
                if db != False:
                        try:
                                curs = db.cursor()
                                curs.execute(query)
                                for reading in curs.fetchall():
                                        for i in reading:
                                                print (str(i) + "  ",end = "")
                                        print()
                        except pymysql.DatabaseError:
                                print(errorMsg)
                        self.disconnect(db)

        def executeQueries(self, queries, errorMsg)
                db = self.connect()
                if db != False:
                        try:
                                curs = db.cursor()
                                for query in queries
                                        curs.execute(query)
                                        for reading in curs.fetchall():
                                                for i in reading:
                                                        print (str(i) + "  ",end = "")
                                                print()
                        except pymysql.DatabaseError:
                                print(errorMsg)
                        self.disconnect(db)

               
        def select_db(self, table):
                query = "select * from " + table
                errorMsg = "It wasn't possible to gather the data from table"
                executeQuery(self, query, errorMsg)
                                
        def insert_db(self,table,matriculation,ncard,name):
                query = "insert into " + table + " values(0,'" + str(matriculation) + "'," + str(ncard) + ",'" + str(name) + "', now())"
                errorMsg = "It wasn't possible to insert the " + table[2:] + " in the table"
                executeQuery(self, query, errorMsg)
                
        def delete_db_name(self,table,arg):
                query = "delete from " + table + " where TXT_NAME = '" + str(arg) + "'"
                errorMsg = "It wasn't possible to delete the " + table[2:] + " from the table"
                executeQuery(self, query, errorMsg)
                
        def validate_teacher(self,classroom,value):
                str_select = "select l.ID, l.DAT_DAY_OF_LECTURE, sc.ID_CLASS, te.NUM_CARD, te.NUM_MATRICULATION,s.DAT_END "
                str_from = "from T_LECTURE l, T_SCHEDULE_CLASS sc, T_SCHEDULE s, T_TEACHER_CLASS tc, T_TEACHER te, T_CLASSROOM c, T_CLASSROOM_CLASS cc "
                str_where = "where TIME(NOW()) < TIME(s.DAT_END) AND DATE(NOW()) = DATE(l.DAT_DAY_OF_LECTURE) AND l.ID_SCHEDULE_CLASS = sc.ID AND cc.ID_CLASSROOM = c.ID AND cc.ID_CLASS = sc.ID_CLASS AND sc.ID_SCHEDULE = s.ID AND tc.ID_CLASS = sc.ID_CLASS AND tc.ID_TEACHER = te.ID AND te.DAT_REMOVED is null AND (te.NUM_MATRICULATION = '" + value + "' OR te.NUM_CARD = '" + value + "') AND c.TXT_ROOM = '" + classroom + "' "
                str_order_limit = "order by s.DAT_END limit 1;"
                query = str_select + str_from + str_where + str_order_limit
                errorMsg = "It wasn't possible to validate teacher"
                executeQuery(self, query, errorMsg)
                
        def delete_db_matriculation(self,table,arg):
                query = "delete from " + table + " where NUM_MATRICULATION = '" + str(arg) + "'"
                errorMsg = "It wasn't possible to delete the " + table[2:] + " from the table"
                executeQuery(self, query, errorMsg)
                
        def delete_db_card(self,table,arg):
                query = "delete from " + table + " where NUM_CARD = " + str(arg)
                errorMsg = "It wasn't possible to delete the " + table[2:] + " from the table"
                executeQuery(self, query, errorMsg)
                
        def update_db_name_name(self,table,new,old):
                query = "update " + table + " set TXT_NAME = '" + str(new) + "' where TXT_NAME = '" + str(old) + "'"
                errorMsg = "It wasn't possible to update the " + table[2:] + " in the table"
                executeQuery(self, query, errorMsg)
                
        def update_db_name_matriculation(self,table,new,old):
                query = "update " + table + " set TXT_NAME = '" + str(new) + "' where NUM_MATRICULATION = '" + str(old) + "'"
                errorMsg = "It wasn't possible to update the " + table[2:] + " in the table"
                executeQuery(self, query, errorMsg)
                
        def update_db_name_card(self,table,new,old):
                query = "update " + table + " set TXT_NAME = '" + str(new) + "' where NUM_CARD = " + str(old)
                errorMsg = "It wasn't possible to update the " + table[2:] + " in the table"
                executeQuery(self, query, errorMsg)
                        
        def update_db_matriculation_matriculation(self,table,new,old):
                query = "update " + table + " set NUM_MATRICULATION = '" + str(new) + "' where NUM_MATRICULATION = '" + str(old) + "'"
                errorMsg = "It wasn't possible to update the " + table[2:] + " in the table"
                executeQuery(self, query, errorMsg)
                
        def update_db_matriculation_name(self,table,new,old):
                query = "update " + table + " set NUM_MATRICULATION = '" + str(new) + "' where TXT_NAME = '" + str(old) + "'"
                errorMsg = "It wasn't possible to update the " + table[2:] + " in the table"
                executeQuery(self, query, errorMsg)
                        
        def update_db_matriculation_card(self,table,new,old):
                query = "update " + table + " set NUM_MATRICULATION = '" + str(new) + "' where NUM_CARD = " + str(old)
                errorMsg = "It wasn't possible to update the " + table[2:] + " in the table"
                executeQuery(self, query, errorMsg)
                
        def update_db_card_card(self,table,new,old):
                query = "update " + table + " set NUM_CARD = " + str(arg1) + " where NUM_CARD = " + str(arg2)
                errorMsg = "It wasn't possible to update the " + table[2:] + " in the table"
                executeQuery(self, query, errorMsg)
                
        def update_db_card_name(self,table,new,old):
                query = "update " + table + " set NUM_CARD = " + str(arg1) + " where TXT_NAME = '" + str(old) + "'"
                errorMsg = "It wasn't possible to update the " + table[2:] + " in the table"
                executeQuery(self, query, errorMsg)

        def update_db_card_matriculation(self,table,new,old):
                query = "update " + table + " set NUM_CARD = " + str(arg1) + " where NUM_MATRICULATION = '" + str(old) + "'"
                errorMsg = "It wasn't possible to update the " + table[2:] + " in the table"
                executeQuery(self, query, errorMsg)
                
