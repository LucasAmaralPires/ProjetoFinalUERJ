#include <SPI.h>
#include <RF24.h>
#include <RF24Network.h>
#include <MFRC522.h>
#include <LiquidCrystal.h>
#define red 45
#define blue 47
#define green 46
#define SS_PIN 53
#define RST_PIN 38

LiquidCrystal lcd(48, 49, 50, 51, 52, 53);
MFRC522 mfrc522(SS_PIN, RST_PIN);   
RF24 radio(12,11);               
RF24Network network(radio);
    
const uint16_t this_node = 01;
char st[20];
char digt[15];
int cont_di;
long old_time, new_time;
bool ins_cartao,dig_mat;

void setup() 
{
  lcd.begin(16, 2);
  cont_di = 0;
  ins_cartao = false;
  dig_mat = false;
  pinMode(red,OUTPUT);
  pinMode(blue,OUTPUT);
  pinMode(green,OUTPUT);
  //Pinos ligados aos pinos 1, 2, 3 e 4 do teclado - Linhas
  pinMode(3, OUTPUT);
  pinMode(4, OUTPUT);
  pinMode(5, OUTPUT);
  pinMode(6, OUTPUT);
  //Pinos ligados aos pinos 5, 6, 7 e 8 do teclado - Colunas
  pinMode(7, INPUT);
  pinMode(2, INPUT);
  pinMode(8, INPUT);
  mfrc522.PCD_Init();   // Inicia MFRC522
  pinMode(10,OUTPUT);
  digitalWrite(10,LOW);
  Serial.begin(9600);
  radio.begin();
  network.begin(90, this_node);
  digitalWrite(red, HIGH);  
  Serial.println("Aguardando acionamento das teclas ou leitura de cartão...");
  Serial.println();
}

void wireless()
{
    SPI.begin();
    network.update();
    while(network.available()) 
    {
      RF24NetworkHeader header;
      char text[32] = "";
      network.read(header, &text, sizeof(text));
      Serial.println(text);    
    }
    SPI.end();
}

