package Arduino;

import java.sql.*;

public class Conn 
{
    private static final String DRIVER = "com.mysql.jdbc.Driver";
    private static final String DATABASE = "teste";
    private static final String SERVER = "localhost";
    private static final String SQL_CONNECTION = "jdbc:mysql://"+SERVER+":3306/"+DATABASE;

    private static final String USER = "root";
    private static final String PASSWORD = "root";
    
    private static final Connection Conn = openConn();

    public static Connection getConexao() {
        return Conn;
    }

    @SuppressWarnings("UseSpecificCatch")
    public static Connection openConn(){
            try{
                    Class.forName(DRIVER);
                    Connection conn=DriverManager.getConnection(SQL_CONNECTION, USER, PASSWORD);
                    return conn;
            }catch(Exception es){
                    return null;
            }
    }
}
