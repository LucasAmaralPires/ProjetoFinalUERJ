package Arduino;

import java.sql.*;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
//import gnu.io.*;
import gnu.io.CommPortIdentifier; 
	import gnu.io.SerialPort;
import gnu.io.SerialPortEvent; 
import gnu.io.SerialPortEventListener; 
import java.util.Enumeration;

import com.sun.org.apache.xalan.internal.utils.Objects;

public class SerialTest implements SerialPortEventListener 
{
	SerialPort serialPort;
        /** The port we're normally going to use. */
	private final int STANDARD_MODE = 1;
	private final int ACCESS_GRANTED = 2;
	private final int TEACHER_MODE = 3;
	private final int CARD_ACCEPTED = 4;
	private final int STUDENT_ERASED = 5;
	private final int STUDENT_INSERTED = 6;
	private final int TEACHER_CONFIRMED = 7;
	private final int ACCESS_DENIED = 8;
	
	private boolean alreadyTeacher = false; //Verify if is Teacher in Teacher Mode
	private boolean isAdd = false; //Check if is adding a new entry in Teacher Mode.
	private boolean edit = false; //Check Teacher Mode
	private String auditProfessor = ""; //This is for Audit when The Professor adds or deletes someone.

	private String numCardAdd;
	private static final String PORT_NAMES[] = 
	{ 
			"/dev/tty.usbserial-A9007UX1", // Mac OS X
                        "/dev/ttyACM0", // Raspberry Pi
			"/dev/ttyUSB0", // Linux
			"COM3", 
			"COM4", // Windows
	};
	/**
	* A BufferedReader which will be fed by a InputStreamReader 
	* converting the bytes into characters 
	* making the displayed results codepage independent
	*/
	private BufferedReader input;
	/** The output stream to the port */
	private OutputStream output;
	/** Milliseconds to block while waiting for port open */
	private static final int TIME_OUT = 2000;
	/** Default bits per second for COM port. */
	private static final int DATA_RATE = 57600;

	@SuppressWarnings("rawtypes")
	public void initialize() 
	{
		CommPortIdentifier portId = null;
		Enumeration portEnum = CommPortIdentifier.getPortIdentifiers();

		//First, Find an instance of serial port as set in PORT_NAMES.
		while (portEnum.hasMoreElements()) 
		{
			CommPortIdentifier currPortId = (CommPortIdentifier) portEnum.nextElement();
			for (String portName : PORT_NAMES) 
			{
				if (currPortId.getName().equals(portName)) 
				{
					portId = currPortId;
					break;
				}
			}
		}
		if (portId == null) 
		{
			System.out.println("Could not find COM port.");
			return;
		}
		try 
		{
			// open serial port, and use class name for the appName.
			serialPort = (SerialPort) portId.open(this.getClass().getName(),
					TIME_OUT);

			// set port parameters
			serialPort.setSerialPortParams(DATA_RATE,
					SerialPort.DATABITS_8,
					SerialPort.STOPBITS_1,
					SerialPort.PARITY_NONE);

			// open the streams
			input = new BufferedReader(new InputStreamReader(serialPort.getInputStream()));
			output = serialPort.getOutputStream();
			// add event listeners
			serialPort.addEventListener(this);
			serialPort.notifyOnDataAvailable(true);
		}
		catch (Exception e) 
		{
			System.err.println(e.toString());
		}
	}

	/**
	 * Handle an event on the serial port. Read the data and print it.
	 */
	public synchronized void serialEvent(SerialPortEvent oEvent) 
	{
		if (oEvent.getEventType() == SerialPortEvent.DATA_AVAILABLE) 
		{
			try 
			{
				String inputLine=input.readLine();
				System.out.println(inputLine);
				if(edit == true) 
					TeacherMode(inputLine);
				else 
					ReceiveInitialInput(inputLine);
			} 
			catch (Exception e) 
			{
				System.out.println("Couldn't read input.");
//				System.err.println(e.toString());
			}
		}
	}
	
	public int ReceiveInitialInput (String input) throws Exception
	{
		if(Objects.equals("!", input))
		{
			//Enter/Exit Teacher Mode
			if(!edit)
			{
				SendMsgArduino(TEACHER_MODE);
			}
			else
			{
				SendMsgArduino(STANDARD_MODE);
			}
			edit = !edit;
		}
		else if(edit == true){}
		else
		{
			//Check if Input is in DB
			if(input.length() > 20 || input.length() == 0) {
				System.out.println("Empty input or Large input.");
			}else {
				boolean answer = false;
				String query = "Select * from Pessoa where matricula = '" + input + "' or nCartao = '" + input + "';";
				answer = executeSQL(query);
				if(answer == true)
				{
					sendAudit(input, "accessGranted", null);
					SendMsgArduino(ACCESS_GRANTED);
				}
				else
				{
					sendAudit(input, "accessDenied", null);
					SendMsgArduino(ACCESS_DENIED);
				}				
			}
		}
		return 0;
	}
	
