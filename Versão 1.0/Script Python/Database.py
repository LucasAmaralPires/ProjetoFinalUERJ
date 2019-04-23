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

        def executeInsertDeleteQuery(self,query,errorMsg):
                db = self.connect()
                if db != False:
                        try:
                                curs = db.cursor()
                                curs.execute(query)
                                db.commit()
                        except pymysql.DatabaseError:
                                print(errorMsg)
                        self.disconnect(db)

        def executeQuery(self, query, errorMsg):
##                worked = False
                result_row = None
                db = self.connect()
                if db != False:
                        try:
                                curs = db.cursor()
                                curs.execute(query)
                                db.commit()
                                result_row = curs.fetchone()
##                                if result_row:
##                                        worked = True
##                                for reading in curs.fetchall():
##                                        for i in reading:
##                                                print (str(i) + "  ",end = "")
##                                        print()
##                                worked = True
                        except pymysql.DatabaseError:
                                print(errorMsg)
                        self.disconnect(db)
                return result_row

        def executeQueries(self, queries, errorMsg):
                worked = False
                db = self.connect()
                if db != False:
                        try:
                                curs = db.cursor()
                                for query in queries:
                                        curs.execute(query)
                                        for reading in curs.fetchall():
                                                for i in reading:
                                                        print (str(i) + "  ",end = "")
                                                print()
                                worked = True
                        except pymysql.DatabaseError:
                                print(errorMsg)
                        self.disconnect(db)
                return worked

               
        def select_db(self, table):
                query = "select * from " + table
                errorMsg = "It wasn't possible to gather the data from table"
                return self.executeQuery(query, errorMsg)
                                
        def insert_db(self,table,matriculation,ncard,name):
                query = "insert into " + table + " values(0,'" + str(matriculation) + "'," + str(ncard) + ",'" + str(name) + "', now())"
                errorMsg = "It wasn't possible to insert the " + table[2:] + " in the table"
                return self.executeQuery(query, errorMsg)
                
        def delete_db_name(self,table,arg):
                query = "delete from " + table + " where TXT_NAME = '" + str(arg) + "'"
                errorMsg = "It wasn't possible to delete the " + table[2:] + " from the table"
                return self.executeQuery(query, errorMsg)
                
        def class_happening(self,classroom):
                str_select = "select l.ID, l.DAT_DAY_OF_LECTURE, c.NUM_CLASS, c.ID, c.TXT_SEMESTER, cr.TXT_ROOM "
                str_from = "from T_LECTURE l left join T_SCHEDULE_CLASS sc on l.ID_SCHEDULE_CLASS = sc.ID left join T_SCHEDULE s on sc.ID_SCHEDULE = s.ID left join T_CLASS c on sc.ID_CLASS = c.ID left join T_CLASSROOM_CLASS cc ON cc.ID_CLASS = sc.ID_CLASS left join T_CLASSROOM cr ON cc.ID_CLASSROOM = cr.ID "
                str_where = "where DATE(l.DAT_DAY_OF_LECTURE) = DATE(NOW()) AND cr.TXT_ROOM = '" + classroom + "';"
                query = str_select + str_from + str_where
                errorMsg = "There is no class in this room at this time"
                return self.executeQuery(query, errorMsg)
                
        def student_in_class(self, clas_s,value):
                str_select = "select c.ID, c.NUM_CLASS, c.TXT_SEMESTER,	s.ID, s.TXT_NAME "
                str_from = "from T_SCHEDULE_CLASS sc left join T_CLASS c on sc.ID_CLASS = c.ID left join T_STUDENT_CLASS stc ON stc.ID_CLASS = sc.ID_CLASS left join T_STUDENT s ON stc.ID_STUDENT = s.ID "
                str_where = "where (s.NUM_MATRICULATION = '" + value + "' OR s.NUM_CARD = '" + value + "') AND c.ID = '" + str(clas_s[3]) + "' "
                str_limit = "limit 1;"
                errorMsg = "The student is not enrolled in this class"
                query = str_select + str_from + str_where + str_limit
                print (query)
                return self.executeQuery(query,errorMsg)

        def mark_attendance(self,classroom,value):
                result_lec = self.class_happening(classroom)
                if result_lec:
                        result_student = self.student_in_class(result_lec,value)
                        print(result_student)
                        if result_student:
                                query = "INSERT INTO T_ATTENDANCE VALUES (0," + str(result_lec[0]) + "," + str(result_student[3]) + ",NOW());"
                                errorMsg = "The student is not enrolled in this class"
                                self.executeInsertDeleteQuery(query, errorMsg)
                                return True
                        return False
                return False
        
        def validate_teacher(self,classroom,value):
                str_select = "select l.ID, l.DAT_DAY_OF_LECTURE, sc.ID_CLASS, te.NUM_CARD, te.NUM_MATRICULATION,s.DAT_END "
                str_from = "from T_LECTURE l, T_SCHEDULE_CLASS sc, T_SCHEDULE s, T_TEACHER_CLASS tc, T_TEACHER te, T_CLASSROOM c, T_CLASSROOM_CLASS cc "
                str_where = "where TIME(NOW()) < TIME(s.DAT_END) AND DATE(NOW()) = DATE(l.DAT_DAY_OF_LECTURE) AND l.ID_SCHEDULE_CLASS = sc.ID AND cc.ID_CLASSROOM = c.ID AND cc.ID_CLASS = sc.ID_CLASS AND sc.ID_SCHEDULE = s.ID AND tc.ID_CLASS = sc.ID_CLASS AND tc.ID_TEACHER = te.ID AND te.DAT_REMOVED is null AND (te.NUM_MATRICULATION = '" + value + "' OR te.NUM_CARD = '" + value + "') AND c.TXT_ROOM = '" + classroom + "' "
                str_order_limit = "order by s.DAT_END limit 1;"
                query = str_select + str_from + str_where + str_order_limit
                errorMsg = "It wasn't possible to validate teacher"
                result = self.executeQuery(query, errorMsg)
                if result:
                        return True
                else:
                        return False

        def insert_delete_student_class(self,classroom,value):
                result_lec = self.class_happening(classroom)
                if result_lec:
                        result_student = self.student_in_class(result_lec,value)
                        print("E:  ",end = '')
                        print(result_student)
                        if result_student:
                                str_delete = "DELETE FROM T_STUDENT_CLASS "
                                str_where = "WHERE T_STUDENT_CLASS.ID_STUDENT = " + str(result_student[3]) + " AND T_STUDENT_CLASS.ID_CLASS = " + str(result_student[0]) + ";"
                                query = str_delete + str_where
                                errorMsg = "it wasn't possible to delete student"
                                self.executeInsertDeleteQuery(query,errorMsg)
                                return "3\n"
                        else: 
                                query = "INSERT INTO T_STUDENT_CLASS VALUES (0," + str(result_lec[3]) + "," + str(result_lec[3]) + ",NOW());"
                                errorMsg = "It wasn't possible to insert student"
                                self.executeInsertDeleteQuery(query,errorMsg)
                                return "4\n"                              
                        return "8\n"
                return "8\n"
                

