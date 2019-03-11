#include <RF24/RF24.h>
#include <RF24Network/RF24Network.h>
#include <iostream>
#include <ctime>
#include <stdio.h>
#include <time.h>
#include <cppconn/driver.h>
#include <cppconn/exception.h>
#include <cppconn/resultset.h>
#include <cppconn/statement.h>
#include "mysql_connection.h"
#include "mysql_driver.h"

using namespace std;

RF24 radio(RPI_V2_GPIO_P1_15, BCM2835_SPI_CS0, BCM2835_SPI_SPEED_8MHZ);  

RF24Network network(radio);

// Address of our node in Octal format
const uint16_t this_node = 01;

// Address of the other node in Octal format (01,021, etc)
const uint16_t other_node = 00;

const unsigned long interval = 2000; //ms  // How often to send 'hello world to the other unit

unsigned long last_sent;             // When did we last send?
unsigned long packets_sent;          // How many have we sent already


struct payload_t 
{                  
	char ms[30];
	unsigned long counter;
};

int main(int argc, char** argv) 
{
	radio.begin();
	network.begin(/*channel*/ 90, /*node address*/ this_node);
	try 
	{
		sql::Driver *driver;
		sql::Connection *con;
		sql::Statement *stmt;
		sql::ResultSet *res;
		driver = get_driver_instance();
		con = driver->connect("localhost", "Lucas", "08960663");
		  /* Connect to the MySQL test database */
		con->setSchema("Lura");
		stmt = con->createStatement();
		res = stmt->executeQuery("SELECT * From T_STUDENT;");	
		while (res->next()) 
		{
		    cout << res->getString(4) << endl;
		}
		delete res;
		delete stmt;
		delete con;
  	}
 	catch (sql::SQLException &e) 
	{
		cout << "# ERR: SQLException in " << __FILE__;
		cout << "(" << __FUNCTION__ << ") on line " << __LINE__ << endl;
		cout << "# ERR: " << e.what();
		cout << " (MySQL error code: " << e.getErrorCode();
		cout << ", SQLState: " << e.getSQLState() << " )" << endl;
	}
	delay(5);
	radio.printDetails();	
	while(1)
	{
		network.update();
  		while ( network.available() ) 
		{	
			RF24NetworkHeader header;        // If so, grab it and print it out
   			payload_t payload;
  			network.read(header,&payload,sizeof(payload));
			printf("Received payload # %lu at %s \n",payload.counter,payload.ms);
		}		  
		delay(2000);
	}
	return 0;
}