	public void TeacherMode(String input) throws Exception
	{
		System.out.println("Entering TeacherMode.");
		boolean answer = false;
		if(alreadyTeacher == false)
		{
			//Check if input is a Teacher in Teacher Mode
			String query = "Select * from Pessoa where nCartao = '" + input + "' and isProf = 1;";
			answer = executeSQL(query);
			if(answer == true)
			{
				SendMsgArduino(TEACHER_CONFIRMED);
				auditProfessor = input;
				alreadyTeacher = true;
			}
			else
			{
				edit = false;
				SendMsgArduino(STANDARD_MODE);
			}
		}
		else
		{
			//After validating Teacher actions
			if(isAdd == false)
			{
				//Check new input to add or delete an entry.
				String query = "Select * from Pessoa where nCartao = '" + input + "';";
				answer = executeSQL(query);
				if(answer == true)
				{
					//It`s an existing entry. Deleting. 
					String query2 = "Delete from pessoa where nCartao = '" + input + "' and isProf = 0;";
					executeSQLUpdate(query2);
					sendAudit(auditProfessor, "personDeleted", input);
					edit = false;
					alreadyTeacher = false;
					SendMsgArduino(STUDENT_ERASED);
				}
				else
				{
					//It`s a new entry. Proceed to Add Student.
					numCardAdd = input;
					isAdd = true;
					SendMsgArduino(CARD_ACCEPTED);
				}
			}
			else
			{
				//Insert new Entry.
				String query = "Insert into Pessoa (matricula, nCartao, isProf) values ('" + input + "', '" + numCardAdd + "', false);";
				executeSQLUpdate(query);
				sendAudit(auditProfessor, "personAdded", numCardAdd);
				SendMsgArduino(STUDENT_INSERTED);
				isAdd = false;
				edit = false;
				alreadyTeacher = false;
			}
		}
	}
	
    private static boolean executeSQL(String query) throws Exception
    {
    	Connection conn=Conn.openConn();
    	Statement stat=conn.createStatement();
    	try{
    		//System.out.println(query);
    		boolean r;
    		ResultSet rs = null;
    		rs=stat.executeQuery(query);
    		r = rs.first();
    		return r;    		
    	}catch(Exception e){
    		System.out.println("Couldn't connect to DB.");
    		System.out.println(e);
    	}finally {
    		conn.close();    		
    		stat.close();
    	}
    	return false;
    }
    
    private static void executeSQLUpdate(String query) throws Exception
    {
		Connection conn=Conn.openConn();
	    Statement stat=conn.createStatement();
	    try {
	    	stat.executeUpdate(query);	    	
	    }catch(Exception e){
	    	System.out.println(e);
	    }finally {	    	
	    	stat.close();
	    	conn.close();
	    }
    }
  
    private void SendMsgArduino (int cod)
	{
		try
		{
			output.write(cod);
		}
		catch(Exception e){};
	}
    
	public synchronized void close() 
	{
		if (serialPort != null) 
		{
			serialPort.removeEventListener();
			serialPort.close();
		}
	}
	
	public void sendAudit(String user, String tipoMensagem, String target) {
		String message = "";
		
		if(tipoMensagem == "accessGranted") {
			message = "Access granted";
		}else if(tipoMensagem == "personDeleted"){
			message = "Professor deleted Person "+ target;
		}else if(tipoMensagem == "personAdded"){
			message = "Professor added Person "+ target;
		}else if(tipoMensagem == "accessDenied"){
			message = "Access denied";
		}
		else {
			System.out.println("Problem with code for Audit.");
		}
		
		try {
			String query = "Insert into Audit (id, hora, usuario, mensagem) values (0, NOW(), '"+user+"',  '" + message + "');";
			executeSQLUpdate(query);
		} catch (Exception e) {
			System.out.println("Problem commiting to Audit.");
			System.out.println(e);
		};
		
		return;
	}
	
	public static void main(String[] args) throws Exception
	{
		SerialTest main = new SerialTest();
		main.initialize();
		Thread t=new Thread() 
		{
			public void run() 
			{
				//the following line will keep this app alive for 1000 seconds,
				//waiting for events to occur and responding to them (printing incoming messages to console).
				try {Thread.sleep(1000000);
				} catch (InterruptedException ie) {}
			}
		};
		t.start();
		System.out.println("Started");
	}
}