void loop() 
{
    new_time = millis();
    wireless();
    for (int ti = 3; ti<7; ti++)
    {
      if(dig_mat == false)
      {
        SPI.begin();      // Inicia  SPI bus
        if (mfrc522.PICC_IsNewCardPresent()) 
        {
          if (mfrc522.PICC_ReadCardSerial()) 
          {
            String conteudo= "";
            byte letra;
            for (byte i = 0; i < mfrc522.uid.size; i++) 
            {
              Serial.print(mfrc522.uid.uidByte[i] < 0x10 ? " 0" : "");
              Serial.print(mfrc522.uid.uidByte[i], HEX);
              conteudo.concat(String(mfrc522.uid.uidByte[i] < 0x10 ? " 0" : ""));
              conteudo.concat(String(mfrc522.uid.uidByte[i], HEX));
            }
            Serial.println();
          }
          delay(1000);
        }
        SPI.end();
      }  
      if(ins_cartao == false)
      {
        //Alterna o estado dos pinos das linhas
        digitalWrite(3, LOW);
        digitalWrite(4, LOW);
        digitalWrite(5, LOW);
        digitalWrite(6, LOW);
        digitalWrite(ti, HIGH);
        //Verifica se alguma tecla da coluna 1 foi pressionada
        if (digitalRead(7) == HIGH)
        {
          imprime_linha_coluna(ti-2, 1);
          while(digitalRead(7) == HIGH){}
        }
    
        //Verifica se alguma tecla da coluna 2 foi pressionada    
        if (digitalRead(2) == HIGH)
        {
          imprime_linha_coluna(ti-2, 2);
          while(digitalRead(2) == HIGH){};
        }
       
        //Verifica se alguma tecla da coluna 3 foi pressionada
        if (digitalRead(8) == HIGH)
        {
          imprime_linha_coluna(ti-2, 3);
          while(digitalRead(8) == HIGH){}
        }
      }   
    }
/*    delay(10);
    if(Serial.available()>0)
    {
      int rec = Serial.read();
      if(rec == 1)
      {
        digitalWrite(red, HIGH);
        digitalWrite(green, LOW);
        digitalWrite(blue, LOW);
      }
      if(rec == 2)
      {
        digitalWrite(10,HIGH);
        lcd.clear();
        lcd.setCursor(5, 0);
        lcd.print("ACESSO");
        lcd.setCursor(4, 1);
        lcd.print("LIBERADO");
        digitalWrite(red, LOW);
        digitalWrite(green, HIGH);
        digitalWrite(blue, LOW);
        old_time = millis();
      }
      if(rec == 3)
      {
        lcd.clear();
        lcd.setCursor(6, 0);
        lcd.print("MODO");
        lcd.setCursor(4, 1);
        lcd.print("PROFESSOR");
        digitalWrite(red, LOW);
        digitalWrite(green, LOW);
        digitalWrite(blue, HIGH);
        delay(3000);
        lcd.clear();
        lcd.setCursor(3, 0);
        lcd.print("CONFIRMAR");
        lcd.setCursor(3, 1);
        lcd.print("PROFESSOR");
      }
      if(rec == 4)
      {        
        lcd.clear();
        lcd.setCursor(6, 0);
        lcd.print("CARTAO");
        lcd.setCursor(5, 1);
        lcd.print("INSERIDO");
        digitalWrite(red, LOW);
        digitalWrite(green, HIGH);
        digitalWrite(blue, LOW);
        delay(2000);        
        digitalWrite(red, LOW);
        digitalWrite(green, LOW);
        digitalWrite(blue, HIGH);
        ins_cartao = false;
        dig_mat = true;
        lcd.clear();
      }
      if(rec == 5)
      {        
        lcd.clear();
        lcd.setCursor(6, 0);
        lcd.print("ALUNO");
        lcd.setCursor(5, 1);
        lcd.print("APAGADO");
        digitalWrite(red, LOW);
        digitalWrite(green, HIGH);
        digitalWrite(blue, LOW);
        delay(2000);        
        digitalWrite(red, HIGH);
        digitalWrite(green, LOW);
        digitalWrite(blue, LOW);
        lcd.clear();
      }      
      if(rec == 6)
      {        
        lcd.clear();
        lcd.setCursor(6, 0);
        lcd.print("ALUNO");
        lcd.setCursor(5, 1);
        lcd.print("INSERIDO");
        digitalWrite(red, LOW);
        digitalWrite(green, HIGH);
        digitalWrite(blue, LOW);
        delay(2000);        
        digitalWrite(red, HIGH);
        digitalWrite(green, LOW);
        digitalWrite(blue, LOW);
        dig_mat = false;
        lcd.clear();
      }
      if(rec == 7)
      {        
        lcd.clear();
        ins_cartao = true;
        lcd.setCursor(3, 0);
        lcd.print("PROFESSOR");
        lcd.setCursor(3, 1);
        lcd.print("CONFIRMADO");
        digitalWrite(red, LOW);
        digitalWrite(green, HIGH);
        digitalWrite(blue, LOW);
        delay(2000);        
        digitalWrite(red, LOW);
        digitalWrite(green, LOW);
        digitalWrite(blue, HIGH);
        lcd.clear();
      }
      if(rec == 8)
      {        
        digitalWrite(10,LOW);
        lcd.clear();
        ins_cartao = true;
        lcd.setCursor(5, 0);
        lcd.print("ACESSO");
        lcd.setCursor(5, 1);
        lcd.print("NEGADO");
        delay(2000);        
        lcd.clear();
      }
    }
    if((!digitalRead(red)) && (digitalRead(green)) && ((new_time - old_time)>5000))
    {
      digitalWrite(10,LOW);
      digitalWrite(red,HIGH);
      digitalWrite(green,LOW); 
    }
    if(digitalRead(red))
    {
      ins_cartao = false;
      dig_mat = false;
      lcd.clear();
    }*/
}

void imprime_linha_coluna(int x, int y)
{
//  Serial.println();
  switch(x)
  {
    case 1:
      switch(y)
      {
        case 1:
          digt[cont_di++] = '1';
          break;
        case 2:
          digt[cont_di++] = '2';
          break;
        case 3:
          digt[cont_di++] = '3';
          break;
      }
      break;
    case 2:
      switch(y)
      {
        case 1:
          digt[cont_di++] = '4';
          break;
        case 2:
          digt[cont_di++] = '5';
          break;
        case 3:
          digt[cont_di++] = '6';
          break;
      }
      break;
    case 3:
      switch(y)
      {
        case 1:
          digt[cont_di++] = '7';
          break;
        case 2:
          digt[cont_di++] = '8';
          break;
        case 3:
          digt[cont_di++] = '9';
          break;
      }
      break;
    case 4:
      switch(y)
      {
        case 1:
          for(int i = 0;i<cont_di;i++)
          {
            digt[i] = 0;
          }
          cont_di = 0;
          break;
        case 2:
          digt[cont_di++] = '0';
          break;
        case 3:
          if(cont_di != 0)
          {
            Serial.println(digt);
            delay(1000);
            for(int i = 0;i<cont_di;i++)
            {
              digt[i] = 0;
            }
            cont_di = 0;
          }
          else
          {
            Serial.println("!");
          }
          break;
      }
      break;
  }
}
