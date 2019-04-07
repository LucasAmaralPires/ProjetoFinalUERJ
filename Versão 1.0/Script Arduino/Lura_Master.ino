#include <RF24.h>
#include <RF24Network.h>
#include <SPI.h>

RF24 radio(12, 11);              // nRF24L01 (CE,CSN)
RF24Network network(radio);      // Include the radio in the network
const uint16_t this_node = 01;   // Address of our node in Octal format ( 04,031, etc)
const uint16_t master = 00;

void setup()
{
  Serial.begin(9600);
  radio.begin();
  network.begin(90, this_node); //(channel, node address)
}

void wireless_write(String env)
{
  char send_t[24];
  String text = env;
  text.toCharArray(send_t, 24);
  SPI.begin();
  network.update();
  RF24NetworkHeader header(master);
 // Serial.println("Sending message.");
  bool ok = network.write(header, send_t, 24);
 // Serial.println("Message sent.");
  delay(100);
  SPI.end();
}

void loop()
{
  SPI.begin();
  network.update();
  while (network.available())
  {
    RF24NetworkHeader header;
    char text[32] = "";
    network.read(header, &text, sizeof(text));
    Serial.println(text);
  }
  SPI.end();
}

void serialEvent()
{
  String sendmessage;
  int i = 0;
  if (Serial.available())
  {
    sendmessage = Serial.readStringUntil('\n');
    Serial.println(sendmessage);
    wireless_write(sendmessage);
  }
}
