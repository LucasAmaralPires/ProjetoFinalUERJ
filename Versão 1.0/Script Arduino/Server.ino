#include <SPI.h>
#include "nRF24L01.h"
#include "RF24.h"

RF24 radio(8,7);
const uint64_t pipes[2] = { 0xF0F0F0F0E1LL, 0xF0F0F0F0D2LL };

void setup(void)
{
  Serial.begin(57600);
  radio.begin();
  radio.setRetries(15,15);
  radio.openWritingPipe(pipes[1]);
  radio.openReadingPipe(1,pipes[0]);
  radio.startListening();
}

void loop(void)
{
  if (radio.available())
  {
    char Q_number[20] = "";
    int len;
    bool done = false;
    while (!done)
    {
      len = radio.getDynamicPayloadSize();
      done = radio.read( &Q_number, len );
      Serial.println(Q_number);
      delay(20);
    }
    radio.stopListening();   
    unsigned long started_waiting_at = millis();
    bool timeout = false;
    while (Serial.available() <= 0 && ! timeout )
      if (millis() - started_waiting_at > 200 )
        timeout = true;
    if(!timeout)
    {
      unsigned long res = Serial.read();
      radio.write( &res, sizeof(unsigned long) );
      Serial.println(res);
    }
    radio.startListening();
  }
}