##        def insert_student_class(self,classroom,value):
##                result_lec = self.class_happening(classroom)
##                if result_lec:
##                        result_student = self.student_in_class(result_lec,value)
##                        print(result_student)
##                        if result_student:
##                                query = "INSERT INTO T_STUDENT_CLASS VALUES (0," + str(result_student[3]) + "," + str(result_student[0]) + ",NOW());"
##                                errorMsg = "It wasn't possible to insert student"
##                                self.executeInsertDeleteQuery(query,errorMsg)
##                                return True
##                        return False
##                return False

        def add_student_database(self,mat,card):
                query = "INSERT INTO T_STUDENT VALUES (0,'" + mat + "','" + card + "','',NULL);"
                errorMsg = "It wasnt's possible to insert student"
                self.executeInsertDeleteQuery(query,errorMsg)

        def validate_card(self,value):
                query = "Select * from T_STUDENT WHERE NUM_CARD = '" + value + "';"
                errorMsg = "It wasn't possible to validate card"
                result = self.executeQuery(query, errorMsg)
                if result:
                        return True
                else:
                        return False

        def link_card_matriculation(self,mat,card):
                query = "UPDATE T_STUDENT SET NUM_CARD = '" + card + "' WHERE NUM_MATRICULATION = '" + mat + "';"
                errorMsg = "It wasnt's possible to update student data"
                self.executeInsertDeleteQuery(query,errorMsg)                
                
        def delete_db_matriculation(self,table,arg):
                query = "delete from " + table + " where NUM_MATRICULATION = '" + str(arg) + "'"
                errorMsg = "It wasn't possible to delete the " + table[2:] + " from the table"
                return self.executeQuery(query, errorMsg)
                
        def delete_db_card(self,table,arg):
                query = "delete from " + table + " where NUM_CARD = " + str(arg)
                errorMsg = "It wasn't possible to delete the " + table[2:] + " from the table"
                return self.executeQuery(query, errorMsg)
                
        def update_db_name_name(self,table,new,old):
                query = "update " + table + " set TXT_NAME = '" + str(new) + "' where TXT_NAME = '" + str(old) + "'"
                errorMsg = "It wasn't possible to update the " + table[2:] + " in the table"
                return self.executeQuery(query, errorMsg)
                
        def update_db_name_matriculation(self,table,new,old):
                query = "update " + table + " set TXT_NAME = '" + str(new) + "' where NUM_MATRICULATION = '" + str(old) + "'"
                errorMsg = "It wasn't possible to update the " + table[2:] + " in the table"
                return self.executeQuery(query, errorMsg)
                
        def update_db_name_card(self,table,new,old):
                query = "update " + table + " set TXT_NAME = '" + str(new) + "' where NUM_CARD = " + str(old)
                errorMsg = "It wasn't possible to update the " + table[2:] + " in the table"
                return self.executeQuery(query, errorMsg)
                        
        def update_db_matriculation_matriculation(self,table,new,old):
                query = "update " + table + " set NUM_MATRICULATION = '" + str(new) + "' where NUM_MATRICULATION = '" + str(old) + "'"
                errorMsg = "It wasn't possible to update the " + table[2:] + " in the table"
                return self.executeQuery(query, errorMsg)
                
        def update_db_matriculation_name(self,table,new,old):
                query = "update " + table + " set NUM_MATRICULATION = '" + str(new) + "' where TXT_NAME = '" + str(old) + "'"
                errorMsg = "It wasn't possible to update the " + table[2:] + " in the table"
                return self.executeQuery(query, errorMsg)
                        
        def update_db_matriculation_card(self,table,new,old):
                query = "update " + table + " set NUM_MATRICULATION = '" + str(new) + "' where NUM_CARD = " + str(old)
                errorMsg = "It wasn't possible to update the " + table[2:] + " in the table"
                return self.executeQuery(query, errorMsg)
                
        def update_db_card_card(self,table,new,old):
                query = "update " + table + " set NUM_CARD = " + str(arg1) + " where NUM_CARD = " + str(arg2)
                errorMsg = "It wasn't possible to update the " + table[2:] + " in the table"
                return self.executeQuery(query, errorMsg)
                
        def update_db_card_name(self,table,new,old):
                query = "update " + table + " set NUM_CARD = " + str(arg1) + " where TXT_NAME = '" + str(old) + "'"
                errorMsg = "It wasn't possible to update the " + table[2:] + " in the table"
                return self.executeQuery(query, errorMsg)

        def update_db_card_matriculation(self,table,new,old):
                query = "update " + table + " set NUM_CARD = " + str(arg1) + " where NUM_MATRICULATION = '" + str(old) + "'"
                errorMsg = "It wasn't possible to update the " + table[2:] + " in the table"
                return self.executeQuery(query, errorMsg)
                
